import React from 'react';
import { Linking, View } from 'react-native';
import { MainStackParamList } from '../types/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import { Button, Layout, Section, SectionContent, Text, themeColor, TopNav, useTheme } from 'react-native-rapi-ui';
import { supabase } from '../initSupabase';
import { Ionicons } from '@expo/vector-icons';

export default function ({
	navigation,
}: StackScreenProps<MainStackParamList, 'MainTabs'>) {
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
					</SectionContent>
				</Section>
			</View>
		</Layout>
	);
}
