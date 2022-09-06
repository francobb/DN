import React from "react";
import { WebView } from "react-native-webview";

import { withHooksHOC } from "../utils/useThemeHOC";
import { NativeStackScreenProps } from "react-native-screens/native-stack";
import { ReportStackProps } from "../../types/navigation";

type Props = NativeStackScreenProps<ReportStackProps, 'PDFViewer'>
class PDFViewer extends React.Component<NativeStackScreenProps<ReportStackProps, 'PDFViewer'>, any> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  render(): React.ReactNode {
    return (
      <WebView
        javaScriptEnabled={true}
        style={{ flex: 1 }}
        originWhitelist={["*"]}
        useWebKit
        source={{ uri: `${this.props.route.params.uri}` }}
      />
    );

  }
}

export default withHooksHOC(PDFViewer);
