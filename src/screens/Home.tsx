import React from "react";
import { View, TouchableHighlight } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatGrid } from 'react-native-super-grid';
import {
  Layout,
  Text,
  TopNav,
  useTheme,
  themeColor,} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { useTailwind } from "tailwind-rn";
import { MainTabsParamList } from "../types/navigation";

export default function ({
  navigation,
}: NativeStackScreenProps<MainTabsParamList, "Home">) {
  const tailwind = useTailwind();
  const { isDarkmode, setTheme } = useTheme();
  let properties = [
    {name: '212 WELLES STREET', code: '#1abc9c'},
    {name: '23 PARADIS AVENUE', code: '#444795'},
  ]

  function _onPressButton(category: string) {
    navigation.navigate("SingleProperty", { name: category })
  }

  return (
    <Layout>
      <TopNav
        middleContent="Francois Rentals LLC"
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
      <FlatGrid
          itemDimension={500}
          spacing={30}
          data={[...properties]}
          renderItem={({ item }) => (
              <TouchableHighlight onPress={()=>_onPressButton(item.name)} >
                <View>
                  <View style={[tailwind("justify-center rounded-lg p-3"), {
                    backgroundColor: item.code,
                    height: 100
                  }]}>
                      <Text style={tailwind("font-semibold text-xl text-center")}>{item.name}</Text>
                  </View>
                </View>
              </TouchableHighlight>
          )}
      />
      </View>
    </Layout>
  );
}

/**
 * todo:
 *  1) move static data to backend
 *  2)
 */

