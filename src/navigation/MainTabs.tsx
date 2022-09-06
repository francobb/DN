import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { themeColor, useTheme } from "react-native-rapi-ui";
import TabBarIcon from "../components/utils/TabBarIcon";
import TabBarText from "../components/utils/TabBarText";

import Bank from "../screens/Bank";
import Main from './MainStack';
import { Context } from "../provider/PlaidProvider";
import { BankInfo } from "../screens/BankInfo";
import Report from "./ReportStack";
import Banks from "./BankStack";

const Tabs = createBottomTabNavigator();
const MainTabs = () => {
  const { isDarkmode } = useTheme();
  const { linkSuccess, isItemAccess, dispatch, publicToken } = useContext(Context);

  const BankComponent = (linkSuccess && publicToken && isItemAccess) ? BankInfo : Bank;

  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: isDarkmode ? themeColor.dark100 : "#c0c0c0",
          backgroundColor: isDarkmode ? themeColor.dark200 : "#fff",
        },
      }}
    >
      <Tabs.Screen
        name="Main"
        component={Main}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Main" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"md-home"} />
          ),
        }}
      />
      <Tabs.Screen
        name="Bank"
        component={Banks}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Bank" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"logo-usd"} />
          ),
        }}
      />
      <Tabs.Screen
        name="Reports"
        component={Report}
        options={{
          tabBarLabel: ({ focused }) => (
            <TabBarText focused={focused} title="Reports" />
          ),
          tabBarIcon: ({ focused }) => (
            <TabBarIcon focused={focused} icon={"document"} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default MainTabs;
