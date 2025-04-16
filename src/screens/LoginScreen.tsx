import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function LoginScreen({ navigation }: any) {
    const { login } = useAuth();
    const { theme } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            await login(email, password);
        } catch (e: any) {
            Alert.alert('Fehler', e?.response?.data?.message || 'Login fehlgeschlagen');
        }
    };

    const handleForgotPassword = () => {
        Alert.alert('Hinweis', 'Die Passwort-Zurücksetzen-Funktion ist noch nicht implementiert.');
    };

    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Willkommen zurück</Text>
            <Text style={styles.subtitle}>Melde dich an, um fortzufahren.</Text>

            <TextInput
                placeholder="E-Mail"
                placeholderTextColor={theme.text + '88'}
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <TextInput
                placeholder="Passwort"
                placeholderTextColor={theme.text + '88'}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={styles.input}
            />

            <TouchableOpacity onPress={handleForgotPassword}>
                <Text style={styles.linkText}>Passwort vergessen?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>Einloggen</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={{ color: theme.text + 'aa' }}>Noch kein Account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.linkText}>Registrieren</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const getStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.background,
            justifyContent: 'center',
            padding: 24,
        },
        title: {
            color: theme.text,
            fontSize: 26,
            fontWeight: 'bold',
            marginBottom: 8,
        },
        subtitle: {
            color: theme.text + 'cc',
            fontSize: 15,
            marginBottom: 24,
        },
        input: {
            backgroundColor: theme.card,
            color: theme.text,
            paddingVertical: 14,
            paddingHorizontal: 16,
            borderRadius: 10,
            marginBottom: 16,
            fontSize: 16,
        },
        button: {
            backgroundColor: theme.accent,
            paddingVertical: 16,
            borderRadius: 10,
            marginTop: 16,
        },
        buttonText: {
            color: '#fff',
            textAlign: 'center',
            fontWeight: '600',
            fontSize: 16,
        },
        linkText: {
            color: theme.accent,
            marginTop: 8,
            textAlign: 'right',
            fontWeight: '500',
        },
        footer: {
            marginTop: 30,
            alignItems: 'center',
        },
    });
