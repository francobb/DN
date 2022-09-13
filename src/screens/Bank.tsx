import React, { useContext, useCallback, useEffect, useState } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { useTailwind } from "tailwind-rn";
import {
  Layout,
  TopNav,
  themeColor,
  useTheme} from "react-native-rapi-ui";
import { Context } from "../provider/PlaidProvider";
import {
  create_token_endpoint,
  getTokenData,
  info_endpoint,
  set_access_token,
  storeData} from "../api";
import PlaidLink from "../components/plaid/PlaidLink";
import { BankStackProps } from "../types/navigation";
export default function ({
  navigation,
}: NativeStackScreenProps<BankStackProps, "Bank">) {
  const tailwind = useTailwind();
  const { isDarkmode, setTheme } = useTheme();
  const [tokenLink, setTokenLink] = useState<string | null>(null);
  const [tokenExpiration, setTokenExpiration] = useState<number|null>(null);
  const { dispatch } = useContext(Context);

  interface IToken {
    link_token: string,
    expiration: number
  }

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
    let link_token;
    let expiration;
    getTokenData().then((r) => {
      console.log("done getting token from storage", r);
      link_token=r["link_token"];
      expiration=r["expiration"];
      return r;
    });
    if (link_token && expiration) {
      console.log("[:::::: TOKEN EXISTS ::::: ]");

      setTokenLink(link_token);
      setTokenExpiration(expiration);
      dispatch({ type: "SET_STATE", state: { linkToken: link_token } });
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
        leftContent={
          <Ionicons
            name="refresh"
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        leftAction={()=>navigation.push('Bank')}
        middleContent="Banking"
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
      <PlaidLink
        linkToken={tokenLink}
        // onEvent={(event) => console.log("[EVENT DATA] :::: ",{ event })}
        onExit={(exit: ()=>void) => console.log(":::: DID NOT WORK :::: ", { exit })}
        // onSuccess={(success) => console.log(success.publicToken)}
        onSuccess={async (success: { publicToken: string; }) => {
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
   - cleanup typescript [x]
   - need ability to go back [x]
   - need to set [Bank] as active. [x]
   - cleanup component
 */