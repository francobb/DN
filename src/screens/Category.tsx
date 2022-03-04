import React from "react";
import { Layout, Text, themeColor, TopNav, useTheme } from "react-native-rapi-ui/index";
import { Ionicons } from "@expo/vector-icons";
import { View, FlatList } from "react-native";
import useArcades from "../provider/ArcadeProvider";
import { withHooksHOC } from "./utils/useThemeHOC";
import arcadesData from "../api/arcades.json"

const Item = ({ name }) => (
  <View>
    <Text>{name}</Text>
  </View>
);

const Category = ({ route, navigation }) => {
  const { isDarkmode, setTheme } = useTheme();
  // const [searchApi, results, error] = useArcades();
  let icon = isDarkmode ? "sunny": "moon";

  let DATA = arcadesData.businesses;

  const renderItem = ({ item }) => {
    console.log(`${item.name} `);
    return (
    <Item title={item.name} />
  );}

  if (route.params.name === "Arcades") {
    return (
      <Layout>
        <TopNav
          middleContent={`${route.params.name}`}
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
              name={icon}
              size={20}
              color={isDarkmode ? themeColor.white100 : themeColor.dark}
            />
          }
          rightAction={() => {
            isDarkmode ? (setTheme("light")) : setTheme("dark");
          }}
        />
        <View
          style={{
            flex: 1,
            alignItems: "center",
            //   justifyContent: "center",
          }}
        >
          <Text fontWeight="bold">Show local for Arcades</Text>
          <FlatList
            data={DATA}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />

        </View>
      </Layout>
    )
  } else {
    return (
    <Layout>
      <TopNav
        middleContent={`${route.params.name}`}
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
            name={icon}
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        rightAction={() => {
          isDarkmode ? (setTheme("light")) : setTheme("dark");
        }}
      />
      <View
        style={{
          flex: 1,
          alignItems: "center",
          //   justifyContent: "center",
        }}
      >
        <Text fontWeight="bold">Show local for main categories</Text>

      </View>
    </Layout>
  );
  }

};

export default withHooksHOC(Category);