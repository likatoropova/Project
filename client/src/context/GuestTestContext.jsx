// src/context/GuestTestContext.jsx - добавьте проверку админа

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
  const { registerGuestCleanup, user } = useAuth();
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [currentExercise, setCurrentExercise] = useState(null);
  const [testInfo, setTestInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [allExercisesCompleted, setAllExercisesCompleted] = useState(false);
  const [validationErrors, setValidationErrors] = useState(null);

  // Если пользователь админ - не инициализируем гостевые данные
  const isAdmin = user?.role_id === 1;

  useEffect(() => {
    // Пропускаем инициализацию для админа
    if (isAdmin) return;

    const savedGuestId = storage.get("guestId");
    if (savedGuestId) {
      axiosInstance.defaults.headers.common["X-Guest-ID"] = savedGuestId;
      setCurrentAttempt(savedGuestId);
    }
  }, [isAdmin]);

  const startGuestTest = useCallback(async (testId) => {
    if (isAdmin) {
      return { success: false, error: "Администраторам не доступны гостевые тесты" };
    }

    setLoading(true);
    setError(null);
    setValidationErrors(null);

    try {
      console.log(`Starting guest test with ID: ${testId}`);
      const response = await axiosInstance.post(`/guest/tests/${testId}/start`);

      if (response.data?.success) {
        const { attempt_id, testing, current_exercise } = response.data.data;

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
        if (err.response.status === 422) {
          errorMessage = "Ошибка валидации данных";
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
  }, [isAdmin]);

  const saveExerciseResult = useCallback(
      async (resultValue) => {
        if (isAdmin) {
          return { success: false, error: "Администраторам не доступны гостевые тесты" };
        }

        if (!currentAttempt) {
          return { success: false, error: "Нет активной попытки" };
        }

        // ... остальной код без изменений
      },
      [currentAttempt, currentExercise, isAdmin],
  );

  const completeGuestTest = useCallback(
      async (pulse) => {
        if (isAdmin) {
          return { success: false, error: "Администраторам не доступны гостевые тесты" };
        }

        if (!currentAttempt) {
          return { success: false, error: "Нет активной попытки" };
        }

        // ... остальной код без изменений
      },
      [currentAttempt, isAdmin],
  );

  const resetGuestTest = useCallback(() => {
    setCurrentAttempt(null);
    setCurrentExercise(null);
    setTestInfo(null);
    setAllExercisesCompleted(false);
    setError(null);
    setValidationErrors(null);
  }, []);

  const clearGuestId = useCallback(() => {
    storage.remove("guestId");
    delete axiosInstance.defaults.headers.common["X-Guest-ID"];
    resetGuestTest();
  }, [resetGuestTest]);

  useEffect(() => {
    if (typeof registerGuestCleanup !== "function") return;
    const unregister = registerGuestCleanup(clearGuestId);
    return unregister;
  }, [registerGuestCleanup, clearGuestId]);

  const value = {
    currentAttempt,
    currentExercise,
    testInfo,
    loading,
    error,
    validationErrors,
    allExercisesCompleted,
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