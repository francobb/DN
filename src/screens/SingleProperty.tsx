import React, { useCallback, useEffect, useState } from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "react-native-screens/native-stack";
import { Layout, Text, themeColor, TopNav, useTheme } from "react-native-rapi-ui/index";
import { Ionicons } from "@expo/vector-icons";
import { useTailwind } from "tailwind-rn";

import { withHooksHOC } from "./utils/useThemeHOC";
import { MainTabsParamList } from "../types/navigation";
import properties from "../api/properties.json"
import { getData } from "../api";

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
  const styles = StyleSheet.create({
    flex_box2: {
      display: "flex",
      flex: 1,
      flexDirection: "row",
      width: 320,
      borderRadius: 2,
      justifyContent: "space-around"
    },
    rank_box2: {
      marginTop: 4,
      marginBottom: 3,
    },
    rank2: {
      fontSize: 12,
      fontFamily: "arial",
      marginTop: 3,
      marginBottom: 3
    },

    amount_box2: {
      marginTop: 4,
      marginBottom: 3,
      borderColor: "#142246"
    },
    amount2: {
      fontSize: 12,
      fontFamily: "arial",
      textAlign: "left",
      marginTop: 3,
      marginBottom: 3
    }
  });

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

type Props = NativeStackScreenProps<MainTabsParamList, 'SingleProperty'>;
const SingleProperty = ({ route, navigation }: Props) => {
  const tailwind = useTailwind();
  const { isDarkmode, setTheme } = useTheme();
  const [props, setProps] = useState<any>({})
  const getPropertiesFromStore = useCallback(async () => {
    let propsFromStorage = await getData("properties")
    if (propsFromStorage){
      console.log("getting from storage");
      setProps(propsFromStorage)
    }
  }, [])
  let icon = isDarkmode ? "sunny": "moon";

  let house = properties.houses.find(h => {
    if (h && h.location.toString().includes(route.params.name)) {
      return h
    }
  });

  let crib = props.houses.find((h:House) => {
    if (h && h.location.toString().includes(route.params.name)) {
      return h
    }
  });

  useEffect(() => {
    getPropertiesFromStore()
      .then(r => console.log("::::: FINISHED GETTING PROPS FROM STORE :::::"));
  }, [getPropertiesFromStore])


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
            <Ionicons
              name="chevron-back"
              size={20}
              color={isDarkmode ? themeColor.white100 : themeColor.dark}
            />
          }
          leftAction={() => navigation.goBack()}
          rightContent={
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
        { crib ? (
          <View
            style={{
              flex: 1,
              alignItems: "center",
            }}>
            <Text style={tailwind("text-center text-2xl mt-5")}>
              Monthly Income: ${crib.units.map((u: { rent: string | number; }) =>+u.rent).reduce((a: any, b: any) => a + b)}
            </Text>
            <Text style={tailwind("text-center")}>Mortgage: {crib.mortgage}</Text>
            <Text style={tailwind("text-center")}>Average Cost: $999.00</Text>
            <View style={tailwind("")}>
              <FlatList
                data={[crib]}
                renderItem={renderItem}
                keyExtractor={item => item.id}
              />
            </View>
          </View> ) : null }
      </Layout>
    )
};
export default withHooksHOC(SingleProperty);

/**
 * todo:
 *  1) convert styles to use tailwind
 */