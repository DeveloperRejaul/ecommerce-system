import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { DB } from '../constants/constants';
import { clearItem, getItem, setItem } from './local-store';

export interface IAuthData {
  token: string;
  avatar: string;
  email:string
  name:string;
  userId:string;
  address: string
  phone:string
}

/**
 * @description  open db and create table if not exists
 * @returns db object
 */

export const openAuthDB = async ():Promise<SQLite.SQLiteDatabase | null> => {
  try {
    const db = await SQLite.openDatabaseAsync(DB.NAME, { useNewConnection: true });
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS ${DB.AUTH_TABLE} (
        id INTEGER PRIMARY KEY NOT NULL,
        token TEXT NOT NULL,
        avatar TEXT NOT NULL,
        email TEXT NOT NULL, 
        name TEXT NOT NULL, 
        address TEXT NOT NULL, 
        phone TEXT NOT NULL, 
        userId TEXT NOT NULL
      );
    `);
    return db;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * @description get all user
 * @returns user
 */
export const getAuthUser = async (): Promise<IAuthData | null> => {
  if (Platform.OS === 'web') {
    const userData = await getItem(DB.AUTH_TABLE);
    if (userData) return userData;
    return null;
  }

  try {
    const db = await openAuthDB();
    if (db) {
      return db.getFirstAsync<IAuthData>(`SELECT * FROM ${DB.AUTH_TABLE}`);
    }
    return null;
    // return db.getAllAsync<IAuthData>(`SELECT * FROM ${DB.AUTH_TABLE}`);
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * @description create user
 * @returns
 */
export const createAuthUser = async (params: IAuthData) => {
  if (Platform.OS === 'web') {
    const item =  await getItem(DB.AUTH_TABLE)
    setItem(DB.AUTH_TABLE, {...item ,...params});
    return;
  }
  try {
    const db = await openAuthDB();
    if (db) {
      const user = await db.getFirstAsync<IAuthData>(`SELECT * FROM ${DB.AUTH_TABLE}`);
      if (user) {
        // need to update user
        const data = { ...user, ...params };
        await db.runAsync(
          `UPDATE ${DB.AUTH_TABLE}
          SET token = ?, avatar = ?, email = ?, name = ?, address = ?, phone = ?
          WHERE userId = ?`,
          data.token,
          data.avatar,
          data.email,
          data.name,
          data.address,
          data.phone,
          data.userId,
        );
      } else {
        await db.runAsync(
          `INSERT INTO ${DB.AUTH_TABLE} (token, avatar, email, name, address,phone, userId) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          params.token,
          params.avatar,
          params.email,
          params.name,
          params.address,
          params.phone,
          params.userId,
        );
      }
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description remove user
 * @returns
 */
export const removeAuthUser = async () => {
  try {
    if (Platform.OS === 'web') {
      clearItem(DB.AUTH_TABLE);
      return;
    }
    const db = await openAuthDB();
    if (db) await db.runAsync(`DELETE FROM ${DB.AUTH_TABLE}`);
  } catch (error) {
    console.log(error);
  }
};
