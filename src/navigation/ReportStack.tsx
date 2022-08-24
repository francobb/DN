import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Reports from "../screens/reports/Reports";
import PDFViewer from "../screens/reports/PDFViewer";
import { ReportStackProps } from "../types/navigation"

const ReportStack = createNativeStackNavigator<ReportStackProps>();

const Report = () => {
  return (
    <ReportStack.Navigator>
      <ReportStack.Screen options={{
        headerShown: false
      }} name="PDFs" component={Reports} />
      <ReportStack.Screen name="PDFViewer" component={PDFViewer} />
    </ReportStack.Navigator>
  )
};

export default Report;