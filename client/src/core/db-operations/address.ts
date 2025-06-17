/* eslint-disable consistent-return */
import * as SQLite from 'expo-sqlite';
import type{ IAddress } from '@types';
import { Platform } from 'react-native';
import { DB } from '../constants/constants';
import { animatedAlert } from '../components/AnimatedAlert';
import { getItem, setItem } from './local-store';
import { animatedToast } from '../components/AnimatedToast';

/**
 * @description  open db and create table if not exists
 * @returns db object
 */
export const openAddressDB = async () => {
  const db = await SQLite.openDatabaseAsync(DB.NAME, { useNewConnection: true });
  await db.execAsync(`
          PRAGMA journal_mode = WAL;
          CREATE TABLE IF NOT EXISTS ${DB.ADDRESS_TABLE} (
            id INTEGER PRIMARY KEY NOT NULL,
            name TEXT NOT NULL,
            address TEXT NOT NULL, 
            town TEXT NOT NULL, 
            district TEXT NOT NULL, 
            state TEXT NOT NULL, 
            code TEXT NOT NULL,
            phone TEXT NOT NULL,
            type TEXT NOT NULL,
            isDefault BOOLEAN DEFAULT 0
          );
        `);
  return db;
};

/**
 * @description create address
 * @returns boolean
 */
export const createAddress = async (params: IAddress) => {
  try {
    if (Platform.OS === 'web') {
      params.id = `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const data = await getItem(DB.ADDRESS_TABLE);
      if (data) {
        if (data.length >= 2) {
          animatedAlert.show({ message: 'You have already create 2 address. max limit 2' });
          return false;
        }

        const isAvailable = data.some((k) => k.type === params.type);
        if (isAvailable) {
          animatedAlert.show({ message: `You have already create address for ${params.type}, You can update this address` });
          return false;
        }

        if (params.isDefault) {
          const defaultAddress = data.find((k) => k.isDefault);
          if (defaultAddress) {
            const prev = { ...defaultAddress, isDefault: false };
            setItem(DB.ADDRESS_TABLE, [prev, params]);
            return;
          }
        }
        setItem(DB.ADDRESS_TABLE, [...data, params]);
      }
      setItem(DB.ADDRESS_TABLE, [params]);
      animatedToast.show({ message: 'Address saved successfully', title: 'Save Address' });
      return;
    }

    const db = await openAddressDB();
    const address = await getAddresses();
    // checking type already exists
    const isAvailable = address.some((k) => k.type === params.type);
    if (isAvailable) {
      animatedAlert.show({ message: `You have already create address for ${params.type}, You can update this address` });
      return false;
    }

    // checking default address already exists
    if (params.isDefault) {
      const defaultAddress = address.find((k) => k.isDefault);
      if (defaultAddress) {
        await db.runAsync(
          `UPDATE ${DB.ADDRESS_TABLE}
            SET name = ?, address = ?, town = ?, district = ?, state = ?, code = ?, phone = ?, type = ?,isDefault = ?
            WHERE id = ?`,
          defaultAddress.name,
          defaultAddress.address,
          defaultAddress.town,
          defaultAddress.district,
          defaultAddress.state,
          defaultAddress.code,
          defaultAddress.phone,
          defaultAddress.type,
          0, // update isDefault false with 0
          defaultAddress.id as number,
        );
      }
    }

    // finally create address
    await db.runAsync(
      `INSERT INTO ${DB.ADDRESS_TABLE} (name, address, town, district, state, code, phone, type,isDefault) VALUES (?,?,?,?,?,?,?,?,?)`,
      params.name,
      params.address,
      params.town,
      params.district,
      params.state,
      params.code,
      params.phone,
      params.type,
      params.isDefault ? 1 : 0,
    );
    return true;
  } catch (error) {
    console.log(error);
    animatedAlert.show({ message: 'Something went wrong' });
    return false;
  }
};

/**
 * @description get address
 * @returns
 */
export const getAddresses = async () => {
  if (Platform.OS === 'web') {
    const data = await getItem(DB.ADDRESS_TABLE);
    if (data) {
      if (Array.isArray(data)) {
        return data;
      }
      return [data];
    }
    return;
  }
  const db = await openAddressDB();
  const data = await db.getAllAsync<Omit<IAddress, 'isDefault'> & {isDefault: number}>(`SELECT * FROM ${DB.ADDRESS_TABLE}`);
  return data.map((address) => ({ ...address, isDefault: address.isDefault !== 0 }));
};

/**
 * @description remove address with type
 * @returns
 */
export const removeAddress = async (type:IAddress['type']) => {
  try {
    const ans = await new Promise((resolve) => {
      animatedAlert.show({ message: 'Are you sure to remove this address' }, resolve);
    });

    if (Platform.OS === 'web') {
      const data = await getItem(DB.ADDRESS_TABLE);
      const newData = (data || []).filter((d) => d?.type !== type);
      setItem(DB.ADDRESS_TABLE, newData);
      animatedToast.show({ message: 'Address remove successfully', title: 'Remove Address' });
      return;
    }
    const db = await openAddressDB();
    if (ans === 'ok') {
      await db.runAsync(`DELETE FROM ${DB.ADDRESS_TABLE} WHERE type = $type`, { $type: type });
      return true;
    }
    return false;
  } catch (error) {
    animatedAlert.show({ message: 'Something went wrong' });
    console.log(error);
    return false;
  }
};

/**
 * @description update address with type
 * @returns
 */
export const updateAddress = async (data: IAddress, id:number) => {
  try {
    // checking default address already exists

    if (Platform.OS === 'web') {
      return;
    }
    const db = await openAddressDB();
    const address = await getAddresses();
    const defaultAddress = address.find((k) => k.isDefault);
    if (defaultAddress) {
      await db.runAsync(
        `UPDATE ${DB.ADDRESS_TABLE}
          SET name = ?, address = ?, town = ?, district = ?, state = ?, code = ?, phone = ?, type = ?,isDefault = ?
          WHERE id = ?`,
        defaultAddress.name,
        defaultAddress.address,
        defaultAddress.town,
        defaultAddress.district,
        defaultAddress.state,
        defaultAddress.code,
        defaultAddress.phone,
        defaultAddress.type,
        0, // update isDefault false with 0
        defaultAddress.id as number,
      );
    }

    // final operation
    await db.runAsync(
      `UPDATE ${DB.ADDRESS_TABLE}
        SET name = ?, address = ?, town = ?, district = ?, state = ?, code = ?, phone = ?, type = ?,isDefault = ?
        WHERE id = ?`,
      data.name,
      data.address,
      data.town,
      data.district,
      data.state,
      data.code,
      data.phone,
      data.type,
      data.isDefault ? 1 : 0,
      id,
    );
    return true;
  } catch (error) {
    animatedAlert.show({ message: 'Something went wrong' });
    console.log(error);
    return false;
  }
};
