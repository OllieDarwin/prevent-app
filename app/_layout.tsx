import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

import "../global.css";
import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider";

export default function RootLayout() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/auth/login")
  })

  return (
    <GluestackUIProvider>
      <Stack>
        <Stack.Screen name="auth" options={{ headerShown: false }} />
      </Stack>
    </GluestackUIProvider>
  )
}
