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
import * as WebBrowser from 'expo-web-browser';
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from "firebase/auth";
import { AuthStackParamList } from "../../types/navigation";
import { getFiles, getPdfs, info_endpoint, init_endpoint } from "../../api";

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
      // console.log(":::: HERE IS THE CREDENTIAL :::: \n", {credential});

      signInWithCredential(auth, credential)
        .then(async (r) => {
          console.log(":::: SUCCESSFUL SIGN IN ::::");

          // const response = await fetch(getPdfs, { method: "GET" });

        })
        .catch((e) => console.log(":::: THERE WAS AN ERROR TRYING TO AUTHENTICATE :::: \n", {e}));
    }
  }, [response]);

  async function loginWithEmail() {
    setLoading(true);
    await signInWithEmailAndPassword(auth, email, password)
      .catch(function (error) {
      // Handle Errors here.
      let errorCode = error.code;
      let errorMessage = error.message;
      setLoading(false);
      alert(errorMessage);
    });
  }

  async function authenticateDrive() {
    setLoading(true)
    console.log("INIT ENDPOINT :::: ", init_endpoint);
    let res = await fetch(init_endpoint);
    setLoading(false);
    console.log({res});
    if (res.ok) {
      const data = await res.json();
      //
      await WebBrowser.openBrowserAsync(data);
      // setResult(result);
      // WebBrowser.dismissBrowser()

      // console.log(" :::: AYE BAY BAY :::: ", {data});
      console.log(" :::: Logged into backend Drive API? :::: ");
    }
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
                // await promptAsync();
                authenticateDrive().then(async r =>
                    await promptAsync()
                ).catch((e) => console.log("::: PROBLEM AUTHENTICATING :::", {e}));

              }}
              style={{
                marginTop: 20,
              }}
              disabled={loading || !request}
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
