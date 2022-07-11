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
  useTheme
} from "react-native-rapi-ui";
import { Ionicons } from "@expo/vector-icons";
import { useTailwind } from "tailwind-rn";

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
        <View style={[{alignItems: "center"}]}>
          <Text>Available Balance:</Text>
        </View>
        <View>
          <Text style={tailwind("text-3xl text-center")}>$6500.00</Text>
          <Text style={tailwind("text-lg text-center")}>Recent Transactions</Text>
        </View>
        <View style={tailwind(
          "mt-5 items-center"
          )}
        >
          <View style={[tailwind("w-80 flex flex-row justify-around")]}>
            <View>
              <Text style={tailwind("")}>[ Owner Payment ]</Text>
              <Text style={tailwind("")}>[ 212 Welles Loan ]</Text>
              <Text style={tailwind("")}>[ 23 Paradis Loan ]</Text>
              <Text style={tailwind("")}>[ Owner Payment ]</Text>
              <Text style={tailwind("")}>[ Legal Zoom Payment ]</Text>
            </View>
            <View>
              <Text style={tailwind("")}>+1,150.00</Text>
              <Text style={tailwind("")}>(-1,965.95)</Text>
              <Text style={tailwind("")}>(-2,460.81)</Text>
              <Text style={tailwind("")}>+4,016.95</Text>
              <Text style={tailwind("")}>(-80.77)</Text>
            </View>
          </View>
        </View>
      </View>
    </Layout>
  );
}
