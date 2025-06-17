/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { DB } from '../constants/constants';
import { getItem, setItem } from './local-store';

export interface IHistoryBD {
    id:number
    value: string;
    date: number
}

const openDb = async () => {
  try {
    const db = await SQLite.openDatabaseAsync(DB.NAME, { useNewConnection: true });
    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS ${DB.HISTORY_TABLE} (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, date INTEGER);
   `);
    return db;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getHistory = async () => {
  try {
    if (Platform.OS === 'web') {
      const data = await getItem(DB.HISTORY_TABLE);
      return data || [];
    }
    const db = await openDb();
    if (db) {
      return db.getAllAsync<IHistoryBD>(`SELECT * FROM ${DB.HISTORY_TABLE}`);
    }
    return [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const createHistory = async (data:string) => {
  const now = Date.now();
  const expirationTime = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  const expiredValues = new Set<string>();
  let dataExists = false;

  try {
    if (Platform.OS === 'web') {
      const allData = await getItem(DB.HISTORY_TABLE);

      if (allData) {
        for (const element of allData) {
          if (element.date + expirationTime < now) {
            expiredValues.add(element.value);
          }
          if (element.value.trim() === data.trim()) {
            dataExists = true;
            break; // Exit early if data is found
          }
        }
        // Bulk delete expired entries if any
        if (expiredValues.size > 0) {
          const placeholders = Array.from(expiredValues);
          const newData = allData.filter((e) => !placeholders.includes(e.value));
          setItem(DB.HISTORY_TABLE, newData);
          return;
        }
      }

      // Insert new entry if data doesn't already exist
      if (!dataExists) {
        if (allData) {
          setItem(DB.HISTORY_TABLE, [{ data: now, value: data.trim() }, ...allData]);
          return;
        }
        setItem(DB.HISTORY_TABLE, [{ data: now, value: data.trim() }]);
      }
      return;
    }
    const db = await openDb();
    if (!db) return;

    // Single pass to collect expired values and check if data already exists
    const allData = await getHistory();
    for (const element of allData) {
      if (element.date + expirationTime < now) {
        expiredValues.add(element.value);
      }
      if (element.value.trim() === data.trim()) {
        dataExists = true;
        break; // Exit early if data is found
      }
    }

    // Bulk delete expired entries if any
    if (expiredValues.size > 0) {
      const placeholders = Array.from(expiredValues).map(() => '?').join(', ');
      await db.runAsync(`DELETE FROM ${DB.HISTORY_TABLE} WHERE value IN (${placeholders})`, [...expiredValues]);
    }

    // Insert new entry if data doesn't already exist
    if (!dataExists) {
      await db.runAsync(`INSERT INTO ${DB.HISTORY_TABLE} (value, date) VALUES (?, ?)`, data.trim(), now);
    }
  } catch (error) {
    console.log(error);
  }
};
