import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function RegisterScreen({ navigation }: any) {
    const auth = useAuth(); // enthält register, login, logout etc.
    const { theme } = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async () => {
        if (!name || !email || !password || !confirmPassword) {
            Alert.alert('Fehler', 'Bitte alle Felder ausfüllen');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Fehler', 'Passwörter stimmen nicht überein');
            return;
        }
        try {
            await auth.register({ name, email, password });
            Alert.alert('Erfolg', 'Registrierung erfolgreich', [
                { text: 'OK', onPress: () => navigation.navigate('Login') },
            ]);
        } catch (e: any) {
            Alert.alert('Fehler', e?.response?.data?.message || 'Registrierung fehlgeschlagen');
        }
    };

    const styles = getStyles(theme);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Registrieren</Text>
            <Text style={styles.subtitle}>Erstelle deinen Account, um zu starten.</Text>

            <TextInput
                placeholder="Name"
                placeholderTextColor={theme.text + '88'}
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

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

            <TextInput
                placeholder="Passwort bestätigen"
                placeholderTextColor={theme.text + '88'}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
            />

            <TouchableOpacity onPress={handleRegister} style={styles.button}>
                <Text style={styles.buttonText}>Registrieren</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={{ color: theme.text + 'aa' }}>Bereits einen Account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.linkText}>Einloggen</Text>
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
            marginLeft: 8,
            fontWeight: '500',
        },
        footer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 30,
        },
    });
