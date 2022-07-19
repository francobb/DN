import React, { useCallback, useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { AccountsGetResponse, Transaction } from "plaid/dist/api";
import { useTailwind } from "tailwind-rn";
import { Context } from "../../provider/PlaidProvider";
import { TransactionsDataItem } from "../../types/navigation";
import { balance_endpoint, transactions_endpoint, transformBalanceData, transformTransactionsData } from "../../api";
import { formatCurrency } from "../../util";

const ShowBalance = () => {
  const tailwind = useTailwind();
  const { dispatch, transactions, balance } = useContext(Context);

  const getBalance = useCallback(async () => {
    console.log("[:::::: GETTING BALANCE ::::: ]");
    const response = await fetch(balance_endpoint, {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    });
    // setIsLoading(true);
    const data = await response.json();
    if (data.error != null) {
      let e = data.error
      console.log("[:::::: ERROR GETTING BALANCE ::::: ]", {e});
      // setError(data.error);
      // setIsLoading(false);
      return;
    }

    let b = transformBalanceData(data);
    dispatch({ type: "SET_STATE", state: { balance: b } });
  }, [dispatch]);
  const getTransactions = useCallback(async () => {
    const response = await fetch(transactions_endpoint, {
      method: "GET",
      headers: {
        accept: "*/*",
      },
    });
    // setIsLoading(true);
    console.log("[:::::: GETTING TRANSACTIONS ::::: ]")
    const data = await response.json();
    if (data.error != null) {
      console.log("[:::::: ERROR GETTING TRANSACTIONS ::::: ]");
      // setError(data.error);
      // setIsLoading(false);
      return;
    }
    let items = transformTransactionsData(
      data as { latest_transactions: Transaction[] }
    );
    dispatch({
      type: "SET_STATE",
      state: {
        itemId: data.item_id,
        accessToken: data.access_token,
        isItemAccess: true,
        transactions: items,
      },
    });
  }, [dispatch]);

  useEffect(() => {
    const getInfo = async () => {
      await getBalance();
      await getTransactions();
    };
    getInfo().then((r) => console.log("[:::::: DONE GETTING BALANCE & TRANSACTIONS ::::: ]"));
  }, [dispatch, getBalance, getTransactions]);

  return (
    <View style={[]}>
      <Text style={tailwind("text-lg text-center")}>Available Balance:</Text>
      <Text style={tailwind("text-3xl text-center")}>${balance}</Text>
      <View style={tailwind("mt-5 items-center")}>
        <Text style={tailwind("text-lg text-center")}>Recent Transactions</Text>
        {transactions &&
          transactions.map((t, i) => (
            <View
              key={i}
              style={[tailwind("w-80 flex flex-row justify-between mt-5")]}
            >
              <View style={tailwind("")}>
                <Text style={tailwind("")}>[ {t.name.substring(0, 15)} ]</Text>
              </View>
              <View style={tailwind("")}>
                <Text style={tailwind("")}>{-parseInt(t.amount)}</Text>
              </View>
            </View>
          ))}
      </View>
    </View>
  );
};
export { ShowBalance }