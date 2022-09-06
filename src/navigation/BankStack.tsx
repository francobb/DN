import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BankStackProps } from "../types/navigation";
import { Context } from "../provider/PlaidProvider";
import { BankInfo } from "../screens/BankInfo";
import Bank from "../screens/Bank";

const BankStack = createNativeStackNavigator<BankStackProps>();

const Banks = () => {

  const { linkSuccess, isItemAccess, publicToken } = useContext(Context);
  const BankComponent = (linkSuccess && publicToken && isItemAccess) ? BankInfo : Bank;


  return (
    <BankStack.Navigator>
      <BankStack.Screen
        options={{
          headerShown: false
        }}
        name="Bank"
        component={Bank}
      />
      <BankStack.Screen options={{
        headerShown: false
      }} name="BankInfo" component={BankInfo} />

      {/*<BankStack.Screen name="Bank" component={BankComponent} />*/}
    </BankStack.Navigator>
  )
};

export default Banks;