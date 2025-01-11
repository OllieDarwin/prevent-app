import { Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "./components/ui/gluestack-ui-provider";
import { AuthProvider } from "../contexts/AuthContext";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <AuthProvider>
      <GluestackUIProvider>
      <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth/login" options={{ headerShown: true, headerTitle: "Login", headerBackTitle: "Back" }} />
          <Stack.Screen name="auth/signup" options={{ headerShown: true, headerTitle: "Create an Account", headerBackTitle: "Back" }} />
        </Stack>
      </GluestackUIProvider>
    </AuthProvider>
  )
}