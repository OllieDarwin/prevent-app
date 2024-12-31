import { Tabs } from "expo-router"
import "@/global.css";

export default function UserDashboardLayout() {
    return (
        // <Stack>
        //     <Stack.Screen name="(tabs)/index" options={{headerTitle: "User Dashboard"}} />
        //     <Stack.Screen name="(tabs)/news" options={{headerTitle: "News"}} />
        // </Stack>
        <Tabs>
            <Tabs.Screen name="(tabs)/index" options={{title: "User Dashboard"}} />
            <Tabs.Screen name="(tabs)/news" options={{title: "News"}} />
        </Tabs>
    )
}