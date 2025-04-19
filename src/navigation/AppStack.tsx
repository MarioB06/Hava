import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';
import HouseholdModuleScreen from '../screens/Household/HouseholdModuleScreen';
// später auch: import HouseholdPropertiesScreen from ...

export type AppStackParamList = {
    BottomTabs: undefined;
    HouseholdModule: undefined;
    // HouseholdProperties: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function AppStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BottomTabs" component={BottomTabs} />
            <Stack.Screen name="HouseholdModule" component={HouseholdModuleScreen} />
        </Stack.Navigator>
    );
}
