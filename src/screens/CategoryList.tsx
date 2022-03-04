import React from "react";
import { View, TouchableHighlight } from "react-native";
import { MainStackParamList } from "../types/navigation";
import { StackScreenProps } from "@react-navigation/stack";
import {
  Layout,
  TopNav,
  Text,
  themeColor,
  useTheme,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { FlatGrid } from 'react-native-super-grid';
import tailwind from "tailwind-rn";


export default function ({
  navigation,
}: StackScreenProps<MainStackParamList, "CategoryList">) {

  const [items, setItems] = React.useState([
    {name: 'Arcades', code: '#1abc9c'},
    {name: 'Live Shows', code: '#2ecc71'},
    {name: 'Pool Halls', code: '#3498db'},
    {name: 'Hookah Bars', code: '#9b59b6'},
    {name: 'Dinner', code: '#34495e'},
    {name: 'Outdoor Activities', code: '#16a085'},
    {name: 'Cooking Classes', code: '#7f8c8d'},
    {name: 'Arts & Crafts', code: '#c0392b'},
]);
function _onPressButton(category: string) {
  navigation.navigate("Category", { name: category })
  alert('You tapped the button!')
}

  const { isDarkmode, setTheme } = useTheme();
  return (
    <Layout>
      <TopNav
        middleContent="Activities"
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        leftAction={() => navigation.goBack()}
        rightContent={
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
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* This text using ubuntu font */}
        <FlatGrid
                itemDimension={130}
                spacing={10}
                data={[...items]}
                renderItem={({ item }) => (
                    <TouchableHighlight onPress={()=>_onPressButton(item.name)} > 
                        {/* <View style={[styles.itemContainer, { backgroundColor: item.code }]}> */}
                        <View style={[tailwind("justify-end rounded-lg p-3 h-40"), { backgroundColor: item.code }]}>

                            <Text style={tailwind("font-semibold text-sm")}>{item.name}</Text>
                        </View>
                    </TouchableHighlight>
                )}
            />
      </View>
    </Layout>
  );
}
