import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '../contexts/ThemeContext';
import { FontAwesome5 } from '@expo/vector-icons';

export default function LandingScreen({ onFinish }: { onFinish: () => void }) {
    const [showThemeModal, setShowThemeModal] = useState(true);
    const { toggleTheme, mode, theme } = useTheme();

    const handleThemeChoice = async (choice: 'light' | 'dark') => {
        await AsyncStorage.setItem('theme_override', choice);
        if (choice !== mode) toggleTheme();
        setShowThemeModal(false);
    };

    const handleContinue = async () => {
        await AsyncStorage.setItem('landingSeen', 'true');
        onFinish();
    };

    return (
        <View style={{ flex: 1, backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
            <Text style={{ color: theme.text, fontSize: 30, fontWeight: 'bold', marginBottom: 16 }}>
                Willkommen bei Hava
            </Text>
            <Text style={{ color: theme.text + 'aa', fontSize: 16, textAlign: 'center', marginBottom: 40 }}>
                Die smarte All-in-One Lösung für deinen Haushalt.
                Verwalte Aufgaben, Ausgaben, Kalender und mehr – alles in einer App.
            </Text>

            <TouchableOpacity
                onPress={handleContinue}
                style={{
                    backgroundColor: theme.accent,
                    paddingVertical: 16,
                    paddingHorizontal: 40,
                    borderRadius: 12,
                    marginBottom: 24,
                }}
            >
                <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Los geht’s</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => Linking.openURL('https://hava-house.com')}>
                <Text style={{ color: theme.accent, fontSize: 14, textDecorationLine: 'underline' }}>
                    Mehr Infos findest du auf hava-house.com
                </Text>
            </TouchableOpacity>

            {/* Modal zur Theme-Auswahl */}
            <Modal visible={showThemeModal} transparent animationType="fade">
                <View style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    padding: 20,
                }}>
                    <View style={{
                        backgroundColor: theme.card,
                        paddingVertical: 30,
                        paddingHorizontal: 24,
                        borderRadius: 20,
                        width: '100%',
                        maxWidth: 350,
                        elevation: 10,
                    }}>
                        <Text style={{
                            color: theme.text,
                            fontSize: 20,
                            fontWeight: '600',
                            textAlign: 'center',
                            marginBottom: 24,
                        }}>
                            Bevor es losgeht
                        </Text>

                        <Text style={{
                            color: theme.text + 'aa',
                            fontSize: 15,
                            textAlign: 'center',
                            marginBottom: 30,
                        }}>
                            Wähle einen Darstellungsmodus – du kannst ihn jederzeit später ändern.
                        </Text>

                        <TouchableOpacity
                            onPress={() => handleThemeChoice('light')}
                            style={{
                                backgroundColor: '#f5f5f5',
                                paddingVertical: 14,
                                borderRadius: 10,
                                marginBottom: 14,
                                borderWidth: 1,
                                borderColor: '#ccc',
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <FontAwesome5 name="sun" size={18} color="#111" />
                            <Text style={{ color: '#111', fontWeight: '600' }}>Heller Modus</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => handleThemeChoice('dark')}
                            style={{
                                backgroundColor: '#333',
                                paddingVertical: 14,
                                borderRadius: 10,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 8,
                            }}
                        >
                            <FontAwesome5 name="moon" size={18} color="#fff" />
                            <Text style={{ color: '#fff', fontWeight: '600' }}>Dunkler Modus</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Modal>
        </View>
    );
}
