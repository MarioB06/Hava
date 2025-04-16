import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStorage = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
                try {
                    const res = await api.get('/me');
                    setUser(res.data);
                    console.log('Benutzerdaten:', res.data);
                } catch (err) {
                    console.error('Fehler bei /me:', err);
                }

            }
            setLoading(false);
        };
        loadStorage();
    }, []);

    const login = async (email: string, password: string) => {
        const res = await api.post('/login', { email, password });
        const receivedToken = res.data.token;

        await AsyncStorage.setItem('token', receivedToken);
        setToken(receivedToken);

        const userRes = await api.get('/me');
        setUser(userRes.data);
    };


    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (e) {
            console.log('Server logout fehlgeschlagen (nicht kritisch)');
        }
        await AsyncStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
