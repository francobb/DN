import React from "react";
import { View, Linking, TouchableHighlight } from "react-native";
import { MainStackParamList } from "../types/navigation";
import { StackScreenProps } from "@react-navigation/stack";
import tailwind from "tailwind-rn";
import { FlatGrid } from 'react-native-super-grid';
import { supabase } from "../initSupabase";
import {
  Layout,
  Button,
  Text,
  TopNav,
  Section,
  SectionContent,
  useTheme,
  themeColor,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";

export default function ({
  navigation,
}: StackScreenProps<MainStackParamList, "MainTabs">) {
  const { isDarkmode, setTheme } = useTheme();
  const [items, setItems] = React.useState([
      {name: 'Activities', code: '#1abc9c'},
      // {name: 'Distance', code: '#3498db'},
  ]);

  function _onPressButton(category: string) {
    console.log(category);

    if(category === "Activities"){
      navigation.navigate("CategoryList")
    }

    else {
      navigation.navigate("Category", { name: category })
      alert('You tapped the button!')
    }
    
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
      <View
        style={{
          // flex: 1,
          // alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* <Section style={{ marginTop: 0 }}>
          <SectionContent> */}
            {/* <Text fontWeight="bold" style={{ textAlign: "center" }}>
              These UI components provided by Rapi UI
            </Text>
            <Button
              style={{ marginTop: 10 }}
              text="Rapi UI Documentation"
              status="info"
              onPress={() => Linking.openURL("https://rapi-ui.kikiding.space/")}
            /> */}
            <FlatGrid
                itemDimension={85}
                spacing={10}
                data={[...items]}
                renderItem={({ item }) => (
                    <TouchableHighlight onPress={()=>_onPressButton(item.name)} > 
                        {/* <View style={[styles.itemContainer, { backgroundColor: item.code }]}> */}
                        <View style={[tailwind("justify-start rounded-lg p-3 h-10 w-24"), { backgroundColor: item.code }]}>
                            <Text style={tailwind("font-semibold text-sm text-center")}>{item.name}</Text>
                        </View>
                    </TouchableHighlight>
                )}
            />
{/*
          </SectionContent>
        </Section> */}
      </View>
    </Layout>
  );
}