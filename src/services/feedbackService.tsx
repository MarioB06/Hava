import React, { createContext, useContext, useState, ReactNode } from 'react';
import Toast from 'react-native-toast-message';
import { Banner, Portal } from 'react-native-paper';

// 1. Typen für Feedback
export type FeedbackType = 'success' | 'error' | 'warning' | 'info';

export interface FeedbackPayload {
    id: string;             // eindeutige ID für das Element
    type: FeedbackType;
    title: string;
    message?: string;
    duration?: number;      // nur für Toasts (in ms)
}

// 2. Context
interface FeedbackContextType {
    show: (payload: Omit<FeedbackPayload, 'id'>) => void;
}

const FeedbackContext = createContext<FeedbackContextType>({
    show: () => { },
});

export const useFeedback = () => useContext(FeedbackContext);

// 3. Provider-Komponente
export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
    const [errors, setErrors] = useState<FeedbackPayload[]>([]);

    const show = (payload: Omit<FeedbackPayload, 'id'>) => {
        const id = Math.random().toString(36).substr(2, 9);
        if (payload.type === 'error') {
            setErrors(prev => [...prev, { id, ...payload }]);
        } else {
            Toast.show({
                type: payload.type,
                text1: payload.title,
                text2: payload.message,
                visibilityTime: payload.duration ?? 3000,
            });
        }
    };

    const removeError = (id: string) => {
        setErrors(prev => prev.filter(err => err.id !== id));
    };

    return (
        <FeedbackContext.Provider value={{ show }}>
            {children}
            <Portal>
                {errors.map(err => (
                    <Banner
                        key={err.id}
                        visible={true}
                        icon="alert-circle"
                        actions={[
                            { label: 'OK', onPress: () => removeError(err.id) }
                        ]}
                    >
                        {err.title}{err.message ? ` – ${err.message}` : ''}
                    </Banner>
                ))}
            </Portal>
        </FeedbackContext.Provider>
    );
};
