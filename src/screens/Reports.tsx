import React, { useState } from 'react';
import { Linking, View } from 'react-native';
import { MainTabsParamList } from "../types/navigation";
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Button, Layout, Section, SectionContent, Text, themeColor, TopNav, useTheme } from 'react-native-rapi-ui';
import { Ionicons } from '@expo/vector-icons';
import { useTailwind } from "tailwind-rn";
import DropDownPicker from 'react-native-dropdown-picker';

export default function ({
	navigation,
}: NativeStackScreenProps<MainTabsParamList, 'Home'>) {
	let tailwind = useTailwind();
	const { isDarkmode, setTheme } = useTheme();
	const [open, setOpen] = useState(false);
	const [value, setValue] = useState([]);
	const [items, setItems] = useState([
		{label: 'Jan', value: 'January'},
		{label: 'Feb', value: 'February'},
		{label: 'Mar', value: 'March'},
		{label: 'Apr', value: 'April'},
		{label: 'May', value: 'May'},
		{label: 'Jun', value: 'June'},
		{label: 'Jul', value: 'July'},
		{label: 'Aug', value: 'August'},
		{label: 'Sep', value: 'September'},
		{label: 'Oct', value: 'October'},
		{label: 'Nov', value: 'November'},
		{label: 'Dec', value: 'December'},
	]);

	return (
		<Layout>
			<TopNav
				middleContent="Reports"
				leftContent = {
					<Ionicons
						name={isDarkmode ? "grid-outline" : "grid"}
						size={20}
						color={isDarkmode ? themeColor.white100 : themeColor.dark}
					/>
				}
				leftAction={() => navigation.navigate("Profile")}
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
					}}
			/>
			<View>
				<View style={tailwind("items-center mt-5")}>
					<View style={tailwind("w-80")}>
						<DropDownPicker
							open={open}
							value={value}
							items={items}
							setOpen={setOpen}
							setValue={setValue}
							setItems={setItems}
							theme={isDarkmode ? "DARK"  : "LIGHT"}
							multiple={true}
							mode="BADGE"
							placeholder="Choose A Month"
							dropDownContainerStyle={tailwind("w-80 text-xl")}
							badgeDotColors={[
								"#e76f51",
								"#00b4d8",
								"#e9c46a",
								"#e76f51",
								"#8ac926",
								"#00b4d8",
								"#e9c46a"
							]}
						/>
					</View>
				</View>
				<View style={[tailwind("mt-10") ,{ flexDirection: 'row', alignItems: 'center'}]}>
					<View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
					{/*<Text>*/}
						<Text style={{textAlign: 'center'}}> Reports </Text>
					{/*</Text>*/}
					<View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
				</View>
			</View>
		</Layout>
	);
}
