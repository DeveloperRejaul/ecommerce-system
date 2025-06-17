import { useContext } from 'react';
import { Context } from '../provider/MainProvider';

export const useMain = () => useContext(Context);
