import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigation } from '@react-navigation/native';

const SectionButton = ({
    icon,
    label,
    onPress,
}: {
    icon: any;
    label: string;
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
                    backgroundColor: '#444',
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

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background, padding: 20 }}>
            <ScrollView>
                <SectionButton
                    icon="info-circle"
                    label="Haushalt-Eigenschaften"
                    onPress={() => navigation.navigate('HouseholdProperties')}
                />
                <SectionButton
                    icon="sliders-h"
                    label="Haushalt-Einstellungen"
                    onPress={() => navigation.navigate('HouseholdSettings')}
                />
                <SectionButton
                    icon="th-large"
                    label="Raumverwaltung"
                    onPress={() => navigation.navigate('RoomManagement')}
                />
                <SectionButton
                    icon="credit-card"
                    label="Abo / Aktivierung"
                    onPress={() => navigation.navigate('Subscription')}
                />
                <SectionButton
                    icon="trash-alt"
                    label="Haushalt verlassen / löschen"
                    onPress={() => navigation.navigate('LeaveOrDelete')}
                />
            </ScrollView>
        </SafeAreaView>
    );
}
