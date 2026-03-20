import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import axiosInstance from "../api/axiosConfig";
import { API_ENDPOINTS } from "../utils/constants";
import { storage } from "../utils/storage";
import { AuthContext } from "./AuthContext";

// Создаем контекст
const FirstTestContext = createContext(null);

// Хук для использования контекста
export const useFirstTest = () => {
  const context = useContext(FirstTestContext);
  if (!context) {
    throw new Error("useFirstTest must be used within FirstTestProvider");
  }
  return context;
};

// Провайдер контекста
export const FirstTestProvider = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated, loading, registerGuestCleanup } = useAuth();
  const [guestId, setGuestId] = useState(null);
  const [hasGuestParams, setHasGuestParams] = useState(false);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const navigationInProgress = useRef(false);

  useEffect(() => {
    if (loading) return;
    const savedGuestId = storage.get("guestId");
    const guestParamsCompleted = storage.get("guestParamsCompleted") === true;

    if (savedGuestId) {
      console.log("Found existing guest ID:", savedGuestId);
      setGuestId(savedGuestId);
    }
    setHasGuestParams(guestParamsCompleted);
  }, []);

  const checkParams = async () => {
    if (isAuthenticated) {
      try {
        const response = await axiosInstance.get(API_ENDPOINTS.GET_USER_PARAMS);
        if (response.data?.data) {
          setHasGuestParams(true);
          storage.set("guestParamsCompleted", true);
          if (window.location.pathname !== "/") {
            navigationInProgress.current = true;
            navigate("/");
            setTimeout(() => {
              navigationInProgress.current = false;
            }, 500);
          }
          setInitialCheckDone(true);
          return;
        }
      } catch (e) {
        console.error("Error checking params:", e);
      }
      const isOnTestPage = [
        "/training-goal",
        "/training-personal-param",
        "/training-level",
        "/login",
        "/register",
        "/register-code",
        "/forgot-password",
        "/restore-password",
        "/confirm-password",
      ].includes(window.location.pathname);
      if (!isOnTestPage) {
        navigationInProgress.current = true;
        navigate("/training-goal");
        setTimeout(() => {
          navigationInProgress.current = false;
        }, 500);
      }
      setInitialCheckDone(true);
      return;
    }
    if (!hasGuestParams) {
      const isOnTestPage = [
        "/training-goal",
        "/training-personal-param",
        "/training-level",
      ].includes(window.location.pathname);
      if (!isOnTestPage) {
        navigationInProgress.current = true;
        navigate("/training-goal");
        setTimeout(() => {
          navigationInProgress.current = false;
        }, 500);
      }
    }

    setInitialCheckDone(true);
  };

  useEffect(() => {
    if (loading) return;
    if (navigationInProgress.current) return;
    if (initialCheckDone) return;

    checkParams();
  }, [isAuthenticated, loading, hasGuestParams, initialCheckDone]);

  // Register resetGuest with AuthContext so it is called automatically on login/logout
  useEffect(() => {
    if (typeof registerGuestCleanup !== "function") return;
    const unregister = registerGuestCleanup(resetGuest);
    return unregister;
  }, [registerGuestCleanup]);

  const setGuestIdFromApi = (id) => {
    setGuestId(id);
    storage.set("guestId", id);
  };

  const completeGuestTest = () => {
    setHasGuestParams(true);
    storage.set("guestParamsCompleted", true);
    navigationInProgress.current = false;
  };

  const resetGuest = () => {
    setGuestId(null);
    setHasGuestParams(false);
    storage.remove("guestId");
    storage.remove("guestParamsCompleted");
    setInitialCheckDone(false);
    navigationInProgress.current = false;
  };

  const value = {
    guestId,
    hasGuestParams,
    setGuestIdFromApi,
    completeGuestTest,
    resetGuest,
  };

  return (
    <FirstTestContext.Provider value={value}>
      {children}
    </FirstTestContext.Provider>
  );
};

export default FirstTestContext;
