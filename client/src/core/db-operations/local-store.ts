/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable consistent-return */
export const setItem = async (key:string, data: Record<string, string | number | any>) => {
  try {
    localStorage.setItem(key, JSON.stringify(data || {}));
  } catch (error) {
    console.log(error);
  }
};
export const getItem = async (key:string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.log(error);
  }
};
export const clearItem = async (key:string) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.log(error);
  }
};
