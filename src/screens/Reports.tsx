import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Layout,
  Text,
  themeColor,
  TopNav,
  useTheme,
} from "react-native-rapi-ui";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Ionicons } from "@expo/vector-icons";
import { useTailwind } from "tailwind-rn";

import { MainTabsParamList } from "../types/navigation";
import { months } from "../util";
import { getFiles } from "../api";
import { Context } from "../provider/PlaidProvider";

export default function ({
  navigation,
}: NativeStackScreenProps<MainTabsParamList, "Home">) {
  let tailwind = useTailwind();
  const { isDarkmode, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [files, setFiles] = useState<any[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<any[]>([]);
  const [items, setItems] = useState(months);
  const { dispatch } = useContext(Context);

  const fetchFiles = useCallback(async () => {
    console.log("::: FETCHING FILES :::");
    const response = await fetch(getFiles, { method: "GET" });
    if (!response.ok) {
      console.log("::: ISSUE GETTING FILES ::: \n", { response });
      return;
    }
    const data = await response.json();
    if (data) {
      setFiles(data);
      // console.log("::: Data Returned :::", data[0], data.length);
      console.log(":::: Data Returned :::: \n", data.length);
      dispatch({ type: "SET_STATE", state: { files: data } });
    }
  }, [dispatch]);

  function getFileUri(name: string) {
    return FileSystem.documentDirectory + `${encodeURI(name)}`;
  }

  // async function generatePdf(data, filename) {
  async function generatePdf(pdf: any) {
    const fileUri = getFileUri(pdf.name);
    await FileSystem.writeAsStringAsync(fileUri, pdf.pdf, {
      encoding: FileSystem.EncodingType.Base64,
    });

    let otherFileUri = FileSystem.documentDirectory + "text.txt";
    await FileSystem.writeAsStringAsync(otherFileUri, "Hello World", {
      encoding: FileSystem.EncodingType.UTF8,
    });

    // {
    //   let pdfFile = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 })
    //   console.log("::: THIS IS THE PDF FILE :::", { pdfFile });
    // }

    {
      let dir = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory as string
      );
      console.log("This is what is in the directory ::: \n", { dir });
    }

    await Sharing.shareAsync(fileUri);
  }

  useEffect(() => {
    const init = async () => {
      await fetchFiles();
    };
    init().then((r) => console.log("done fetching files"));
  }, [dispatch, fetchFiles]);

  return (
    <Layout>
      <TopNav
        middleContent="Reports"
        leftContent={
          <Ionicons
            name={isDarkmode ? "grid-outline" : "grid"}
            size={20}
            color={isDarkmode ? themeColor.white100 : themeColor.dark}
          />
        }
        leftAction={() => navigation.navigate("Profile")}
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
      <View>
        <View style={[{ zIndex: 100 }, tailwind("items-center mt-5")]}>
          <View style={tailwind("w-80")}>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              theme={isDarkmode ? "DARK" : "LIGHT"}
              multiple={true}
              mode="BADGE"
              placeholder="Choose A Month"
              onChangeValue={(value) => {
                if (value) {
                  let localFilteredFiles;
                  localFilteredFiles = files.filter((file) => {
                    return (
                      value.indexOf(
                        file.name.substring(0, file.name.indexOf("_"))
                      ) >= 0
                    );
                    // console.log(value.indexOf(file.name.substring(0, file.name.indexOf("_"))));
                  });
                  setFilteredFiles(localFilteredFiles);
                }
              }}
              dropDownContainerStyle={{
                backgroundColor: "#dfdfdf",
                zIndex: 999,
              }}
              // dropDownContainerStyle={tailwind("w-80 text-xl")}
              badgeDotColors={[
                "#e76f51",
                "#00b4d8",
                "#e9c46a",
                "#e76f51",
                "#8ac926",
                "#00b4d8",
                "#e9c46a",
              ]}
            />
          </View>
        </View>
        <View
          style={[
            // tailwind("mt-10"),
            { flexDirection: "row", alignItems: "center", marginTop: 50 },
          ]}
        >
          <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
          <Text style={{ textAlign: "center" }}> Reports </Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
        </View>
        <View style={{ zIndex: 0 }}>
          {filteredFiles.map((file, index) => {
            return (
              <View
                key={index}
                style={tailwind("justify-start rounded-lg p-3 ")}
              >
                <Button
                  title={`${file.name} Report`}
                  onPress={() => {
                    // console.log("Pressed this report", {file})
                    generatePdf(file)
                      .then((res) =>
                        console.log("::: Done generating PDF ::: ", { res })
                      )
                      .catch((e) =>
                        console.log("::: ERROR Generating PDF ::: ", { e })
                      );
                  }}
                />
                {/*<Text style={tailwind("font-semibold text-sm text-center")}>{file.name}</Text>*/}
              </View>
            );
          })}
        </View>
      </View>
    </Layout>
  );
}

/*
TODO:
 1. save pdf buffer to file? [x]
 2. find expo pdf viewer to view buffer pdf []
 3. cleanup component
  - use dispatch
  - fix typescript issues (any)

 */
