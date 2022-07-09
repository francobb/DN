import React from 'react';
import { Linking, View } from 'react-native';
import { MainTabsParamList } from "../types/navigation";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Layout, Section, SectionContent, Text, themeColor, TopNav, useTheme } from 'react-native-rapi-ui';
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
				<Section style={{ marginTop: 0 }}>
					<SectionContent>
						<Text 
							style={{color: 'blue'}}
						>
							Reports Page Where you can see a breakdown of the units
						</Text>
					</SectionContent>
				</Section>
			</View>
		</Layout>
	);
}
