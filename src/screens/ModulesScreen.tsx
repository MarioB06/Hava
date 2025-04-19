import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const ModuleCard = ({
    icon,
    color,
    title,
    desc,
    onPress
}: {
    icon: any;
    color: string;
    title: string;
    desc: string;
    onPress?: () => void;
}) => {
    const { theme } = useTheme();

    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: theme.card,
                borderRadius: 12,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
            }}
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
    );
};


export default function ModulesScreen() {
    const { theme } = useTheme();

    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar barStyle="light-content" backgroundColor={theme.background} />
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {/* Haushalt */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <FontAwesome5 name="home" size={16} color={theme.text} style={{ marginRight: 8 }} />
                    <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold' }}>Haushalt</Text>
                </View>
                <ModuleCard
                    icon="home"
                    color="#f97316"
                    title="Haushalt"
                    desc="Haushalt bearbeiten, Räume"
                    onPress={() => navigation.navigate('HouseholdModule')}
                />
                <ModuleCard icon="user-friends" color="#8b5cf6" title="Benutzer" desc="Profile, Rollen, Rechte, Einladungen" />
                <ModuleCard icon="calendar-alt" color="#3b82f6" title="Kalender" desc="Gemeinsame Termine & Aufgaben" />
                <ModuleCard icon="tasks" color="#10b981" title="Aufgaben" desc="Erstellen, zuweisen, wiederholen" />

                {/* Finanzen & Lager */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                    <FontAwesome5 name="wallet" size={16} color={theme.text} style={{ marginRight: 8 }} />
                    <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold' }}>Finanzen & Lager</Text>
                </View>
                <ModuleCard icon="wallet" color="#10b981" title="Finanzen" desc="Einnahmen, Ausgaben, Budgets" />
                <ModuleCard icon="boxes" color="#f59e0b" title="Lager" desc="Vorräte, Kühlschrank, Aufgaben" />
                <ModuleCard icon="chart-line" color="#6366f1" title="Statistik" desc="Aktivitäten, Ausgaben, Verlauf" />

                {/* Kommunikation & Motivation */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
                    <FontAwesome5 name="gamepad" size={16} color={theme.text} style={{ marginRight: 8 }} />
                    <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold' }}>Motivation & Kommunikation</Text>
                </View>
                <ModuleCard icon="medal" color="#facc15" title="Punkte" desc="Gamification & Belohnung" />
                <ModuleCard icon="bell" color="#ec4899" title="Benachricht." desc="Push oder In-App" />
                <ModuleCard icon="sticky-note" color="#06b6d4" title="Notizen" desc="Kommentare & Kommunikation" />
                <ModuleCard icon="poll" color="#d1d5db" title="Umfragen" desc="Haushaltsentscheidungen" />
            </ScrollView>
        </SafeAreaView>
    );
}
