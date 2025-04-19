import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ModulesScreen from '../screens/ModulesScreen';
import HouseholdModuleScreen from '../screens/Household/HouseholdModuleScreen';
import HouseholdPropertiesScreen from '../screens/Household/HouseholdPropertiesScreen';
// später weitere Screens...

const Stack = createNativeStackNavigator();

export default function ModulesStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ModulesMain" component={ModulesScreen} />
            <Stack.Screen name="HouseholdModule" component={HouseholdModuleScreen} />
            <Stack.Screen name="HouseholdProperties" component={HouseholdPropertiesScreen} />
        </Stack.Navigator>
    );
}
