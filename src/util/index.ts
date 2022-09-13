import * as FileSystem from "expo-file-system";
import { file } from "../types/navigation";

export const formatCurrency = (
  number: number | null | undefined,
  code: string | null | undefined
) => {
  if (number != null) {
    return ` ${parseFloat(number.toFixed(2)).toLocaleString("en")} ${code}`;
  }
  return "no data";
};

export function getFileUri(name: string) {
  return FileSystem.documentDirectory + `${encodeURI(name)}`;
}

const sorter = (a: file, b: file) => {
  let monthA =  a.name.substring(0, 3);
  let monthB =  b.name.substring(0, 3);

  let yearA = a.name.substring(4, 8);
  let yearB = b.name.substring(4, 8);

  if (yearA !== yearB) {
    return +yearA - +yearB;
  } else {
   return months.findIndex((item) => item.value === monthA)
     - months.findIndex((item) =>  item.value === monthB)
  };
};

export const months = [
  { label: "January", value: "Jan" },
  { label: "February", value: "Feb" },
  { label: "March", value: "Mar" },
  { label: "April", value: "Apr" },
  { label: "May", value: "May" },
  { label: "June", value: "Jun" },
  { label: "July", value: "Jul" },
  { label: "August", value: "Aug" },
  { label: "September", value: "Sep" },
  { label: "October", value: "Oct" },
  { label: "November", value: "Nov" },
  { label: "December", value: "Dec" },
];
