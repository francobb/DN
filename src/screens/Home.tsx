import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Image, ImageBackground, TouchableHighlight, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { FlatGrid } from "react-native-super-grid";
import { Layout, Text, themeColor, TopNav, useTheme } from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { useTailwind } from "tailwind-rn";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

import { MainTabsParamList } from "../types/navigation";
import { getData, storeData } from "../api";

export default function ({
  navigation,
}: NativeStackScreenProps<MainTabsParamList, "Home">) {
  const storage = getStorage();
  const tailwind = useTailwind();
  const { isDarkmode, setTheme } = useTheme();
  const [props, setProps] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false);
  const pathReference = ref(storage, 'properties.json');
  const getPropertiesUrl = useCallback(async () => {
    let propsFromStorage = await getData("properties")
    if (propsFromStorage){
      console.log("getting from storage");
      setProps(propsFromStorage)
    } else {
      setLoading(true)
      getDownloadURL(pathReference).then(
        async (url) => {
          console.log({url});
          const response = await fetch(url, {
            method: "GET",
          });
          const data = await response.json();
          if (data){
            let houses = data.houses;
            setProps([...houses]);
            await storeData([...houses], "properties")
            setLoading(false)
          }
        }
      ).catch(
        (e) => {
          console.log("THERE WAS AN ERROR PLAIRE");
        }
      )
    }
  }, [])
  useEffect(() => {
    getPropertiesUrl().then(r => console.log(":::::  :::::"));
  }, [getPropertiesUrl])

  function propertyData(){
    if (props.length) return props
    else return []
  };

  function _onPressButton(category: string) {
    navigation.navigate("SingleProperty", { name: category })
  }

  const Loader = (
    <>
      <ActivityIndicator size="large" color="#00ff00" />
    </>
  )

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
      { loading
        ? Loader
        : (<View style={{ alignItems: "center", }}>
          <FlatGrid
            itemDimension={500}
            spacing={30}
            data={[...propertyData()]}
            renderItem={({ item }) => {
              let img = {uri: item.fileName};
                return (
                  <TouchableHighlight
                    onPress={()=>_onPressButton(item.location.split(",")[0].split(" ").splice(0, 3).join(" "))} >
                    <View style={[tailwind("rounded-lg"), {
                      // backgroundColor: item.code,
                      // backgroundColor: '#ffffff',
                      shadowRadius: 5,
                      shadowOpacity: .5,
                      shadowOffset:{ width: 0, height: 3 },
                      shadowColor: isDarkmode ? "white" : "black",
                      backgroundColor: isDarkmode ?  "rgb(88,88,88)" : "white",
                      justifyContent: 'center',
                    }]}>
                      <View
                        style={{
                          height: 270,
                          paddingLeft: 10,
                          paddingRight: 10,
                          paddingTop: 10
                        }}
                      >
                        <ImageBackground
                          resizeMode="cover"
                          style={[{
                            height: '100%',
                          }]}
                          source={img}
                        />
                      </View>

                      <View
                        style={[tailwind("p-3 flex flex-row justify-between"), {}]}
                      >
                        <View
                          style={[tailwind(""), {

                          }]}
                        >
                          <Text style={tailwind("text-lg")}>{item.location.split(" ").splice(0, 3).join(" ")}</Text>
                          <Text style={tailwind("text-sm")}>{item.location.split(" ").splice(3).join(" ")}</Text>
                        </View>

                        <View
                          style={[tailwind(""), {}]}
                        >
                          <Text style={tailwind("text-lg")}>$322,000</Text>
                          <Text style={tailwind("text-sm")}>{item.beds}bds | {item.bath}ba</Text>
                        </View>
                      </View>
                    </View>
                  </TouchableHighlight>
                )
              }
            }
          />
        </View>)
      }
    </Layout>
  );
}

/**
 * todo:
 *  1) move static data to backend ✅
 *  2) get zestimate dynamically?
 *    - move data to spreadsheet
 *  2) cleanup
 */

