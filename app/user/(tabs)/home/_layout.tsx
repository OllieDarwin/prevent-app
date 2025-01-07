import { Stack } from "expo-router";

export default function UserHomeLayout() {
    return <Stack>
        <Stack.Screen name="index" options={{ title: "Home" }} />
        <Stack.Screen name="book" options={{ title: "Book an appointment" }} />
    </Stack>
}