import React, { useContext } from "react";
import { View, Text } from "react-native";
import { ShowBalance } from "../components/plaid/ShowBalance";
import { Context } from "../provider/PlaidProvider";
import { Layout, themeColor, TopNav, useTheme } from "react-native-rapi-ui";
import { NativeStackScreenProps } from "react-native-screens/native-stack";
import { BankStackProps } from "../types/navigation";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<BankStackProps, 'BankInfo'>;

const BankInfo = ({ route, navigation }: Props) => {
  const { isDarkmode, setTheme } = useTheme();
  const { linkSuccess, isItemAccess } = useContext(Context);

  return (
    <Layout>
      <TopNav
        leftContent={
          <Ionicons
            name="chevron-back"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        leftAction={() => navigation.goBack()}
        middleContent={'Bank Information'}
      />
      <View>
        { linkSuccess && isItemAccess && <ShowBalance /> }
      </View>
    </Layout>
  )
};
export { BankInfo }

/*
  todo:
    1) set theme to change colors

 */