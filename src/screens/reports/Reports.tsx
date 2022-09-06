import React, { useCallback, useContext, useEffect, useState } from "react";
import { Button, View } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import {
  Layout,
  Text,
  themeColor,
  TopNav,
  useTheme,} from "react-native-rapi-ui";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import { Section, SectionContent } from 'react-native-rapi-ui';

import { useTailwind } from "tailwind-rn";

import { ReportStackProps } from "../../types/navigation";
import { months } from "../../util";
import { getFiles } from "../../api";
import { Context } from "../../provider/PlaidProvider";
import Card from "../../components/card/Card";

export default function ({
  navigation,
}: NativeStackScreenProps<ReportStackProps, "PDFs">) {
  let tailwind = useTailwind();
  const { isDarkmode, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([]);
  const [files, setFiles] = useState<any[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<any[]>([]);
  const [items, setItems] = useState(months);
  const { dispatch } = useContext(Context);


  const fetchFiles = useCallback(async () => {
    console.log("[:::: FETCHING FILES ::::]");
    const response = await fetch(getFiles, { method: "GET" });
    if (!response.ok) {
      console.log("::: ISSUE GETTING FILES ::: \n", { response });
      return;
    }
    const data = await response.json();
    if (data) {
      setFiles(data);
      // console.log("[:::: DATA RETURNED ::::] \n", data.length);
      dispatch({ type: "SET_STATE", state: { files: data } });
    }
  }, [dispatch]);

  function getFileUri(name: string) {
    return FileSystem.documentDirectory + `${encodeURI(name)}`;
  }
  async function generatePdf(pdf: any) {
    const fileUri = getFileUri(pdf.name);
    pdf.uri = fileUri;
    if (pdf.pdf) {
      await FileSystem.writeAsStringAsync(fileUri, pdf?.pdf, {
        encoding: FileSystem.EncodingType.Base64,
      });
    }

    /**
     *  [ Example of how to write to a text file locally ]
     * {
     *   let otherFileUri = FileSystem.documentDirectory + "text.txt";
     *   await FileSystem.writeAsStringAsync(otherFileUri, "Hello World", {
     *     encoding: FileSystem.EncodingType.UTF8,
     *   });
     * }
     */

    /**
     * [ HOW TO READ THE PDF FILE ]
     * {
     *   let pdfFile = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 })
     *   console.log("::: THIS IS THE PDF FILE :::", { pdfFile });
     * }
     */

    /*
      * **
      *
      * **
      *   {
      *      share functionality (if you have a pdf reader)
      *     await Sharing.shareAsync(fileUri);
      *   }
     */

    // {
    //   let dir = await FileSystem.readDirectoryAsync(
    //     FileSystem.documentDirectory as string
    //   );
    //   console.log("::: This is what is in the directory ::: \n", { dir });
    // }

    return pdf;
  }

  useEffect(() => {
    const init = async () => {
      await fetchFiles();
    };
    init()
      .then((r) => console.log("[:::: DONE FETCHING FILES ::::]"))
      .catch((e) => console.log("::: ERROR FETCHING FILES :::"));
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
          <View style={tailwind("w-80 mt-10")}>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              theme={isDarkmode ? "DARK" : "LIGHT"}
              max={3}
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
          {/*// divider*/}
          {/*{*/}
          {/*  <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />*/}
          {/*  <Text style={{ textAlign: "center" }}> Reports </Text>*/}
          {/*  <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />*/}
          {/*}*/}


        </View>
        <View
          style={[tailwind("mt-5 items-center"), { zIndex: 0 }]}
        >
          {
            filteredFiles.map((file, index) => {
              generatePdf(file)
                .then((res) => {
                    // console.log("::: Done generating PDF ::: \n", { res });
                    // gFile = res;
                    return res;
                  })
                .catch((e) => console.log("::: ERROR Generating PDF ::: \n", { e }));

              let name = months.find( (m) => m.value === file.name.substring(0, 3));
              let year = file.name.substring(4, 8);

              return (
                <View
                  key={index}
                  style={tailwind("rounded-lg p-3 ")}
                >
                  {/*<View style={tailwind("")}>*/}
                  {/*  <Text>Style me</Text>*/}
                  {/*</View>*/}
                  <Card>
                    <Button
                      title={`View ${name?.label} ${year} Report`}
                      onPress={() => {
                        navigation.navigate("PDFViewer", { uri: file.uri })
                      }}
                    />
                  </Card>
                </View>
              );
            })
          }
        </View>
      </View>
    </Layout>
  );
}

/*
TODO:
 1. save pdf buffer to file? [x]
 2. find expo pdf viewer to view buffer pdf [x]
 3. cleanup component
  - use better logging ? (bigger issue)
  - use dispatch
  - fix typescript issues (any)
  - figure out better design ?
  - use tailwind mostly
 */
