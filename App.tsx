import { StatusBar } from "expo-status-bar";
import React from "react";
import { ThemeProvider } from "react-native-rapi-ui";
import Navigation from "./src/navigation";
import { AuthProvider } from "./src/provider/AuthProvider";
import {TailwindProvider} from 'tailwind-rn';
import utilities from './tailwind.json';
import { PlaidProvider } from "./src/provider/PlaidProvider";
import './src/config/firebase';

export default function App() {
  const images = [
    require("./assets/images/login.png"),
    require("./assets/images/register.png"),
    require("./assets/images/forget.png"),
  ];
  return (
      <ThemeProvider images={images}>
        <AuthProvider>
          <PlaidProvider>
            <TailwindProvider utilities={utilities}>
              <Navigation />
            </TailwindProvider>
          </PlaidProvider>
        </AuthProvider>
        <StatusBar />
      </ThemeProvider>
  );
}
