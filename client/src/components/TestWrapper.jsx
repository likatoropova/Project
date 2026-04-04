// src/components/TestWrapper.jsx
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const TestWrapper = ({
                         children,
                         testId,
                         attemptId,
                         onStart,
                         onSaveResult,
                         onComplete
                     }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div>Загрузка...</div>;
    }

    // Передаем соответствующие функции в зависимости от типа пользователя
    const enhancedChildren = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                isAuthenticated,
                onStart: onStart,
                onSaveResult: onSaveResult,
                onComplete: onComplete,
                testId,
                attemptId
            });
        }
        return child;
    });

    return enhancedChildren;
};

export default TestWrapper;