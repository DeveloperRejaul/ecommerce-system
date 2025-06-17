import React from 'react';
import { Redirect } from 'expo-router';
import '../../global.css';

export default function index() {
  return <Redirect href="/(tab)/" />;
}
