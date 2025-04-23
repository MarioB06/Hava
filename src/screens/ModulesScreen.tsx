import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ModuleCard = ({
    icon,
    color,
    title,
    desc,
    onPress,
    isFavorite,
    onToggleFavorite,
}: {
    icon: any;
    color: string;
    title: string;
    desc: string;
    onPress?: () => void;
    isFavorite: boolean;
    onToggleFavorite: () => void;
}) => {
    const { theme } = useTheme();

    return (
        <View
            style={{
                backgroundColor: theme.card,
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
                justifyContent: 'space-between',
            }}
        >
            <TouchableOpacity
                onPress={onPress}
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                activeOpacity={0.8}
            >
                <View
                    style={{
                        backgroundColor: color,
                        width: 40,
                        height: 40,
                        borderRadius: 20,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 16,
                    }}
                >
                    <FontAwesome5 name={icon} size={18} color="#fff" />
                </View>
                <View>
                    <Text style={{ color: theme.text, fontSize: 16, fontWeight: 'bold' }}>{title}</Text>
                    <Text style={{ color: theme.text + '99', fontSize: 13 }}>{desc}</Text>
                </View>
            </TouchableOpacity>

            {/* Rechte Hälfte → nur Stern, komplett antippbar */}
            <TouchableOpacity
                onPress={onToggleFavorite}
                style={{
                    padding: 8,
                    marginLeft: 12,
                }}
                activeOpacity={0.6}
            >
                <FontAwesome5
                    name="star"
                    solid={isFavorite}         // 🔥 Voller Stern wenn true
                    size={18}
                    color={isFavorite ? '#facc15' : theme.text}
                />

            </TouchableOpacity>
        </View>
    );
};


export default function ModulesScreen() {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        const loadFavorites = async () => {
            const stored = await AsyncStorage.getItem('moduleFavorites');
            if (stored) setFavorites(JSON.parse(stored));
        };
        loadFavorites();
    }, []);

    const toggleFavorite = async (title: string) => {
        const updated = favorites.includes(title)
            ? favorites.filter(f => f !== title)
            : [...favorites, title];

        setFavorites(updated);
        await AsyncStorage.setItem('moduleFavorites', JSON.stringify(updated));
    };

    const modules = [
        {
            title: 'Haushalt',
            desc: 'Haushalt bearbeiten, Räume',
            icon: 'home',
            color: theme.moduleColors.household,
            screen: 'HouseholdModule',
        },
        {
            title: 'Benutzer',
            desc: 'Profile, Rollen, Rechte, Einladungen',
            icon: 'user-friends',
            color: theme.moduleColors.users,
            screen: 'UserModule',
        },
        {
            title: 'Kalender',
            desc: 'Gemeinsame Termine & Aufgaben',
            icon: 'calendar-alt',
            color: theme.moduleColors.calendar,
            screen: '',
        },
        {
            title: 'Aufgaben',
            desc: 'Erstellen, zuweisen, wiederholen',
            icon: 'tasks',
            color: theme.moduleColors.tasks,
            screen: '',
        },
        {
            title: 'Finanzen',
            desc: 'Einnahmen, Ausgaben, Budgets',
            icon: 'wallet',
            color: theme.moduleColors.finances,
            screen: '',
        },
        {
            title: 'Lager',
            desc: 'Vorräte, Kühlschrank, Aufgaben',
            icon: 'boxes',
            color: theme.moduleColors.storage,
            screen: '',
        },
        {
            title: 'Statistik',
            desc: 'Aktivitäten, Ausgaben, Verlauf',
            icon: 'chart-line',
            color: theme.moduleColors.stats,
            screen: '',
        },
        {
            title: 'Punkte',
            desc: 'Gamification & Belohnung',
            icon: 'medal',
            color: theme.moduleColors.points,
            screen: '',
        },
        {
            title: 'Benachricht.',
            desc: 'Push oder In-App',
            icon: 'bell',
            color: theme.moduleColors.notifications,
            screen: '',
        },
        {
            title: 'Notizen',
            desc: 'Kommentare & Kommunikation',
            icon: 'sticky-note',
            color: theme.moduleColors.notes,
            screen: '',
        },
        {
            title: 'Umfragen',
            desc: 'Haushaltsentscheidungen',
            icon: 'poll',
            color: theme.moduleColors.polls,
            screen: '',
        },
    ];

    const favoriteModules = modules.filter(m => favorites.includes(m.title));
    const otherModules = modules.filter(m => !favorites.includes(m.title));

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar barStyle="light-content" backgroundColor={theme.background} />
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {favoriteModules.length > 0 && (
                    <>
                        <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
                            Favoriten
                        </Text>
                        {favoriteModules.map(m => (
                            <ModuleCard
                                key={m.title}
                                {...m}
                                isFavorite
                                onToggleFavorite={() => toggleFavorite(m.title)}
                                onPress={() => m.screen && navigation.navigate(m.screen)}
                            />
                        ))}
                    </>
                )}

                {/* Kategorien darunter bleiben gleich */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 10 }}>
                    <FontAwesome5 name="home" size={16} color={theme.text} style={{ marginRight: 8 }} />
                    <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold' }}>Haushalt</Text>
                </View>

                {otherModules.map(m => (
                    <ModuleCard
                        key={m.title}
                        {...m}
                        isFavorite={false}
                        onToggleFavorite={() => toggleFavorite(m.title)}
                        onPress={() => m.screen && navigation.navigate(m.screen)}
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}
