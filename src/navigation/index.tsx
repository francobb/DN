import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';

import MainTabs from './MainTabs';
import Auth from './AuthStack';
import Loading from '../screens/utils/Loading';
import { AuthContext } from '../provider/AuthProvider';

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
