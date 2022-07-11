import React, { Fragment, ReactElement } from "react";
import { Layout, Text, themeColor, TopNav, useTheme } from "react-native-rapi-ui/index";
import { Ionicons } from "@expo/vector-icons";
import { View, FlatList, StyleSheet } from "react-native";
import { withHooksHOC } from "./utils/useThemeHOC";
import arcadesData from "../api/arcades.json"
import { useTailwind } from "tailwind-rn";
import { MainTabsParamList } from "../types/navigation";
import { NativeStackScreenProps } from "react-native-screens/native-stack";

type Unit = {
  name: string,
  rent: string,
  lease: string,
  late: string,
}
type House = {
  id: string,
  location: string,
  units: [Unit]
}

const Item = ({ units }: House) => {
  const tailwind = useTailwind();

  return (
    <View style={tailwind("flex text-center justify-center")}>
      {units.map((u, i) => (
        <View
          key={i}
          style={[
            tailwind(
              "border-4 border-green-900 border-solid w-80 rounded-lg mt-5"
            ),
            styles.flex_box2
          ]}
        >
          <View style={styles.rank_box2}>
            <Text style={styles.rank2}>Tenant</Text>
            <Text style={styles.rank2}>Rent</Text>
            <Text style={styles.rank2}>Lease</Text>
            <Text style={styles.rank2}>Late</Text>
          </View>
          <View style={styles.amount_box2}>
            <Text style={styles.amount2}>{u.name}</Text>
            <Text style={styles.amount2}>{u.rent}</Text>
            <Text style={styles.amount2}>{u.lease}</Text>
            <Text style={styles.amount2}>{u.late || 0}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};
const styles = StyleSheet.create({
  flex_box2: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    width: 320,
    // marginLeft: 20,
    // backgroundColor: "#227dba",
    borderRadius: 2,
    justifyContent: "space-around"
  },
  rank_box2: {
    marginTop: 4,
    marginBottom: 3,
    // marginLeft: 39,
    // borderColor: "#142246",
    // borderWidth: 1
  },
  rank2: {
    fontSize: 12,
    fontFamily: "arial",
    // color: "white",
    marginTop: 3,
    marginBottom: 3
    // textAlign: ""
  },

  amount_box2: {
    marginTop: 4,
    marginBottom: 3,
    borderColor: "#142246"
    // marginLeft: 145,
    // borderWidth: 1,
  },
  amount2: {
    fontSize: 12,
    fontFamily: "arial",
    textAlign: "left",
    // color: "white",
    marginTop: 3,
    marginBottom: 3
  }
});

type Props = NativeStackScreenProps<MainTabsParamList, 'Category'>;
const Category = ({ route, navigation }: Props) => {
  const tailwind = useTailwind();
  const { isDarkmode, setTheme } = useTheme();
  const [house, setHouse] = React.useState(arcadesData.houses.find(h => {
    if (h && h.location.toString().includes(route.params.name)) {
      return h
    }
  }))
  let icon = isDarkmode ? "sunny": "moon";

  const renderItem = ({ item }: any) => {
    return (
    <Item
      key={item.id}
      units={item.units}
     id={item.id} location={item.location}/>
  )}

  return (
      <Layout>
        <TopNav
          middleContent={`${route.params.name}`}
          leftContent={
            // @ts-ignore
            <Ionicons
              name="chevron-back"
              size={20}
              color={isDarkmode ? themeColor.white100 : themeColor.dark}
            />
          }
          leftAction={() => navigation.goBack()}
          rightContent={
            // @ts-ignore
            <Ionicons
              name={icon as "sunny"}
              size={20}
              color={isDarkmode ? themeColor.white100 : themeColor.dark}
            />
          }
          rightAction={() => {
            isDarkmode ? (setTheme("light")) : setTheme("dark");
          }}
        />
        { house ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              // justifyContent: "space-between"
            }}>
            <Text style={tailwind("text-center text-2xl mt-5")}>Monthly Income: ${house.units.map(u =>+u.rent).reduce((a, b) => a + b)}</Text>
            <Text style={tailwind("text-center")}>Mortgage: {house.mortgage}</Text>
            <View style={tailwind("")}>
              <FlatList
                data={[house]}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            </View>
          </View> ) : null }
      </Layout>
    )
};
export default withHooksHOC(Category);