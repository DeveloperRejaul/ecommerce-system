import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalizeEachWord(str: string) {
  const arrayOfStr = str.split("_");

  return arrayOfStr
    .map(
      (st) =>
        st.trim().substring(0, 1).toUpperCase() +
        st.trim().substring(1, st.length).toLowerCase()
    )
    .join(" ");
}
