import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import MainTabs from './MainTabs';
import Auth from './AuthStack';
import { AuthContext } from '../provider/AuthProvider';
import Loading from '../screens/utils/Loading';

export default () => {
	const auth = useContext(AuthContext);
	const user = auth.user;
	return (
		<NavigationContainer>
			{user == null && <Loading />}
			{user == false && <Auth />}
			{user == true && <MainTabs />}
		</NavigationContainer>
	);
};
