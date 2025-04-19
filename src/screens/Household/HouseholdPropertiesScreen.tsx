import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';

export default function HouseholdPropertiesScreen() {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background, padding: 20 }}>
            <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold' }}>
                Haushalt-Eigenschaften
            </Text>
        </SafeAreaView>
    );
}
