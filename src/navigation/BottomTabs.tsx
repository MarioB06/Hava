import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'react-native';
import HomeScreen from '../screens/HomeScreen';
import { useTheme } from '../contexts/ThemeContext';

const Tab = createBottomTabNavigator();

function Dummy() {
    const { logout } = useAuth();
    const { theme } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <StatusBar barStyle={theme.mode === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: theme.text, fontSize: 18, marginBottom: 20 }}>Modules kommen bald</Text>
                <TouchableOpacity onPress={logout} style={{ backgroundColor: theme.accent, padding: 14, borderRadius: 10 }}>
                    <Text style={{ color: '#fff' }}>Abmelden</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

export default function BottomTabs() {
    const { theme } = useTheme();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.card,
                    borderTopColor: theme.mode === 'dark' ? '#333' : '#ccc',
                    height: 70,
                },
                tabBarActiveTintColor: theme.text,
                tabBarInactiveTintColor: theme.text + '99',
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={20} color={color} />,
                }}
            />
            <Tab.Screen
                name="Modules"
                component={Dummy}
                options={{
                    tabBarIcon: () => (
                        <View style={{
                            marginBottom: 30,
                            backgroundColor: theme.accent,
                            padding: 14,
                            borderRadius: 32,
                        }}>
                            <FontAwesome5 name="th-large" size={20} color="#fff" />
                        </View>
                    ),
                }}
            />
            <Tab.Screen
                name="Folder"
                component={Dummy}
                options={{
                    tabBarIcon: ({ color }) => <FontAwesome5 name="folder" size={20} color={color} />,
                }}
            />
        </Tab.Navigator>
    );
}
