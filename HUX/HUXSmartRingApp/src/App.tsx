import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import DashboardScreen from './features/DashboardScreen';

const App = () => (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#F1F5F9' }}>
    <StatusBar barStyle="dark-content" backgroundColor="#F1F5F9" />
    <DashboardScreen />
  </SafeAreaView>
);

export default App; 