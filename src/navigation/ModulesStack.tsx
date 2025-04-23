import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ModulesScreen from '../screens/ModulesScreen';

import HouseholdModuleScreen from '../screens/Household/HouseholdModuleScreen';
import HouseholdPropertiesScreen from '../screens/Household/HouseholdPropertiesScreen';
import HouseholdSettingsScreen from '../screens/Household/HouseholdSettingsScreen';
import HouseholdRoomScreen from '../screens/Household/HouseholdRoomScreen';
import HouseholdDangerZoneScreen from '../screens/Household/HouseholdDangerZoneScreen';

import UserModuleScreen from '../screens/User/UserModuleScreen';




const Stack = createNativeStackNavigator();

export default function ModulesStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ModulesMain" component={ModulesScreen} />

            <Stack.Screen name="HouseholdModule" component={HouseholdModuleScreen} />
            <Stack.Screen name="HouseholdProperties" component={HouseholdPropertiesScreen} />
            <Stack.Screen name="HouseholdSettingsScreen" component={HouseholdSettingsScreen} />
            <Stack.Screen name="HouseholdRoomScreen" component={HouseholdRoomScreen} />
            <Stack.Screen name="HouseholdDangerZoneScreen" component={HouseholdDangerZoneScreen} />


            <Stack.Screen name="UserModule" component={UserModuleScreen} />




        </Stack.Navigator>
    );
}
