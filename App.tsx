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
import AppStack from './src/navigation/AppStack';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import React from 'react';
import { Provider as PaperProvider, Portal } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { FeedbackProvider } from './src/services/feedbackService';

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
  // console.log('loading (auth):', loading);
  // console.log('landingSeen:', landingSeen);
  console.log('hasHousehold:', hasHousehold);

  useEffect(() => {
    if (landingSeen === null) {
      loadLandingSeen();
    }

    const checkHousehold = async () => {
      if (token && hasHousehold === null) {
        try {
          const households = await getMyHouseholds();
          const has = households.length > 0;
          setHasHousehold(has);

          if (has) {
            const userId = await AsyncStorage.getItem('userID');
            const isAdmin = parseInt(userId || '0') === households[0].admin_id;
            await AsyncStorage.setItem('isAdmin', isAdmin ? 'true' : 'false');
            console.log('Ist Admin:', isAdmin);
          }
        } catch (e) {
          console.log('Haushalt konnte nicht geladen werden');
          setHasHousehold(false);
          await AsyncStorage.setItem('isAdmin', 'false');
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

  return <AppStack />; // <-- vorher war hier BottomTabs
}


export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <PaperProvider>
            <Portal.Host>
              <FeedbackProvider>
                <NavigationContainer>
                  <Root />
                </NavigationContainer>
                <Toast />
              </FeedbackProvider>
            </Portal.Host>
          </PaperProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}