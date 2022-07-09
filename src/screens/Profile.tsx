import React from 'react';
import { Linking, View, Text } from 'react-native';
import { MainTabsParamList } from "../types/navigation";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Layout, Section, themeColor, TopNav, useTheme } from 'react-native-rapi-ui';
import { supabase } from '../initSupabase';
import { Ionicons } from '@expo/vector-icons';

export default function ({
	navigation,
}: NativeStackScreenProps<MainTabsParamList, 'Home'>) {
	const { isDarkmode, setTheme } = useTheme();

	return (
		<Layout>
			<TopNav
				middleContent="Settings"
				leftContent = {
					// @ts-ignore
					<Ionicons
						name="chevron-back"
						size={20}
						color={isDarkmode ? themeColor.white100 : themeColor.dark}
					/>
				}
				leftAction={() => navigation.goBack()}
				rightContent = {
					// @ts-ignore
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
								const { error } = await supabase.auth.signOut();
								if (!error) {
									alert("Signed out!");
								}
								if (error) {
									alert(error.message);
								}
							}}
						>
							Log Out
						</Text>
				{/*</Section>*/}
			</View>
		</Layout>
	);
}
