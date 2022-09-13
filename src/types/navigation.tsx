export type AuthStackParamList = {
	Login: undefined;
	Register: undefined;
	ForgetPassword: undefined;
};

export type MainTabsParamList = {
	SingleProperty: {
		name: string;
	};
  Home: undefined;
  Profile: undefined;
  Reports: undefined;
  PDFViewer: {
		uri: string;
	};
};

export type ReportStackProps = {
	Profile: undefined;
	PDFs: undefined
	PDFViewer: {
		uri: string;
	}
};

export type BankStackProps = {
	Bank: undefined;
	BankInfo: undefined;
}

export interface ErrorDataItem {
	error_type: string;
	error_code: string;
	error_message: string;
	display_message: string | null;
	status_code: number | null;
}
interface BalanceDataItem {
	balance: string;
	subtype: string | null;
	mask: string;
	name: string;
}

export interface TransactionsDataItem {
	amount: string;
	date: string;
	name: string;
}

export type DataItem =
	| BalanceDataItem

export type Data = Array<DataItem>;

export interface Route {
	params: {}
}

export type Prop = {
	route: Route
}

export type file = {
	name: string;
	id: string;
	pdf: string;
	uri: string;
}


