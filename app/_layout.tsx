import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

import "../global.css";
import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider";
import { SessionProvider } from "./contexts/AuthContext";

export default function RootLayout() {
  return (
    <SessionProvider>
      <GluestackUIProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="user" options={{ headerShown: false }} />
          <Stack.Screen name="doctor" options={{ headerShown: false }} />
        </Stack>
      </GluestackUIProvider>
    </SessionProvider>
  )
}