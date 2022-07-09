import React from "react";
import { View, TouchableHighlight } from "react-native";
import { MainTabsParamList } from "../types/navigation";
// @ts-ignore
import { StackScreenProps } from "@react-navigation/native-stack";
import {
  Layout,
  TopNav,
  Text,
  themeColor,
  useTheme, SectionContent, Section,
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { useTailwind } from "tailwind-rn";
import { supabase } from "../initSupabase";


export default function ({
  navigation,
}: StackScreenProps<MainTabsParamList, "Bank">) {
  const tailwind = useTailwind();
  const [items, setItems] = React.useState([]);
function _onPressButton(category: string) {
  navigation.navigate("Category", { name: category })
  alert('You tapped the button!')
}

  const { isDarkmode, setTheme } = useTheme();
  return (
    <Layout>
      <TopNav
        middleContent="Banking"
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
        style={{}}
      >
        {/*<Section style={{ marginTop: 0 }}>*/}
            <View style={[{alignItems: "center"},tailwind("flex justify-center text-center")]}>
              <Text>Available Balance:</Text>
            </View>
            <View>
              <Text style={tailwind("text-3xl text-center")}>$6500.00</Text>
            </View>
            <View style={tailwind("mt-5")}>
              <Text style={tailwind("text-lg text-center")}>Recent Transactions</Text>
              <View style={tailwind("flex")}>
                <Text style={tailwind("flex justify-between")}>[Legal Zoom] <Text style={tailwind("text-right")}>$-80.77</Text></Text>
              </View>
            </View>
        {/*</Section>*/}
      </View>
    </Layout>
  );
}
