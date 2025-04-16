import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import AuthStack from './src/navigation/AuthStack';
import BottomTabs from './src/navigation/BottomTabs';
import LandingScreen from './src/screens/LandingScreen';
import { NavigationContainer } from '@react-navigation/native';
import './src/i18n';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMyHouseholds } from './src/services/household';
import CreateHouseholdScreen from './src/screens/CreateHouseholdScreen';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function Root() {
  const { token, loading } = useAuth();
  const [landingSeen, setLandingSeen] = useState<boolean | null>(null);
  const [hasHousehold, setHasHousehold] = useState<boolean | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const loadLandingSeen = async () => {
    const value = await AsyncStorage.getItem('landingSeen');
    setLandingSeen(value === 'true'); // true oder false setzen
  };

  console.log('token:', token);
  console.log('loading (auth):', loading);
  console.log('landingSeen:', landingSeen);
  console.log('hasHousehold:', hasHousehold);

  useEffect(() => {
    if (landingSeen === null) {
      loadLandingSeen();
    }

    const checkHousehold = async () => {
      if (token && hasHousehold === null) {
        try {
          const households = await getMyHouseholds();
          setHasHousehold(households.length > 0);
        } catch (e) {
          console.log('Haushalt konnte nicht geladen werden');
          setHasHousehold(false);
        }
      }
    };

    if (token) {
      checkHousehold();
    }
  }, [token, landingSeen, hasHousehold]);


  // Der UseEffect wird bei Änderungen von landingSeen oder token ausgeführt

  if (loading || landingSeen === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#121212' }}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (landingSeen === false) return <LandingScreen onFinish={() => setLandingSeen(true)} />; // Zeige den Landing-Bildschirm nur, wenn landingSeen false ist
  if (!token) return <AuthStack />; // Wenn kein Token vorhanden ist, gehe zu AuthStack

  if (hasHousehold === false) return <CreateHouseholdScreen onSuccess={() => setHasHousehold(true)} />; // Wenn kein Haushalt vorhanden, führe die Erstellungslogik aus

  return <BottomTabs />; // Wenn alles überprüft ist, gehe zu BottomTabs
}


export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <NavigationContainer>
            <Root />
          </NavigationContainer>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}