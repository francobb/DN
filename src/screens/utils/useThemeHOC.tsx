import React from 'react';
import { useTheme } from 'react-native-rapi-ui';

export const withHooksHOC = (Component: any) => {
  return (props: any) => {
    const { isDarkmode, setTheme } = useTheme();

    let icon = isDarkmode ? "sunny": "moon";

    return <Component isDarkMode={isDarkmode} setTheme={setTheme} icon={icon} {...props} />;
  };
};