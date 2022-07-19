// @ts-nocheck
import React, { useEffect, useContext, useRef } from "react";
import { WebView } from "react-native-webview";
import { Context } from "../../provider/PlaidProvider";
import queryString from "query-string";
import { LinkErrorCode, LinkErrorType, LinkExitMetadataStatus } from "./const";


let parseEvent = (event: { url: string; }) => {
  const eventParams = queryString.parse(event.url.replace(/.*\?/, ""));
  const linkSessionId = eventParams.link_session_id;
  const mfaType = eventParams.mfa_type;
  const requestId = eventParams.request_id;
  const viewName = eventParams.view_name;
  const errorCode = eventParams.error_code;
  const errorMessage = eventParams.error_message;
  const errorType = eventParams.error_type;
  const exitStatus = eventParams.exist_status;
  const institutionId = eventParams.institution_id;
  const institutionName = eventParams.institution_name;
  const institutionSearchQuery = eventParams.institution_search_query;
  const timestamp = eventParams.timestamp;
  return { linkSessionId, mfaType, requestId, viewName,
    errorCode, errorMessage, errorType, exitStatus, institutionId,
    institutionName, institutionSearchQuery, timestamp }
};

const Link = ({ linkToken, onEvent, onExit, onSuccess }) => {
  const {  dispatch } = useContext(Context);
  let webviewRef = useRef() as unknown as WebView<{ source: { uri: string; }; ref: unknown;
     onError: () => any; originWhitelist: string[];
     onShouldStartLoadWithRequest: any; }> | null;

  const handleNavigationStateChange = (event: { url: string; }) => {
    if (event.url.startsWith("plaidlink://")) {
      const {linkSessionId, mfaType, requestId, viewName,
        errorCode, errorMessage, errorType, exitStatus, institutionId,
        institutionName, institutionSearchQuery, timestamp } = parseEvent(event)
      const eventParams = queryString.parse(event.url.replace(/.*\?/, ""));
      if (event.url.startsWith("plaidlink://event") && onEvent) {
        // console.log(":::: [EVENT] ::::");
        onEvent({
          eventName: eventParams.event_name,
          metadata: {
            linkSessionId,
            mfaType,
            requestId,
            viewName,
            errorCode,
            errorMessage,
            errorType,
            exitStatus,
            institutionId,
            institutionName,
            institutionSearchQuery,
            timestamp,
          },
        });
      }
      else if (event.url.startsWith("plaidlink://exit") && onExit) {
        // console.log(":::: [EXIT] ::::");
        dispatch({
          type: "SET_STATE",
          state: {
            itemId: `no item_id retrieved`,
            accessToken: `no access_token retrieved`,
            isItemAccess: false,
          },
        });
        onExit({
          error: {
            errorCode: LinkErrorCode[errorCode],
            errorMessage: eventParams.error_message,
            errorType: LinkErrorType[errorType],
          },
          metadata: {
            status: LinkExitMetadataStatus[exitStatus],
            institution: {
              id: institutionId,
              name: institutionName,
            },
            linkSessionId,
            requestId,
          },
        });
      }
      else if (event.url.startsWith("plaidlink://connected") && onSuccess) {
        console.log("inside handle nav change Success");

        const publicToken = eventParams.public_token;
        const accounts = JSON.parse(eventParams.accounts as string);
        // console.log(":::: [SUCCESS] ::::");
        // const sT = async () => {
        //   const response = await fetch(`https://francois-rentals.loca.lt/api/set_access_token`, {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        //     },
        //     body: `public_token=${public_token}`,
        //   });
        //   if (!response.ok) {
        //     dispatch({
        //       type: "SET_STATE",
        //       state: {
        //         itemId: `no item_id retrieved`,
        //         accessToken: `no access_token retrieved`,
        //         isItemAccess: false,
        //       },
        //     });
        //     return;
        //   }
        //   const data = await response.json();
        //   dispatch({
        //     type: "SET_STATE",
        //     state: {
        //       itemId: data.item_id,
        //       accessToken: data.access_token,
        //       isItemAccess: true,
        //     },
        //   });
        // }

        // dispatch({
        //   type: "SET_STATE",
        //   state: {
        //     itemId: data.item_id,
        //     accessToken: data.access_token,
        //     isItemAccess: true,
        //   },
        // });
        // sT();
        dispatch({ type: "SET_STATE", state: { linkSuccess: true } });
        onSuccess({
          publicToken,
          metadata: {
            institution: {
              id: institutionId,
              name: institutionName,
            },
            accounts,
            linkSessionId,
          },
        });
      }
    }
    return true;
  };

  return (
      <WebView
        source={{
          uri: `https://cdn.plaid.com/link/v2/stable/link.html?isWebview=true&token=${linkToken}`,
        }}
        ref={(ref) => (webviewRef = ref)}
        onError={() => webviewRef?.reload()}
        originWhitelist={["https://*", "plaidlink://*"]}
        onShouldStartLoadWithRequest={handleNavigationStateChange}
      />
  )
};

export { Link };