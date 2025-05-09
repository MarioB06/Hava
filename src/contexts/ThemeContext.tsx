import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const moduleColors = {
    household: '#f97316',
    users: '#8b5cf6',
    calendar: '#3b82f6',
    tasks: '#10b981',
    finances: '#10b981',
    storage: '#f59e0b',
    stats: '#6366f1',
    points: '#facc15',
    notifications: '#ec4899',
    notes: '#06b6d4',
    polls: '#d1d5db',
};

const themes = {
    light: {
        mode: 'light',
        background: '#ffffff',
        text: '#111111',
        card: '#e4e6eb',
        accent: '#4B73FF',
        moduleColors,
    },
    dark: {
        mode: 'dark',
        background: '#121212',
        text: '#ffffff',
        card: '#1f1f1f',
        accent: '#4B73FF',
        moduleColors,
    },
};


type ThemeType = typeof themes.light;

interface ThemeContextType {
    theme: ThemeType;
    mode: 'light' | 'dark';
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: themes.dark,
    mode: 'dark',
    toggleTheme: () => { },
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<'light' | 'dark'>('light');
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            const stored = await AsyncStorage.getItem('theme_override');
            if (stored === 'light' || stored === 'dark') {
                setMode(stored);
            } else {
                const system = Appearance.getColorScheme();
                setMode(system === 'dark' ? 'dark' : 'light');
            }
            setLoaded(true);
        };

        loadTheme();
    }, []);

    const toggleTheme = async () => {
        const newMode = mode === 'dark' ? 'light' : 'dark';
        setMode(newMode);
        await AsyncStorage.setItem('theme_override', newMode);
    };

    if (!loaded) return null; // Kein Rendern bis der Modus geladen ist

    return (
        <ThemeContext.Provider value={{ theme: themes[mode], mode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
