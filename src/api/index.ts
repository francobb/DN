import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { AccountsGetResponse, Transaction } from "plaid/dist/api";
import { TransactionsDataItem } from "../types/navigation";
import { formatCurrency } from "../util";
const { manifest } = Constants;

export const url = Constants.manifest?.extra?.hostURL;
const localUrl = `http://${manifest?.debuggerHost?.split(':').shift()}:8000`;

export const init_endpoint = `${url}/api/init`;
export const info_endpoint = `${url}/api/info`;
export const create_token_endpoint = `${url}/api/create_link_token`;
export const transactions_endpoint = `${url}/api/transactions/`;
export const balance_endpoint = `${url}/api/balance/`;
export const set_access_token = `${url}/api/set_access_token`;
export const getFiles = `${url}/api/files`;

export const storeData = async (value: any, key: any) => {
  try {
    const jsonValue = JSON.stringify(value)
    await AsyncStorage.setItem(key, jsonValue)
  } catch (e) {
    console.log("error storing token " + e);
  }
}
 export const getData = async (key: any) => {
   try {
     let value = await AsyncStorage.getItem(key, (error, result) => {})
     return JSON.parse(value as string)
   } catch (e) {
     console.log("error getting data " + e);
   }
 };

export const getTokenData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@link_token')
    let pJson = JSON.parse(jsonValue!)

    if (pJson["link_token"]){
      checkTokenExpiration(pJson["link_token"], pJson["expiration"]);
    }

    return jsonValue != null ? pJson : null;
  } catch(e) {
    console.log("error getting token " + e);
  }
}

const checkTokenExpiration = (linkToken: string, expiration: number) => {
  if (expiration < Date.now() / 1000) {
    AsyncStorage.clear().then((r) => console.log("cleared storage"));
    return { linkToken: "", expiration: "" };
  } else {
    console.log(" [::::: TOKEN IS NOT EXPIRED ::::::] ");
    return { linkToken, expiration };
  }
};

export const transformBalanceData = (data: AccountsGetResponse) => {
  const balanceData = data.accounts;
  return balanceData.map((account) => {
    const balance: number | null | undefined =
      account.balances.available || account.balances.current;
    return balance;
  }).reduce((a, b) => a!+b!);
};
export const transformTransactionsData = (data: {
  latest_transactions: Transaction[];
}): TransactionsDataItem[] => {
  return data.latest_transactions!.map((t) => {
    const item: TransactionsDataItem = {
      name: t.name!,
      amount: formatCurrency(t.amount!, t.iso_currency_code),
      date: t.date,
    };
    return item;
  });
};

