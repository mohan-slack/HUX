import React, { useEffect, useState, createContext, useContext } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthScreen from './features/auth/AuthScreen';
import HomeScreen from './features/main/HomeScreen';
import ProfileScreen from './features/main/ProfileScreen';
import SettingsScreen from './features/main/SettingsScreen';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';

// Auth context for global auth state
const AuthContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: (v: boolean) => {},
});

// Tab navigator for main app
const Tab = createBottomTabNavigator();
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';
          if (route.name === 'Home') iconName = 'home';
          if (route.name === 'Profile') iconName = 'person';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Stack navigator for modal navigation
const Stack = createNativeStackNavigator();
function RootStack() {
  const { isLoggedIn } = useContext(AuthContext);
  return (
    <Stack.Navigator>
      {!isLoggedIn ? (
        <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ presentation: 'modal' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false, // We'll handle foreground manually
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigationRef = useNavigationContainerRef();
  // Check token on mount
  useEffect(() => {
    const checkToken = async () => {
      const token = await AsyncStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    checkToken();
  }, []);

  useEffect(() => {
    // Listen for notifications in foreground
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      const { title, body } = notification.request.content;
      Alert.alert(title || 'Notification', body || '');
      // You can add navigation or custom logic here
    });
    // Handle notification taps (background/quit/foreground)
    const responseSub = Notifications.addNotificationResponseReceivedListener(response => {
      // Example: Navigate to Home screen on tap
      if (navigationRef.isReady()) {
        navigationRef.navigate('Main', { screen: 'Home' });
      }
      // You can customize: use response.notification.request.content.data for deep linking
    });
    return () => {
      subscription.remove();
      responseSub.remove();
    };
  }, [navigationRef]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <NavigationContainer ref={navigationRef}>
        <RootStack />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

// Usage in screens:
// To open modal: navigation.navigate('Settings')
// To update auth state: useContext(AuthContext).setIsLoggedIn(false) on logout 