import React, { useState } from "react";
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Image,} from "react-native";
import {
  Layout,
  Text,
  TextInput,
  Button,
  useTheme,
  themeColor,} from "react-native-rapi-ui";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import * as Google from 'expo-auth-session/providers/google';
import Constants from "expo-constants";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import firebase from "firebase/compat";
import OAuthCredential = firebase.auth.OAuthCredential;

import { AuthStackParamList } from "../../types/navigation";
import { info_endpoint, init_endpoint } from "../../api";

export default function ({
  navigation,
}: NativeStackScreenProps<AuthStackParamList, "Login">) {
  const auth = getAuth();
  const { isDarkmode, setTheme } = useTheme();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    {
      clientId: Constants.manifest?.extra?.webClientId,
    },
  );


  React.useEffect(() => {
    if (response?.type === 'success') {
      // console.log(":::: RESPONSE PARAMS FROM G AUTH :::: \n", {response});
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      console.log(":::: HERE IS THE CREDENTIAL :::: \n", {credential});

      signInWithCredential(auth, credential)
        .then((r) => {
          console.log(":::: SUCCESSFUL SIGN IN ::::");

          const creds = GoogleAuthProvider.credentialFromResult(r);
          const token = creds?.accessToken;
          // todo: wip can i send tokens from frontend?
          // connectDrive(credential, r)
          //   .then((r) => {
          //     console.log(":::: THIS IS THE RESPONSE FROM SENDING THE TOKEN ::::: \n", {r});
          //   })
          //   .catch((e) => {
          //     console.log(":::: THIS IS THE ERROR ::::", {e})
          //   });

        })
        .catch((e) => console.log(":::: THERE WAS AN ERROR :::: \n", {e}));
    }
  }, [response]);

  async function loginWithEmail() {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password).catch(function (
      error
    ) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      // ...
      setLoading(false);
      alert(errorMessage);
    });
  }

  async function connectDrive(cred: OAuthCredential, resi: any) {
    let header = new Headers();

    header.set('X-Firebase-Token', JSON.stringify(cred))
    header.set('X-Firebase-Cred', JSON.stringify(resi))

    const response = await fetch(init_endpoint, {
      method: "POST",
      headers: header,
    });

    if (!response.ok){
      console.log(":::: FAILED RESPONSE ::::");
    }

    return response.json();

  }

  return (
    <KeyboardAvoidingView behavior="height" enabled style={{ flex: 1 }}>
      <Layout>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: isDarkmode ? "#17171E" : themeColor.white100,
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                height: 220,
                width: 220,
              }}
              source={require("../../../assets/images/login.png")}
            />
          </View>
          <View
            style={{
              flex: 3,
              paddingHorizontal: 20,
              paddingBottom: 20,
              backgroundColor: isDarkmode ? themeColor.dark : themeColor.white,
            }}
          >
            <Text
              fontWeight="bold"
              style={{
                alignSelf: "center",
                padding: 30,
              }}
              size="h3"
            >
              Login
            </Text>
            <Text>Email</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your email"
              value={email}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              keyboardType="email-address"
              onChangeText={(text) => setEmail(text)}
            />

            <Text style={{ marginTop: 15 }}>Password</Text>
            <TextInput
              containerStyle={{ marginTop: 15 }}
              placeholder="Enter your password"
              value={password}
              autoCapitalize="none"
              autoCompleteType="off"
              autoCorrect={false}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
            />
            <Button
              text={loading ? "Loading" : "Sign In With Email"}
              onPress={async () => {
                // await login();
                await loginWithEmail();
              }}
              style={{
                marginTop: 20,
              }}
              disabled={loading}
            />

            <Button
              text={loading ? "Loading" : "Sign in with Google"}
              onPress={async () => {
                await promptAsync();
              }}
              style={{
                marginTop: 20,
              }}
              disabled={loading}
            />

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 15,
                justifyContent: "center",
              }}
            >
              <Text size="md">Don't have an account?</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Register");
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  Register here
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 10,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("ForgetPassword");
                }}
              >
                <Text size="md" fontWeight="bold">
                  Forget password
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 30,
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  isDarkmode ? setTheme("light") : setTheme("dark");
                }}
              >
                <Text
                  size="md"
                  fontWeight="bold"
                  style={{
                    marginLeft: 5,
                  }}
                >
                  {isDarkmode ? "☀️ light theme" : "🌑 dark theme"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </Layout>
    </KeyboardAvoidingView>
  );
}
