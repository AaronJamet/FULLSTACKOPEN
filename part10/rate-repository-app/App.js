import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Main from './src/components/Main';
import { NativeRouter } from 'react-router-native';

const App = () => {
  return ( 
    <NativeRouter>
      <Main />
    </NativeRouter>
  );
}

export default App;
