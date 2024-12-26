
import React from 'react';
import { View, ViewProps } from 'react-native';
import { OverlayProvider } from '@gluestack-ui/overlay';
import { ToastProvider } from '@gluestack-ui/toast';

export function GluestackUIProvider({
  ...props
}: {
  children?: React.ReactNode;
  style?: ViewProps['style'];
}) {

  return (
    <View className="flex h-full w-full"
      style={[
        props.style,
      ]}
    >
      <OverlayProvider>
        <ToastProvider>{props.children}</ToastProvider>
      </OverlayProvider>
    </View>
  );
}

