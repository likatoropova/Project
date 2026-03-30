import axiosInstance from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const startWorkout = async (workoutId, withWarmup = false) => {
    try {
        console.log('🎯 Starting workout:', { workoutId, withWarmup });

        const response = await axiosInstance.post(API_ENDPOINTS.START_WORKOUT, {
            workout_id: workoutId,
            with_warmup: withWarmup
        });

        console.log('✅ Workout started:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error starting workout:', error.response?.data);
        throw error.response?.data || { message: 'Ошибка начала тренировки' };
    }
};

// Получить следующее упражнение
export const getNextExercise = async (userWorkoutId, currentExerciseId, weightUsed = null) => {
    try {
        console.log('📤 Getting next exercise:', { userWorkoutId, currentExerciseId, weightUsed });

        const payload = {
            current_exercise_id: currentExerciseId
        };

        if (weightUsed !== null && weightUsed !== undefined) {
            payload.weight_used = weightUsed;
        }

        const response = await axiosInstance.post(API_ENDPOINTS.NEXT_EXERCISE(userWorkoutId), payload);

        console.log('✅ Next exercise response:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error getting next exercise:', error.response?.data);
        throw error.response?.data || { message: 'Ошибка получения следующего упражнения' };
    }
};

// Получить следующую разминку
export const nextWarmup = async (userWorkoutId, currentWarmupId) => {
  try {
    console.log('📤 Getting next warmup:', { userWorkoutId, currentWarmupId });
    
    const response = await axiosInstance.post(API_ENDPOINTS.NEXT_WARMUP(userWorkoutId), {
      current_warmup_id: parseInt(currentWarmupId, 10)
    });
    
    console.log('✅ Next warmup response:', response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Error getting next warmup:', error.response?.data);
    throw error.response?.data || { message: 'Ошибка получения следующей разминки' };
  }
};

// Сохранить результат выполнения упражнения
export const saveExerciseResult = async (userWorkoutId, exerciseId, reaction, weightUsed, setsCompleted, repsCompleted) => {
    try {
        console.log('📤 Saving exercise result:', {
            userWorkoutId,
            exerciseId,
            reaction,
            weightUsed,
            setsCompleted,
            repsCompleted
        });

        const response = await axiosInstance.post(API_ENDPOINTS.SAVE_EXERCISE_RESULT(userWorkoutId), {
            exercise_id: exerciseId,
            reaction: reaction,
            weight_used: weightUsed,
            sets_completed: setsCompleted,
            reps_completed: repsCompleted
        });

        console.log('✅ Exercise result saved:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error saving exercise result:', error.response?.data);
        throw error.response?.data || { message: 'Ошибка сохранения результата' };
    }
};

// Завершить тренировку
export const completeWorkout = async (userWorkoutId) => {
    try {
        console.log('📤 Completing workout:', { userWorkoutId });

        const response = await axiosInstance.post(API_ENDPOINTS.COMPLETE_WORKOUT(userWorkoutId));

        console.log('✅ Workout completed:', response.data);
        return response.data;
    } catch (error) {
        console.error('❌ Error completing workout:', error.response?.data);
        throw error.response?.data || { message: 'Ошибка завершения тренировки' };
    }
};