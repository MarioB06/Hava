import { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ActivityIndicator, ScrollView, StatusBar } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { getMyHouseholds } from '../services/household';
import { useTaskSummary } from '../hooks/useTaskSummary';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';

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
                <Text style={styles.subtitle}>{householdLoading ? 'Haushalt wird geladen...' : (householdName ?? 'Kein Haushalt gefunden')}</Text>

                <View style={styles.moduleCard}>
                    <FontAwesome5 name="money-bill-wave" size={20} color={theme.text} />
                    <Text style={styles.moduleTitle}>Finanzen</Text>
                    <Text style={styles.moduleData}>CHF 2'580.00</Text>
                    <Text style={styles.moduleLink}>Details ansehen</Text>
                </View>

                <View style={styles.moduleRow}>
                    <View style={styles.moduleSmallCard}>
                        <FontAwesome5 name="tasks" size={18} color={theme.text} />
                        <Text style={styles.moduleSmallTitle}>Aufgaben</Text>
                        {!householdId || taskSummary.loading ? (
                            <ActivityIndicator color={theme.text} />
                        ) : (
                            <Text style={styles.moduleSmallData}>{taskSummary.done} erledigt / {taskSummary.open} offen</Text>
                        )}
                    </View>
                    <View style={styles.moduleSmallCard}>
                        <FontAwesome5 name="box" size={18} color={theme.text} />
                        <Text style={styles.moduleSmallTitle}>Lager</Text>
                        <Text style={styles.moduleSmallData}>5 Artikel niedrig</Text>
                    </View>
                </View>

                <View style={styles.moduleRow}>
                    <View style={styles.moduleSmallCard}>
                        <FontAwesome5 name="folder" size={18} color={theme.text} />
                        <Text style={styles.moduleSmallTitle}>Dokumente</Text>
                        <Text style={styles.moduleSmallData}>3 neue Dateien</Text>
                    </View>
                    <View style={styles.moduleSmallCard}>
                        <FontAwesome5 name="cog" size={18} color={theme.text} />
                        <Text style={styles.moduleSmallTitle}>Einstellungen</Text>
                        <Text style={styles.moduleSmallData}>Profil anpassen</Text>
                    </View>
                </View>

                <View style={styles.moduleCard}>
                    <View style={styles.calendarHeaderTop}>
                        <FontAwesome5 name="calendar-alt" size={20} color={theme.text} style={{ marginRight: 8 }} />
                        <Text style={styles.moduleTitle}>Kalender</Text>
                    </View>
                    <View style={styles.calendarHeaderRow}>
                        <Text style={styles.calendarMonth}>April 2025</Text>
                    </View>
                    <View style={styles.calendarDaysRow}>
                        {['MO', 'DI', 'MI', 'DO', 'FR'].map((day, index) => (
                            <View key={index} style={styles.calendarDayWrapper}>
                                <Text style={styles.calendarDay}>{day}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.calendarDatesRow}>
                        {[ 7, 8, 9, 10, 11].map((date, index) => (
                            <View key={index} style={styles.calendarDayWrapper}>
                                <Text style={[styles.calendarDate, date === 9 && styles.selectedDate]}>{date}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.calendarEvents}>
                        <Text style={styles.eventItem}>09:00 - Zahnarzttermin</Text>
                        <Text style={styles.eventItem}>14:00 - Meeting WG</Text>
                        <Text style={styles.eventItem}>18:30 - Wocheneinkauf</Text>
                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const getStyles = (theme: any) => StyleSheet.create({
    container: {
        padding: 16,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: theme.text,
    },
    subtitle: {
        fontSize: 16,
        color: theme.text + 'aa',
        marginBottom: 20,
    },
    moduleCard: {
        backgroundColor: theme.card,
        borderRadius: 16,
        padding: 20,
        marginBottom: 16,
    },
    moduleTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: theme.text,
    },
    moduleData: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 8,
        color: theme.accent,
    },
    moduleLink: {
        fontSize: 14,
        color: theme.accent,
        marginTop: 8,
    },
    moduleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    moduleSmallCard: {
        backgroundColor: theme.card,
        borderRadius: 16,
        padding: 16,
        width: '48%',
    },
    moduleSmallTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: theme.text,
        marginTop: 8,
    },
    moduleSmallData: {
        fontSize: 14,
        color: theme.text + 'cc',
        marginTop: 4,
    },
    calendarHeaderTop: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginBottom: 12,
    },
    calendarHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    calendarMonth: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.text,
    },
    calendarDaysRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 4,
    },
    calendarDatesRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
    },
    calendarDay: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.text,
    },
    calendarDate: {
        fontSize: 16,
        fontWeight: 'bold',
        color: theme.text,
    },
    selectedDay: {
        color: theme.accent,
    },
    selectedDate: {
        backgroundColor: theme.accent,
        color: theme.card,
        borderRadius: 12,
        paddingHorizontal: 6,
    },
    calendarEvents: {
        marginTop: 8,
    },
    eventItem: {
        fontSize: 14,
        color: theme.text + 'cc',
        marginBottom: 6,
    },
    calendarDayWrapper: {
        alignItems: 'center',
        width: 32,
    },
    
});
