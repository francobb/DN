import React, { createContext, useReducer, Dispatch, ReactNode } from "react";
import { url } from "../api";
import { TransactionsDataItem } from "../types/navigation";

interface PlaidState {
  url: string;
  transactions: TransactionsDataItem[];
  balance: number | null;
  publicToken: string;
  linkSuccess: boolean;
  isItemAccess: boolean;
  linkToken: string | null;
  accessToken: string | null;
  itemId: string | null;
  isError: boolean;
  backend: boolean;
  expiration: number|null;
  products: string[];
  linkTokenError: {
    error_message: string;
    error_code: string;
    error_type: string;
  };
}

const initialState: PlaidState = {
  url,
  transactions: [],
  balance: null,
  publicToken: "",
  linkSuccess: false,
  isItemAccess: true,
  linkToken: "", // Don't set to null or error message will show up briefly when site loads
  accessToken: null,
  itemId: null,
  isError: false,
  backend: true,
  expiration: null,
  products: ["transactions"],
  linkTokenError: {
    error_type: "",
    error_code: "",
    error_message: "",
  },
};

type PlaidAction = {
  type: "SET_STATE";
  state: Partial<PlaidState>;
};

interface PlaidContext extends PlaidState {
  dispatch: Dispatch<PlaidAction>;
}

const Context = createContext<PlaidContext>(
  initialState as PlaidContext
);

const { Provider } = Context;

export const PlaidProvider: React.FC<{ children: ReactNode }> = (
  props
) => {
  const reducer = (
    state: PlaidState,
    action: PlaidAction
  ): PlaidState => {
    switch (action.type) {
      case "SET_STATE":
        return { ...state, ...action.state };
      default:
        return { ...state };
    }
  };
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Provider value={{...state, dispatch}}>{props.children}</Provider>
};

export { Context, PlaidContext, PlaidState}