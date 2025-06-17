import { ReactNode } from 'react';
import { ActivityIndicator, Text } from 'react-native';

interface IBottomSheetContainer {
  isError: boolean,
  isLoading :boolean,
  children: ReactNode
}

/**
 * A component that renders different content based on loading and error states.
 *
 * @param props - The props for the component.
 * @param props.isLoading - Indicates whether the component is currently loading.
 * @param props.isError - Indicates whether an error has occurred.
 * @param props.children - The content to be rendered when neither loading nor error occurs.
 *
 * @returns - The rendered content based on the loading and error states.
 */
export default function BottomSheetContainer(props:IBottomSheetContainer) {
  const { isLoading, isError, children } = props;

  if (isLoading) return <ActivityIndicator size={40} />;
  if (isError) return <Text> Something went wrong </Text>;
  return children;
}
