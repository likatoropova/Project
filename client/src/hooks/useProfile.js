// src/hooks/useProfile.js

import { useState, useEffect, useCallback } from 'react';
import {
    getProfile,
    updateProfile,
    changePassword,
    uploadAvatar,
    getVolumeStatistics,
    getTrendStatistics,
    getFrequencyStatistics,
    getUserParameters,
    updateUserParameters,
    getGoals,
    getLevels,
    getEquipment
} from '../api/profileAPI';

export const useProfile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statistics, setStatistics] = useState({
        volume: null,
        trend: null,
        frequency: null
    });
    const [goals, setGoals] = useState([]);
    const [levels, setLevels] = useState([]);
    const [equipment, setEquipment] = useState([]);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getProfile();

            if (response.success && response.data) {
                setProfile(response.data);
            } else {
                setError('Не удалось загрузить профиль');
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError(err.message || 'Ошибка загрузки профиля');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUserParameters = useCallback(async () => {
        try {
            const response = await getUserParameters();
            if (response.success && response.data) {
                setProfile(prev => ({
                    ...prev,
                    parameters: response.data
                }));
            }
        } catch (err) {
            console.error('Error fetching user parameters:', err);
        }
    }, []);

    const fetchGoals = useCallback(async () => {
        try {
            const response = await getGoals();
            if (response.success && response.data) {
                setGoals(response.data);
            }
        } catch (err) {
            console.error('Error fetching goals:', err);
        }
    }, []);

    const fetchLevels = useCallback(async () => {
        try {
            const response = await getLevels();
            if (response.success && response.data) {
                setLevels(response.data);
            }
        } catch (err) {
            console.error('Error fetching levels:', err);
        }
    }, []);

    const fetchEquipment = useCallback(async () => {
        try {
            const response = await getEquipment();
            if (response.success && response.data) {
                setEquipment(response.data);
            }
        } catch (err) {
            console.error('Error fetching equipment:', err);
        }
    }, []);

    const fetchStatistics = useCallback(async (type, params = {}) => {
        try {
            let response;
            switch (type) {
                case 'volume':
                    response = await getVolumeStatistics(params);
                    break;
                case 'trend':
                    response = await getTrendStatistics(params);
                    break;
                case 'frequency':
                    response = await getFrequencyStatistics(params);
                    break;
                default:
                    return;
            }

            if (response.success && response.data) {
                setStatistics(prev => ({
                    ...prev,
                    [type]: response.data
                }));
            }
        } catch (err) {
            console.error(`Error fetching ${type} statistics:`, err);
        }
    }, []);

    const updateUserProfile = async (data) => {
        try {
            const response = await updateProfile(data);
            if (response.success) {
                await fetchProfile();
                return { success: true };
            }
            return { success: false, error: response.message };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const updateUserPassword = async (data) => {
        try {
            const response = await changePassword(data);
            if (response.success) {
                return { success: true };
            }
            return { success: false, error: response.message };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const uploadUserAvatar = async (file) => {
        try {
            const response = await uploadAvatar(file);
            if (response.success) {
                await fetchProfile();
                return { success: true };
            }
            return { success: false, error: response.message };
        } catch (err) {
            return { success: false, error: err.message };
        }
    };

    const updateParameters = async (data) => {
        try {
            const response = await updateUserParameters(data);
            if (response.success) {
                await fetchUserParameters();
                await fetchProfile();
                return { success: true };
            }
            return { success: false, error: response.message };
        } catch (err) {
            console.error('Error updating parameters:', err);
            return { success: false, error: err.message };
        }
    };

    useEffect(() => {
        fetchProfile();
        fetchGoals();
        fetchLevels();
        fetchEquipment();
    }, [fetchProfile, fetchGoals, fetchLevels, fetchEquipment]);

    return {
        profile,
        loading,
        error,
        statistics,
        goals,
        levels,
        equipment,
        fetchProfile,
        fetchStatistics,
        updateUserProfile,
        updateUserPassword,
        uploadUserAvatar,
        updateParameters
    };
};