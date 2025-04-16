import { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ActivityIndicator, ScrollView, StatusBar } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getMyHouseholds } from '../services/household';
import { useTaskSummary } from '../hooks/useTaskSummary';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
    const { user } = useAuth();
    const [householdName, setHouseholdName] = useState<string | null>(null);
    const [householdLoading, setHouseholdLoading] = useState(true);
    const [householdId, setHouseholdId] = useState<number | null>(null);
    const taskSummary = useTaskSummary(householdId ?? 0, 'week');
    const { theme } = useTheme();
    const styles = getStyles(theme);

    useEffect(() => {
        const loadHousehold = async () => {
            try {
                const data = await getMyHouseholds();
                if (data.length > 0) {
                    setHouseholdName(data[0].name);
                    setHouseholdId(data[0].id);
                }
            } catch (e) {
                console.log('Fehler beim Laden des Haushalts', e);
            } finally {
                setHouseholdLoading(false);
            }
        };

        loadHousehold();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.greeting}>Willkommen zurück, {user?.name}</Text>
                <Text style={styles.subtitle}>
                    Haushalt: {householdLoading ? 'lädt...' : householdName ?? 'Kein Haushalt gefunden'}
                </Text>

                <View style={[styles.widget, styles.fullWidth]}>
                    <Text style={styles.title}>
                        <FontAwesome5 name="chart-pie" size={20} color={theme.text} /> Haushaltsübersicht
                    </Text>
                </View>

                <View style={styles.row}>
                    <View style={styles.widget}>
                        <Text style={styles.title}>
                            <FontAwesome5 name="tasks" size={20} color={theme.text} /> Aufgaben
                        </Text>

                        {!householdId || taskSummary.loading ? (
                            <ActivityIndicator color={theme.text} style={{ marginTop: 10 }} />
                        ) : (
                            <>
                                <View style={styles.progressBar}>
                                    <View
                                        style={[styles.progressFill, { width: `${(taskSummary.done / taskSummary.total) * 100 || 0}%` }]}
                                    />
                                </View>
                                <Text style={styles.taskInfo}>
                                    {taskSummary.done} erledigt · {taskSummary.open} offen
                                </Text>
                            </>
                        )}
                    </View>

                    <View style={styles.widget}>
                        <Text style={styles.title}>
                            <FontAwesome5 name="money-bill-wave" size={20} color={theme.text} /> Ausgaben
                        </Text>
                    </View>
                </View>

                <View style={[styles.widget, styles.fullWidth]}>
                    <Text style={styles.title}>
                        <FontAwesome5 name="calendar-alt" size={20} color={theme.text} /> Kalender
                    </Text>
                </View>

                <View style={styles.row}>
                    <View style={styles.widget}>
                        <Text style={styles.title}>
                            <FontAwesome5 name="box" size={20} color={theme.text} /> Lager
                        </Text>
                    </View>
                    <View style={styles.widget}>
                        <Text style={styles.title}>
                            <FontAwesome5 name="folder" size={20} color={theme.text} /> Dokumente
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = (theme: any) =>
    StyleSheet.create({
        container: {
            padding: 12,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        widget: {
            backgroundColor: theme.card,
            borderRadius: 12,
            padding: 16,
            marginBottom: 12,
            flex: 1,
            marginHorizontal: 4,
            aspectRatio: 1,
        },
        fullWidth: {
            width: '100%',
            marginHorizontal: 0,
            aspectRatio: undefined,
            height: 160,
        },
        title: {
            color: theme.text,
            fontSize: 16,
            fontWeight: '600',
        },
        greeting: {
            color: theme.text,
            fontSize: 22,
            fontWeight: 'bold',
            marginBottom: 4,
            marginHorizontal: 4,
        },
        subtitle: {
            color: theme.text + 'aa',
            fontSize: 15,
            marginBottom: 12,
            marginHorizontal: 4,
        },
        progressBar: {
            height: 10,
            backgroundColor: theme.mode === 'dark' ? '#333' : '#ccc',
            borderRadius: 5,
            overflow: 'hidden',
            marginTop: 12,
        },
        progressFill: {
            height: '100%',
            backgroundColor: theme.accent,
        },
        taskInfo: {
            color: theme.text + 'cc',
            fontSize: 13,
            marginTop: 8,
        },
    });
