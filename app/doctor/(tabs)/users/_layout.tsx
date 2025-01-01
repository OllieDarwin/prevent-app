import { Stack } from "expo-router";

export default function UserSelectionLayout() {
    return <Stack>
        <Stack.Screen name="index" options={{ title: "Users" }} />
        <Stack.Screen name="[userId]" options={{ title: "User Profile" }} />
    </Stack>
}