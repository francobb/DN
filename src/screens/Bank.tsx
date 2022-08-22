// @ts-nocheck
import React, { useContext, useCallback, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTailwind } from "tailwind-rn";
import { MainTabsParamList } from "../types/navigation";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Layout,
  TopNav,
  themeColor,
  useTheme,} from "react-native-rapi-ui";
import { Context } from "../provider/PlaidProvider";
import {
  create_token_endpoint,
  getData,
  info_endpoint,
  set_access_token,
  storeData} from "../api";
import PlaidLink from "../components/plaid/PlaidLink";

export default function ({
  navigation,
}: NativeStackScreenProps<MainTabsParamList, "Bank">) {
  const tailwind = useTailwind();
  const { isDarkmode, setTheme } = useTheme();
  const [tokenLink, setTokenLink] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState(null);
  const { dispatch } = useContext(Context);

  const getInfo = useCallback(
    async (message?: any) => {
      const response = await fetch(info_endpoint, { method: "POST" });
      if (!response.ok) {
        dispatch({ type: "SET_STATE", state: { backend: false } });
        return { paymentInitiation: false };
      }
      const data = await response.json();
      dispatch({
        type: "SET_STATE",
        state: {
          products: data.products,
        },
      });
    },
    [dispatch]
  );
  const generateToken = useCallback(async () => {
    let obj = getData().then((r) => {
      console.log("done getting token from storage", r);
      return r;
    });
    let link_token = obj["link_token"];
    let expiration = obj["expiration"];
    if (link_token) {
      console.log("[:::::: TOKEN EXISTS ::::: ]");
      setTokenLink(link_token);
      setTokenExpiration(expiration);
      dispatch({ type: "SET_STATE", state: { link_token } });
    } else {
      console.log("[:::::: GENERATING TOKEN ::::: ]");
      const response = await fetch(create_token_endpoint, { method: "POST" });
      if (!response.ok) {
        dispatch({ type: "SET_STATE", state: { linkToken: null } });
        return;
      }
      const data = await response.json();
      if (data) {
        if (data.error != null) {
          dispatch({
            type: "SET_STATE",
            state: {
              linkToken: null,
              linkTokenError: data.error,
            },
          });
          return;
        }
        setTokenLink(data.link_token);
        setTokenExpiration(data.expiration);
        dispatch({ type: "SET_STATE", state: { linkToken: data.link_token } });
      }
      let { link_token, expiration } = data;
      await storeData({ link_token, expiration }, '@link_token');
    }
  }, [dispatch]);
  const setAccessToken = useCallback(async (public_token) => {
    const response = await fetch(set_access_token, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      body: `public_token=${public_token}`,
    });
    if (!response.ok) {
      dispatch({
        type: "SET_STATE",
        state: {
          itemId: `no item_id retrieved`,
          accessToken: `no access_token retrieved`,
          isItemAccess: false,
        },
      });
      return;
    }
    const data = await response.json();
    dispatch({
      type: "SET_STATE",
      state: {
        itemId: data.item_id,
        accessToken: data.access_token,
        isItemAccess: true,
      },
    });
  }, [dispatch]);

  useEffect(() => {
    const init = async () => {
      // await getInfo();
      await generateToken();
    };
    init().then((r) => console.log("done generating token"));
  }, [dispatch, generateToken, getInfo]);

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
      <PlaidLink
        linkToken={tokenLink}
        // onEvent={(event) => console.log("[EVENT DATA] :::: ",{ event })}
        onExit={(exit) => console.log(":::: DID NOT WORK :::: ", { exit })}
        // onSuccess={(success) => console.log(success.publicToken)}
        onSuccess={async (success) => {
          console.log("success. should be able to grab account balance", { success });
          await storeData(success.publicToken, '@publicToken');
          await setAccessToken(success.publicToken);
          dispatch({ type: "SET_STATE", state:
              { linkSuccess: true, publicToken: success.publicToken }
          });
          navigation.navigate("BankInfo");
        }}
      />
    </Layout>
  );
}

/*
  TODO: after getting account data, bottom tab [Home] is active.
   - need to set [Bank] as active.
   - need ability to go back.
   - cleanup typescript
 */