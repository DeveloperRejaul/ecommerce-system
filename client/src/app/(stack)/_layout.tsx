import { Stack } from 'expo-router';
import ErrorBoundary from '@/src/core/components/ErrorBoundary';

export default function layout() {
  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }} />
    </ErrorBoundary>
  );
}
