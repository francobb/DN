import React, { useContext } from "react";
import { View, Text } from "react-native";
import { ShowBalance } from "../components/plaid/ShowBalance";
import { Context } from "../provider/PlaidProvider";
import { Layout, TopNav } from "react-native-rapi-ui";

const BankInfo = () => {
  const { linkSuccess, isItemAccess } = useContext(Context);

  return (
    <Layout>
      <TopNav
      middleContent={'Bank Info'}
      />
      <View>
        { linkSuccess && isItemAccess && <ShowBalance /> }
      </View>
    </Layout>
  )
};
export { BankInfo }