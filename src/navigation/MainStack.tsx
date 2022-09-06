import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Profile from '../screens/Profile';
import Home from '../screens/Home';
import SingleProperty from '../screens/SingleProperty'
import { MainTabsParamList } from "../types/navigation";

const HomeStack = createNativeStackNavigator<MainTabsParamList>();
const Stack = () => {
  return (
    <HomeStack.Navigator
    screenOptions={{
      headerShown: false
    }}>
			<HomeStack.Screen name="Home" component={Home} />
			<HomeStack.Screen name="Profile" component={Profile} />
			<HomeStack.Screen name="SingleProperty" component={SingleProperty} />
    </HomeStack.Navigator>
  )
};

export default Stack;
