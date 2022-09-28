import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Layout, themeColor, TopNav, useTheme } from 'react-native-rapi-ui';
import { Ionicons } from '@expo/vector-icons';
import { getAuth, signOut } from "firebase/auth";

import { MainTabsParamList } from "../types/navigation";

export default function ({
	navigation,
}: NativeStackScreenProps<MainTabsParamList, 'Home'>) {
	const auth = getAuth();
	const { isDarkmode, setTheme } = useTheme();

	return (
		<Layout>
			<TopNav
				middleContent="Settings"
				leftContent = {
					<Ionicons
						name="chevron-back"
						size={20}
						color={isDarkmode ? themeColor.white100 : themeColor.dark}
					/>
				}
				leftAction={() => navigation.goBack()}
				rightContent = {
					<Ionicons
						name={isDarkmode ? "sunny" : "moon"}
						size={20}
						color={isDarkmode ? themeColor.white100 : themeColor.dark}
					/>
				}
				rightAction={() => {
					if (isDarkmode) {
						setTheme("light");
					} else {
						setTheme("dark");
					}
					}
				}
			/>
			<View>
				{/*<Section style={{ marginTop: 0 }}>*/}
						<Text
							style={{color: 'blue'}}
							onPress={async () => {
								signOut(auth).then(() => {
									// Sign-out successful.
									alert("YOU SIGNED OUT");
								}).catch((error) => {
									// An error happened.
									console.log(":::: PROBLEM SIGNING OUT ::::");
								});
							}}
						>
							Log Out
						</Text>
				{/*</Section>*/}
			</View>
		</Layout>
	);
}
