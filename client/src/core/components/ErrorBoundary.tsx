import React, { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import Button from '../meter/components/Button';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    console.log(error);

    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log(error, errorInfo);
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return (
        <View className="flex justify-center items-center flex-1 gap-y-3">
          <Text className="text-2xl font-bold"> Something went wrong </Text>
          <View>
            <Text className="text-gray-700 text-center"> We cannot process your request at the moment. </Text>
            <Text className="text-gray-700 text-center"> Please, try again later </Text>
          </View>
          <Button text="Go To Home" onPress={() => router.replace('/(tab)')} />
        </View>
      );
    }

    return children;
  }
}
