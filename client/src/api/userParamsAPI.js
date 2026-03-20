import axiosInstance from "./axiosConfig";
import { API_ENDPOINTS } from "../utils/constants";

export const getGoals = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_GOALS);

    if (response.data?.success && Array.isArray(response.data?.data)) {
      return { success: true, data: response.data.data };
    }
    return { success: false, data: [] };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || {
        message: "Ошибка получения списка целей",
      },
      data: [],
    };
  }
};

export const getLevels = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_LEVELS);

    if (response.data?.success && Array.isArray(response.data?.data)) {
      return { success: true, data: response.data.data };
    }
    return { success: false, data: [] };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || {
        message: "Ошибка получения списка уровней",
      },
      data: [],
    };
  }
};

export const getEquipment = async () => {
  try {
    const response = await axiosInstance.get(API_ENDPOINTS.GET_EQUIPMENT);

    if (response.data?.success && Array.isArray(response.data?.data)) {
      return { success: true, data: response.data.data };
    }
    return { success: false, data: [] };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || {
        message: "Ошибка получения списка оборудования",
      },
      data: [],
    };
  }
};

export const saveGoal = async (goalId) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.SAVE_GOAL, {
      goal_id: parseInt(goalId),
    });

    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || { message: "Ошибка сохранения цели" },
    };
  }
};

export const saveAnthropometry = async (data) => {
  try {
    const payload = {
      gender: data.gender,
      age: parseInt(data.age),
      weight: parseFloat(data.weight),
      height: parseInt(data.height),
      equipment_id: parseInt(data.equipment_id),
    };
    const response = await axiosInstance.post(
      API_ENDPOINTS.SAVE_ANTHROPOMETRY,
      payload,
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || {
        message: "Ошибка сохранения антропометрии",
      },
    };
  }
};

export const saveLevel = async (levelId) => {
  try {
    const payload = {
      level_id: parseInt(levelId),
    };
    const response = await axiosInstance.post(
      API_ENDPOINTS.SAVE_LEVEL,
      payload,
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data || { message: "Ошибка сохранения уровня" },
    };
  }
};
