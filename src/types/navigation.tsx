export type AuthStackParamList = {
	Login: undefined;
	Register: undefined;
	ForgetPassword: undefined;
};

export type MainTabsParamList = {
	Bank: undefined;
	BankInfo: undefined;
	Category: {
		name: string
	};
	CategoryList: undefined
	Home: undefined;
	Profile: undefined;
	Reports: undefined;
};

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
