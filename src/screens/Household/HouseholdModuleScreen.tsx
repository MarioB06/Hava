import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const SectionButton = ({
    icon,
    label,
    color,
    onPress,
}: {
    icon: any;
    label: string;
    color: string;
    onPress?: () => void;
}) => {
    const { theme } = useTheme();
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: theme.card,
                borderRadius: 10,
                padding: 16,
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
            }}
        >
            <FontAwesome5
                name={icon}
                size={18}
                color="#fff"
                style={{
                    marginRight: 16,
                    backgroundColor: color,
                    borderRadius: 20,
                    padding: 10,
                }}
            />
            <Text style={{ color: theme.text, fontSize: 16 }}>{label}</Text>
        </TouchableOpacity>
    );
};

export default function HouseholdModuleScreen() {
    const { theme } = useTheme();
    const navigation = useNavigation();

    const householdColor = theme.moduleColors.household;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background, padding: 20 }}>
            <ScrollView>
                <SectionButton
                    icon="info-circle"
                    label="Haushalt-Eigenschaften"
                    color={householdColor}
                    onPress={() => navigation.navigate('HouseholdProperties')}
                />
                <SectionButton
                    icon="sliders-h"
                    label="Haushalt-Einstellungen"
                    color={householdColor}
                    onPress={() => navigation.navigate('HouseholdSettingsScreen')}
                />
                <SectionButton
                    icon="th-large"
                    label="Raumverwaltung"
                    color={householdColor}
                    onPress={() => navigation.navigate('HouseholdRoomScreen')}
                />
                <SectionButton
                    icon="credit-card"
                    label="Abo / Aktivierung"
                    color={householdColor}
                    onPress={() => navigation.navigate('Subscription')}
                />
                <SectionButton
                    icon="trash-alt"
                    label="Haushalt verlassen / löschen"
                    color={householdColor}
                    onPress={() => navigation.navigate('HouseholdDangerZoneScreen')}
                />
            </ScrollView>
        </SafeAreaView>
    );
}
