import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import { DB } from '../constants/constants';
import { ICardData } from '@/types';
import { animatedToast } from '../components/AnimatedToast';
import { color } from '../constants/color';
import { clearItem, getItem, setItem } from './local-store';

/**
 * @description  open db and create table if not exists
 * @returns db object
 */

export const openAuthDB = async ():Promise<SQLite.SQLiteDatabase | null> => {
  try {
    const db = await SQLite.openDatabaseAsync(DB.CARD, { useNewConnection: true });
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS ${DB.CARD} (
        id INTEGER PRIMARY KEY NOT NULL,
        cardId TEXT NOT NULL
      );
    `);
    return db;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/**
 * @description add cardId
 * @returns
 */

export const addCard = async (cardId:string) => {
  try {
    if (Platform.OS === 'web') {
      const cardData = await getItem(DB.CARD);
      if (cardData) {
        const exists = cardData.some((c) => c.cardId === cardId);
        if (exists) {
          animatedToast.show({ bgColor: color.success, title: 'Product is already added', message: 'Product added successfully please checkout' });
          return true;
        }
        setItem(DB.CARD, [...cardData, { cardId }]);
        return true;
      }
      setItem(DB.CARD, [{ cardId }]);
      return true;
    }
    const db = await openAuthDB();
    if (db) {
      const card = await getCardId();
      if (card) {
        const exists = card.some((c) => c.cardId === cardId);
        if (exists) {
          animatedToast.show({ bgColor: color.success, title: 'Product is already added', message: 'Product added successfully please checkout' });
          return true;
        }
      }

      await db.runAsync(`INSERT INTO ${DB.CARD} (cardId) VALUES (?)`, cardId);
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * @description remove cardId
 * @returns
 */

export const removeCard = async (cardId:string) => {
  try {
    if (Platform.OS === 'web') {
      const cardData = await getItem(DB.CARD);
      if (cardData) {
        const newCardData = cardData.filter((c) => c.cardId !== cardId);
        setItem(DB.CARD, newCardData);
        return true;
      }
      return true;
    }
    const db = await openAuthDB();
    if (db) {
      await db.runAsync(`DELETE FROM ${DB.CARD} WHERE cardId =?`, cardId);
      // animatedToast.show({ message: 'Deleted cart successfully', title: 'Cart deleted', bgColor: color.success });
      return true;
    }
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

/**
 * @description get cardId
 * @returns
 */

export const getCardId = async () => {
  try {
    if (Platform.OS === 'web') {
      return getItem(DB.CARD);
    }
    const db = await openAuthDB();
    if (db) {
      return db.getAllAsync<ICardData>(`SELECT * FROM ${DB.CARD}`);
    }
    return null;
  } catch (error) {
    console.log(error);
    return null;
  }
};
