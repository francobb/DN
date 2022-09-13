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
import { useTailwind } from "tailwind-rn";

import { ReportStackProps } from "../../types/navigation";
import { getFileUri, months } from "../../util";
import { getData, getFiles, storeData } from "../../api";
import { Context } from "../../provider/PlaidProvider";
import Card from "../../components/card/Card";

const current = new Date();
current.setMonth((current.getMonth()-1));
const prevMonth = current.toLocaleString('default', { month: 'long' });
let currentYear = current.getFullYear();

type file = {
  name: string;
  id: string;
  pdf: string;
  uri: string;
}


export default function ({
  navigation,
}: NativeStackScreenProps<ReportStackProps, "PDFs">) {
  let tailwind = useTailwind();
  const { isDarkmode, setTheme } = useTheme();
  const { dispatch } = useContext(Context);
  const [open, setOpen] = useState<boolean>(false); // for dropdown
  const [value, setValue] = useState<string[]>([prevMonth.substring(0,3)]); // for dropdown
  const [items, setItems] = useState(months); // for dropdown
  const [files, setFiles] = useState<file[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<file[]>([]);
  const fetchFiles = useCallback(async () => {
    console.log("[:::: FETCHING FILES ::::]");

    const response = await fetch(getFiles, { method: "GET" });
    if (!response.ok) {
      console.log("::: ISSUE GETTING FILES ::: \n", { response });
      return;
    }

    const data = await response.json();
    if (data) {
      // store to local?

      setFiles(data);
    }
  }, []);

  useEffect(() => setValue([prevMonth.substring(0,3)]), [])
  useEffect(() => {
    if (files.length > 0) {
      filterItems(`${prevMonth.substring(0,3)}`)
    }
  }, [files]);
  useEffect(() => {
    const init = async () => {
      await fetchFiles();
    };
    init()
      .then((r) => {
        console.log("[:::: DONE FETCHING FILES ::::]");
      })
      .catch((e) => console.log("::: ERROR FETCHING FILES :::"));

  }, [fetchFiles]);

  const generatePdf = async (pdf: any) => {
    const fileUri = getFileUri(pdf.name);
    pdf.uri = fileUri;

    let v = await getData(pdf.name);

    if (v) {
      console.log(":::: RETURNING FROM STORAGE :::::", {v});
      return v;
    } else {
      if (!pdf.uri && pdf.pdf) {
        console.log(":::: GENERATING FILE :::::");
        await FileSystem.writeAsStringAsync(fileUri, pdf?.pdf, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }
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

  function filterItems(value: string) {
    let localFilteredFiles
    localFilteredFiles = files.filter((file) => {
      return (
        value.indexOf(file.name.substring(0, file.name.indexOf("_"))) >= 0
      );
    });
    setFilteredFiles(localFilteredFiles);
  }



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
        <View style={[{ zIndex: 100 }, tailwind("items-center")]}>
          <View style={[{marginLeft: 15, marginRight: 15},tailwind("mt-10")]}>
          <Text style={{marginBottom: 10}}>Months</Text>
            <DropDownPicker
              open={open}
              value={value}
              items={items}
              setOpen={setOpen}
              setValue={setValue}
              setItems={setItems}
              theme={isDarkmode ? "DARK" : "LIGHT"}
              max={4}
              multiple={true}
              mode="BADGE"
              placeholder="Choose A Month"
              onChangeValue={(value) => {
                if (value) {
                  let localFilteredFiles;
                  localFilteredFiles = files.filter((file) => {
                    return (
                      value.indexOf(file.name.substring(0, file.name.indexOf("_"))) >= 0
                    );
                  });
                  setFilteredFiles(localFilteredFiles);
                }
              }}
              dropDownContainerStyle={{
                backgroundColor: "#dfdfdf",
                zIndex: 999,
              }}
              containerStyle={{}}
              badgeDotColors={[
                "#00b4d8",
                "#e9c46a",
                "#e76f51",
                "#8ac926",
              ]}
            />
          </View>
        </View>
        <View style={[
            // tailwind("mt-10"),
            { flexDirection: "row", alignItems: "center", marginTop: 50 },
          ]}>
          <Text style={{marginLeft: 15, marginRight:15}}>Reports</Text>
        </View>
        <View style={[tailwind(""), { marginHorizontal: 5 }]}>
          {
            filteredFiles.length
              ? filteredFiles.sort((a,b) =>
              (a.name.substring(4, 8) < b.name.substring(4, 8)) ? 1 : -1).map((file, index) => {
              let name = months.find( (m) => m.value === file.name.substring(0, 3));
              let year = file.name.substring(4, 8);


                if (!file.uri) {
                  generatePdf(file)
                    .then((res) => {
                      console.log("::: DONE GENERATING PDF ::: \n", {res});
                      return res;
                    })
                    .catch((e) => console.log("::: ERROR GENERATING PDF ::: \n", { e }));
                }


              // check local storage first ... or context ?

              return (
                <View
                  key={index}
                  style={tailwind("rounded-lg p-3 ")}
                >
                  <Card style={tailwind("w-full")}>
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
              : <View style={[tailwind("mt-5"), { marginHorizontal: 6 }]}><Text> Choose a month and see the Reports</Text></View>
          }
        </View>
      </View>
    </Layout>
  );
}

/*
TODO:
 3. cleanup component
  - use better logging ? (bigger issue)
  - use dispatch
  - fix typescript issues (any)
  - figure out better design ?
  - use tailwind mostly
 1. save pdf buffer to file? [x]
 2. find expo pdf viewer to view buffer pdf [x]
 */
