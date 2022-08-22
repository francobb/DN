import React, { useContext } from "react";
import { View, Text } from "react-native";

import {Context} from "../../provider/PlaidProvider";

const PlaidAuth = () => {
  const {
    itemId,
    accessToken,
    linkToken,
    linkSuccess,
    isItemAccess,
    backend,
    linkTokenError,
  } = useContext(Context);
  // console.log({ backend });

  return (
    <View>
      {!linkSuccess ? (
        <View>
          <Text>Still need to login with Plaid</Text>
          { !backend ? (
            <Text>
                Unable to fetch link_token: please make sure your backend server
                is running and that your .env file has been configured with your
                <code>PLAID_CLIENT_ID</code> and <code>PLAID_SECRET</code>.
            </Text>
          ) :
            linkToken == null && backend ? (
              <Text>
                Unable to fetch link_token: please make sure your backend server
                is running and that your .env file has been configured
                correctly.
                <Text>
                  Error Code: <Text>{linkTokenError.error_code}</Text>
                </Text>
                <Text>
                  Error Type: <Text>{linkTokenError.error_type}</Text>
                </Text>
                <Text>Error Message: {linkTokenError.error_message}</Text>
              </Text>
            ) : linkToken === "" ? (<Text>Loading ...</Text>) : (
              <></>
            )}
        </View>
      ) : (<View></View>)}
    </View>
  )

};

export default PlaidAuth;