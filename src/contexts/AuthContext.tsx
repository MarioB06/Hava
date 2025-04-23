// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import { useFeedback } from '../services/feedbackService';

interface User {
    id: number;
    name: string;
    email: string;
}

interface RegisterData {
    name: string;
    email: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const feedback = useFeedback();
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const logout = async () => {
        await AsyncStorage.removeItem('token');
        setToken(null);
        setUser(null);
        feedback.show({ type: 'info', title: 'Abgemeldet' });
    };

    useEffect(() => {
        const loadStorage = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
                    setToken(storedToken);
                    // /me holt User-Daten
                    const me = await api.get('/me');
                    await AsyncStorage.setItem('userID', me.data.id.toString());
                    await AsyncStorage.setItem('householdID', me.data.households[0].id.toString());
                    await AsyncStorage.setItem('householdAdmin', me.data.households[0].admin.toString());

                }
            } catch (err: any) {
                // Wenn es ein 401 war, dann abmelden
                if (err.response?.status === 401) {
                    await logout();
                } else {
                    console.error('Fehler beim Laden der Auth-Daten:', err);
                }
            } finally {
                setLoading(false);
            }
        };
        loadStorage();
    }, []);

    useEffect(() => {
        const id = api.interceptors.response.use(
            res => res,
            async err => {
                if (err.response?.status === 401) {
                    // Token ungültig → abmelden
                    await logout();
                }
                return Promise.reject(err);
            }
        );
        return () => {
            api.interceptors.response.eject(id);
        };
    }, []);

    async function login(email: string, password: string) {
        setLoading(true);
        try {
            const { data } = await api.post('/login', { email, password });
            const t = data.token;
            await AsyncStorage.setItem('token', t);
            api.defaults.headers.common.Authorization = `Bearer ${t}`;
            setToken(t);
            feedback.show({ type: 'success', title: 'Erfolgreich eingeloggt' });
            const me = await api.get('/me');
            setUser(me.data);
            await AsyncStorage.setItem('userID', me.data.id.toString());            
            await AsyncStorage.setItem('householdID', me.data.households[0].id.toString());
            await AsyncStorage.setItem('householdAdmin', me.data.households[0].admin.toString());


        } catch (err) {
            feedback.show({
                type: 'error',
                title: 'Login fehlgeschlagen',
                message: 'Bitte überprüfe Deine Zugangsdaten und versuche es erneut.',
            });
            throw err;
        } finally {
            setLoading(false);
        }
    }

    const register = async ({ name, email, password }: RegisterData) => {
        setLoading(true);
        try {
            const res = await api.post('/register', { name, email, password });
            const t = res.data.token;
            await AsyncStorage.setItem('token', t);
            api.defaults.headers.common.Authorization = `Bearer ${t}`;
            setToken(t);
            const me = await api.get('/me');
            setUser(me.data);
            await AsyncStorage.setItem('userID', me.data.id.toString());
            await AsyncStorage.setItem('householdID', me.data.households[0].id.toString());
            await AsyncStorage.setItem('householdAdmin', me.data.households[0].admin.toString());

            feedback.show({ type: 'success', title: 'Registrierung erfolgreich' });
        } catch (err) {
            feedback.show({
                type: 'error',
                title: 'Registrierung fehlgeschlagen',
                message: 'Bitte versuche es später erneut.',
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
