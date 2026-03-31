import React, { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WorkoutStopModal from "../components/WorkoutStopModal";
import { nextWarmup, completeWarmup } from "../api/workoutAPI";
import "../styles/workout_warmup_style.scss";
import "../styles/header_footer.scss";
import "../styles/fonts.scss";

const WorkoutWarmupPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userWorkoutId } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [warmup, setWarmup] = useState(location.state?.warmup || null);

  const [showStopModal, setShowStopModal] = useState(false);
  const [completing, setCompleting] = useState(false);

  const handleNext = async () => {
    if (!warmup?.id) {
      setError("Данные разминки не найдены");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("📤 Getting next warmup:", {
        userWorkoutId,
        currentWarmupId: warmup.id,
      });

      const response = await nextWarmup(userWorkoutId, warmup.id);
      console.log("✅ Next warmup response:", response);

      if (response?.success) {
        const {
          type,
          warmup: nextWarmupData,
          exercise,
          needs_weight_input,
        } = response.data;

        if (type === "warmup" && nextWarmupData) {
          setWarmup(nextWarmupData);
        } else if (type === "exercise" && exercise) {
          if (needs_weight_input) {
            navigate(`/maximum-definition/${userWorkoutId}/${exercise.id}`, {
              state: { exercise },
            });
          } else {
            navigate(`/workout-exercise/${userWorkoutId}/${exercise.id}`, {
              state: { exercise },
            });
          }
        } else if (type === "completed") {
          navigate("/trainings");
        }
      } else {
        setError(
          response?.message || "Ошибка при переходе к следующему упражнению",
        );
      }
    } catch (err) {
      console.error("❌ Error getting next warmup:", err);
      setError(err.message || "Ошибка при переходе");
    } finally {
      setLoading(false);
    }
  };

  const handleStopWarmup = () => {
    setShowStopModal(true);
  };

  const handleConfirmStop = async () => {
    setCompleting(true);
    setError("");

    try {
      console.log("📤 Completing warmup early:", { userWorkoutId });

      const response = await completeWarmup(userWorkoutId);
      console.log("✅ Complete warmup response:", response);

      if (response?.success) {
        const { type, exercise, needs_weight_input } = response.data;

        if (type === "exercise" && exercise) {
          setShowStopModal(false);
          if (needs_weight_input) {
            navigate(`/maximum-definition/${userWorkoutId}/${exercise.id}`, {
              state: { exercise },
            });
          } else {
            navigate(`/workout-exercise/${userWorkoutId}/${exercise.id}`, {
              state: { exercise },
            });
          }
        } else {
          setShowStopModal(false);
          navigate("/trainings");
        }
      } else {
        setError(response?.message || "Ошибка при завершении разминки");
        setCompleting(false);
      }
    } catch (err) {
      console.error("❌ Error completing warmup:", err);
      setError(err.message || "Ошибка при завершении разминки");
      setCompleting(false);
    }
  };

  const handleCancelStop = () => {
    setShowStopModal(false);
    setError("");
  };

  const handleBack = () => {
    navigate(`/workout-details/${userWorkoutId}`);
  };

  if (!warmup) {
    return (
      <>
        <Header />
        <main className="main-exercise-warm">
          <div className="error-container">
            <p className="error-message">Разминка не найдена</p>
            <button className="back-button" onClick={handleBack}>
              Вернуться к тренировке
            </button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="main-exercise-warm">
        <img src="/img/bg-left.svg" className="bg-left" alt="bg" />

        <section className="warmup-cont">
          <h1>Разминка</h1>
          <p className="warmup-exercise">
            {warmup.name || "Упражнение разминки"}
          </p>
          <img
            src={warmup.image || "/img/training-image.png"}
            alt="warmup"
            onError={(e) => {
              e.target.src = "/img/training-image.png";
            }}
          />
          <p className="description-exercise-warm">
            {warmup.description ||
              `Выполняйте указанное упражнение ${warmup.duration_seconds || 60} секунд`}
          </p>

          {error && !showStopModal && (
            <span className="field_error">{error}</span>
          )}

          <button
            type="button"
            className="next-warm"
            onClick={handleNext}
            disabled={loading || completing}
          >
            {loading ? "Загрузка..." : "Далее"}
          </button>
          <button
            type="button"
            className="stop-warm"
            onClick={handleStopWarmup}
            disabled={loading || completing}
          >
            Закончить разминку
          </button>
        </section>

        <img src="/img/bg-right.svg" className="bg-right" alt="bg" />
      </main>
      <Footer />

      <WorkoutStopModal
        isOpen={showStopModal}
        onConfirm={handleConfirmStop}
        onCancel={handleCancelStop}
        loading={completing}
        error={error}
      />
    </>
  );
};

export default WorkoutWarmupPage;
