import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import CategoryList from '../screens/CategoryList';
import MainTabs from './MainTabs';
import SingleCategoryScreen from '../screens/SingleCategoryScreen';
import Profile from '../screens/Profile';
import { TabRouter } from '@react-navigation/native';
import Home from '../screens/Home';
import Category from '../screens/Category'
import { MainTabsParamList } from "../types/navigation";

interface Route {
	params: {}
}
type Prop = {
	route: Route 
}

type RootStackParamList = {
	Home: undefined;
	Profile: { userId: string };
	Feed: { sort: 'latest' | 'top' } | undefined;
};

const HomeStack = createStackNavigator<MainTabsParamList>();
const Stack = () => {
  return (
    <HomeStack.Navigator
    screenOptions={{
      headerShown: false
    }}>
			<HomeStack.Screen name="Home" component={Home} />
			<HomeStack.Screen name="Profile" component={Profile} />
			<HomeStack.Screen name="CategoryList" component={CategoryList} />	
			<HomeStack.Screen name="Category" component={Category} />
    </HomeStack.Navigator>
  )
};

export default Stack;
