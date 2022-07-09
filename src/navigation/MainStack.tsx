import React from 'react';
// @ts-ignore
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Bank from "../screens/Bank";
import Profile from '../screens/Profile';
import Home from '../screens/Home';
import Reports from "../screens/Reports";
import Category from '../screens/Category'
import { MainTabsParamList } from "../types/navigation";

interface Route {
	params: {}
}
type Prop = {
	route: Route 
}

type RootStackParamList = {
	// Home: undefined;
	// Profile: { userId: string };
	// Feed: { sort: 'latest' | 'top' } | undefined;
};

const HomeStack = createNativeStackNavigator<MainTabsParamList>();
const Stack = () => {
  return (
    <HomeStack.Navigator
    screenOptions={{
      headerShown: false
    }}>
			<HomeStack.Screen name="Home" component={Home} />
			<HomeStack.Screen name="Profile" component={Profile} />
			<HomeStack.Screen name="Bank" component={Bank} />
			<HomeStack.Screen name="Reports" component={Reports} />
			<HomeStack.Screen name="Category" component={Category} />
    </HomeStack.Navigator>
  )
};

export default Stack;
