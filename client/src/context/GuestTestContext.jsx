// client/src/context/GuestTestContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosConfig";
import { storage } from "../utils/storage";
import { useAuth } from "../hooks/useAuth";

const GuestTestContext = createContext(null);

export const useGuestTest = () => {
  const context = useContext(GuestTestContext);
  if (!context) {
    throw new Error("useGuestTest must be used within GuestTestProvider");
  }
  return context;
};

export const GuestTestProvider = ({ children }) => {
  const navigate = useNavigate();
  const { registerGuestCleanup } = useAuth();
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [testInfo, setTestInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allExercisesCompleted, setAllExercisesCompleted] = useState(false);
  const [validationErrors, setValidationErrors] = useState(null);

  // Получаем guestId из localStorage при инициализации
  useEffect(() => {
    const savedGuestId = storage.get("guestId");
    if (savedGuestId) {
      axiosInstance.defaults.headers.common["X-Guest-ID"] = savedGuestId;
      setCurrentAttempt(savedGuestId);
    }
  }, []);

  // Начать тест для гостя
  const startGuestTest = useCallback(async (testId) => {
    setLoading(true);
    setError(null);
    setValidationErrors(null);

    try {
      console.log(`Starting guest test with ID: ${testId}`);
      const response = await axiosInstance.post(`/guest/tests/${testId}/start`);

      if (response.data?.success) {
        const { attempt_id, testing, current_exercise } = response.data.data;

        // Сохраняем guestId в localStorage и заголовки
        if (attempt_id) {
          storage.set("guestId", attempt_id);
          axiosInstance.defaults.headers.common["X-Guest-ID"] = attempt_id;
          setCurrentAttempt(attempt_id);
        }

        setTestInfo(testing);
        setCurrentExercise(current_exercise);
        setAllExercisesCompleted(false);

        return {
          success: true,
          attemptId: attempt_id,
          exercise: current_exercise,
          testing,
        };
      } else {
        throw new Error(response.data?.message || "Failed to start test");
      }
    } catch (err) {
      console.error("Error starting guest test:", err);

      let errorMessage = "Ошибка при начале теста";
      let validationErrors = null;

      if (err.response) {
        // Сервер вернул ответ с ошибкой
        if (err.response.status === 422) {
          errorMessage = "Ошибка валидации данных";
          validationErrors = err.response.data.errors;
          console.error("Validation errors:", err.response.data.errors);
        } else {
          errorMessage =
            err.response.data?.message ||
            err.response.data?.error ||
            errorMessage;
        }
      } else if (err.request) {
        errorMessage = "Сервер не отвечает";
      } else {
        errorMessage = err.message;
      }

      setError(errorMessage);
      setValidationErrors(validationErrors);
      return { success: false, error: errorMessage, validationErrors };
    } finally {
      setLoading(false);
    }
  }, []);

  // Сохранить результат текущего упражнения
  const saveExerciseResult = useCallback(
    async (resultValue) => {
      // Используем currentAttempt из состояния
      if (!currentAttempt) {
        return { success: false, error: "Нет активной попытки" };
      }

      setLoading(true);
      setError(null);
      setValidationErrors(null);

      try {
        console.log(
          `Saving result for attempt ${currentAttempt}:`,
          resultValue,
        );
        console.log("Current exercise:", currentExercise);

        // Проверяем, есть ли текущее упражнение
        if (!currentExercise) {
          return { success: false, error: "Нет активного упражнения" };
        }

        // Отправляем оба обязательных поля: testing_exercise_id и result_value
        const requestData = {
          testing_exercise_id: currentExercise.id, // ID текущего упражнения
          result_value: parseInt(resultValue, 10), // Значение результата
        };

        console.log("Request data:", requestData);

        const response = await axiosInstance.post(
          `/guest/test-attempts/${currentAttempt}/result`,
          requestData,
        );

        console.log("Save result response:", response.data);

        if (response.data?.success) {
          const { next_exercise, all_exercises_completed, message } =
            response.data.data;

          setAllExercisesCompleted(all_exercises_completed);

          if (next_exercise) {
            setCurrentExercise(next_exercise);
          }

          return {
            success: true,
            nextExercise: next_exercise,
            allCompleted: all_exercises_completed,
            message,
          };
        } else {
          throw new Error(response.data?.message || "Failed to save result");
        }
      } catch (err) {
        console.error("Error saving exercise result:", err);

        let errorMessage = "Ошибка при сохранении результата";
        let validationErrors = null;

        if (err.response) {
          console.error("Error response data:", err.response.data);
          console.error("Error response status:", err.response.status);

          if (err.response.status === 422) {
            errorMessage = "Проверьте правильность введенных данных";
            validationErrors = err.response.data.errors;
            console.error("Validation errors:", err.response.data.errors);
          } else {
            errorMessage =
              err.response.data?.message ||
              err.response.data?.error ||
              errorMessage;
          }
        } else if (err.request) {
          errorMessage =
            "Сервер не отвечает. Проверьте подключение к интернету";
        } else {
          errorMessage = err.message;
        }

        setError(errorMessage);
        setValidationErrors(validationErrors);
        return { success: false, error: errorMessage, validationErrors };
      } finally {
        setLoading(false);
      }
    },
    [currentAttempt, currentExercise],
  );

  // Завершить тест с пульсом
  const completeGuestTest = useCallback(
    async (pulse) => {
      if (!currentAttempt) {
        return { success: false, error: "Нет активной попытки" };
      }

      setLoading(true);
      setError(null);
      setValidationErrors(null);

      try {
        console.log(
          `Completing test for attempt ${currentAttempt} with pulse:`,
          pulse,
        );

        const requestData = {
          pulse: parseInt(pulse, 10),
        };

        const response = await axiosInstance.post(
          `/guest/test-attempts/${currentAttempt}/complete`,
          requestData,
        );

        console.log("Complete test response:", response.data);

        if (response.data?.success) {
          // Очищаем текущую попытку после завершения
          setCurrentAttempt(null);
          setCurrentExercise(null);
          setTestInfo(null);
          setAllExercisesCompleted(false);

          // Можно удалить guestId или оставить для истории
          // storage.remove('guestId');
          // delete axiosInstance.defaults.headers.common['X-Guest-ID'];

          return { success: true, data: response.data.data };
        } else {
          throw new Error(response.data?.message || "Failed to complete test");
        }
      } catch (err) {
        console.error("Error completing guest test:", err);

        let errorMessage = "Ошибка при завершении теста";
        let validationErrors = null;

        if (err.response) {
          if (err.response.status === 422) {
            errorMessage = "Ошибка валидации пульса";
            validationErrors = err.response.data.errors;
          } else {
            errorMessage =
              err.response.data?.message ||
              err.response.data?.error ||
              errorMessage;
          }
        } else if (err.request) {
          errorMessage = "Сервер не отвечает";
        } else {
          errorMessage = err.message;
        }

        setError(errorMessage);
        setValidationErrors(validationErrors);
        return { success: false, error: errorMessage, validationErrors };
      } finally {
        setLoading(false);
      }
    },
    [currentAttempt],
  );

  // Сбросить состояние гостевого теста
  const resetGuestTest = useCallback(() => {
    setCurrentAttempt(null);
    setCurrentExercise(null);
    setTestInfo(null);
    setAllExercisesCompleted(false);
    setError(null);
    setValidationErrors(null);
  }, []);

  // Очистить guestId (например, при выходе)
  const clearGuestId = useCallback(() => {
    storage.remove("guestId");
    delete axiosInstance.defaults.headers.common["X-Guest-ID"];
    resetGuestTest();
  }, [resetGuestTest]);

  // Register clearGuestId with AuthContext so it fires automatically on login/logout
  useEffect(() => {
    if (typeof registerGuestCleanup !== "function") return;
    const unregister = registerGuestCleanup(clearGuestId);
    return unregister;
  }, [registerGuestCleanup, clearGuestId]);

  const value = {
    // State
    currentAttempt,
    currentExercise,
    testInfo,
    loading,
    error,
    validationErrors,
    allExercisesCompleted,

    // Methods
    startGuestTest,
    saveExerciseResult,
    completeGuestTest,
    resetGuestTest,
    clearGuestId,
  };

  return (
    <GuestTestContext.Provider value={value}>
      {children}
    </GuestTestContext.Provider>
  );
};

export default GuestTestContext;
