export const TOKEN_KEY = 'access_token';
export const USER_KEY = 'auth_user';

// Пути API
export const API_ENDPOINTS = {
  LOGIN: '/login',
  REGISTER: '/register',
  LOGOUT: '/logout',
  VERIFY_CODE: '/verify-email',
  RESEND_CODE: '/resend-verification-code',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/verify-reset-code',
  CHANGE_PASSWORD: '/reset-password',
  REFRESH_TOKEN: '/refresh',
  PROFILE: '/me',
  SAVE_GOAL: '/user-parameters/goal',
  SAVE_ANTHROPOMETRY: '/user-parameters/anthropometry',
  SAVE_LEVEL: '/user-parameters/level',
  GET_USER_PARAMS: '/user-parameters/me',
  GET_GOALS: '/goals',
  GET_LEVELS: '/levels',
  GET_EQUIPMENT: '/equipment',
  SUBSCRIPTIONS: '/subscriptions',
  SUBSCRIPTION_DETAILS: (id) => `/subscriptions/${id}`,
  PAYMENT_SUBSCRIPTION: '/payment/subscription',
  WORKOUTS: '/workouts',
  WORKOUT_EXECUTION: (userWorkoutId) => `/workout-execution/${userWorkoutId}`,
  START_WORKOUT: '/workouts/start',
  NEXT_EXERCISE: (userWorkoutId) => `/workout-execution/${userWorkoutId}/next-exercise`,
  SAVE_EXERCISE_RESULT: (userWorkoutId) => `/workout-execution/${userWorkoutId}/save-exercise-result`,
  COMPLETE_WORKOUT: (userWorkoutId) => `/workout-execution/${userWorkoutId}/complete`,
};