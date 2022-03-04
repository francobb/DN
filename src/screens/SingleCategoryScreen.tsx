import React from "react";
import { View } from "react-native";
import {
    Layout,
    TopNav,
    Text,
    themeColor,
    useTheme,
  } from "react-native-rapi-ui";
  import { Ionicons } from "@expo/vector-icons";
import { withHooksHOC } from "./utils/useThemeHOC";


type MyProps = {
    // using `interface` is also ok
    message: string;
};

class SingleCategoryScreen extends React.Component<any, any>{
    constructor(props: any) {
        super(props);
        this.state = {
            icon: this.props.isDarkMode
        }
      }

      render(): React.ReactNode {
        if (this.props.route.params.name === "Arcades"){
          return (<Layout>
            <TopNav
              middleContent={`${this.props.route.params.name}`}
              leftContent={
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={this.props.isDarkmode ? themeColor.white100 : themeColor.dark}
                />
              }
              leftAction={() => this.props.navigation.goBack()}
              rightContent={
                <Ionicons
                  name={this.props.icon}
                  size={20}
                  color={this.props.isDarkmode ? themeColor.white100 : themeColor.dark}
                />
              }
              rightAction={() => {
                this.props.isDarkMode ? (this.props.setTheme("light")) : this.props.setTheme("dark");
              }}
            />
            <View
              style={{
                flex: 1,
                alignItems: "center",
                //   justifyContent: "center",
              }}
            >
              <Text fontWeight="bold">Show local for main arcades</Text>
            </View>
          </Layout>)
        } else {
          return (
            <Layout>
              <TopNav
                middleContent={`${this.props.route.params.name}`}
                leftContent={
                  <Ionicons
                    name="chevron-back"
                    size={20}
                    color={this.props.isDarkmode ? themeColor.white100 : themeColor.dark}
                  />
                }
                leftAction={() => this.props.navigation.goBack()}
                rightContent={
                  <Ionicons
                    name={this.props.icon}
                    size={20}
                    color={this.props.isDarkmode ? themeColor.white100 : themeColor.dark}
                  />
                }
                rightAction={() => {
                  this.props.isDarkMode ? (this.props.setTheme("light")) : this.props.setTheme("dark");
                }}
              />
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  //   justifyContent: "center",
                }}
              >
                <Text fontWeight="bold">Show local for main categories</Text>


              </View>
            </Layout>
          );
        }

        }
}

export default withHooksHOC(SingleCategoryScreen);