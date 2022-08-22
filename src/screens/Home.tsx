import React from "react";
import { View, Linking, TouchableHighlight } from "react-native";
import { MainTabsParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useTailwind } from "tailwind-rn";
import { FlatGrid } from 'react-native-super-grid';
import {
  Layout,
  Text,
  TopNav,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

export default function ({
  navigation,
}: NativeStackScreenProps<MainTabsParamList, "Home">) {
  const tailwind = useTailwind();
  const { isDarkmode, setTheme } = useTheme();
  const [items, setItems] = React.useState([
      {name: '212 WELLES STREET', code: '#1abc9c'},
      {name: '23 PARADIS AVENUE', code: '#444795'},
  ]);

  function _onPressButton(category: string) {
    navigation.navigate("Category", { name: category })
  }

  return (
    <Layout>
      <TopNav
        middleContent="Home"
        leftContent={
          <Ionicons
            name={isDarkmode ? "grid-outline" : "grid"}
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        leftAction={()=>
          navigation.navigate("Profile")
        }
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
      <View style={{ alignItems: "center", }} >
        <Text style={{ fontSize: 20, }}> Francois Rentals LLC </Text>
      <FlatGrid
          itemDimension={85}
          spacing={10}
          data={[...items]}
          renderItem={({ item }) => (
              <TouchableHighlight onPress={()=>_onPressButton(item.name)} >
                  {/* <View style={[styles.itemContainer, { backgroundColor: item.code }]}> */}
                  <View style={[tailwind("justify-start rounded-lg p-3 "), { backgroundColor: item.code }]}>
                      <Text style={tailwind("font-semibold text-sm text-center")}>{item.name}</Text>
                  </View>
              </TouchableHighlight>
          )}
      />
      </View>
    </Layout>
  );
}