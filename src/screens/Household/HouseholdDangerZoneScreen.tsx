import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../services/api';
import { useNavigation } from '@react-navigation/native';

export default function HouseholdPropertiesScreen() {
    const { theme } = useTheme();
    const navigation = useNavigation();

    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            const adminId = await AsyncStorage.getItem('householdAdmin');
            const userId = await AsyncStorage.getItem('userID');

            if (adminId && userId && adminId === userId) {
                setIsAdmin(true);
            }

            setLoading(false);
        };

        loadData();
    }, []);

    const handleLeaveOrDelete = async () => {
        const householdId = await AsyncStorage.getItem('householdID');
        if (!householdId) return;

        try {
            if (isAdmin) {
                await api.delete(`/households/${householdId}`);
            } else {
                await api.post(`/households/${householdId}/leave`);
            }

            await AsyncStorage.multiRemove(['householdID', 'householdAdmin']);
            navigation.reset({
                index: 0,
                routes: [{ name: 'Landing' }],
            });
        } catch (e) {
            console.log('Fehler beim Verlassen/Löschen:', e);
        }
    };

    const confirmLeaveOrDelete = () => {
        Alert.alert(
            isAdmin ? 'Haushalt löschen?' : 'Haushalt verlassen?',
            isAdmin
                ? 'Bist du sicher, dass du den gesamten Haushalt löschen willst? Diese Aktion kann nicht rückgängig gemacht werden.'
                : 'Bist du sicher, dass du diesen Haushalt verlassen willst?',
            [
                { text: 'Abbrechen', style: 'cancel' },
                {
                    text: isAdmin ? 'Löschen' : 'Verlassen',
                    style: 'destructive',
                    onPress: handleLeaveOrDelete,
                },
            ]
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={theme.text} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} keyboardVerticalOffset={10}>
                    <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
                        <Text style={{ color: theme.text, fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
                            {isAdmin ? 'Haushalt löschen' : 'Haushalt verlassen'}
                        </Text>

                        <Text style={{ color: theme.text, fontSize: 16, marginBottom: 10 }}>
                            {isAdmin
                                ? 'Wenn du den Haushalt löschst, gehen alle Daten dieses Haushalts für alle Mitglieder verloren.'
                                : 'Du wirst diesen Haushalt verlassen und hast danach keinen Zugriff mehr auf dessen Inhalte.'}
                        </Text>

                        <TouchableOpacity
                            onPress={confirmLeaveOrDelete}
                            style={{
                                backgroundColor: 'red',
                                padding: 14,
                                borderRadius: 10,
                                marginTop: 20,
                            }}
                        >
                            <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
                                {isAdmin ? 'Haushalt löschen' : 'Haushalt verlassen'}
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}
