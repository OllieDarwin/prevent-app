import { Tabs } from "expo-router"
import "@/global.css";

export default function UserDashboardLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="(tabs)/home" options={{title: "Home", headerShown: false}} />
            <Tabs.Screen name="(tabs)/news" options={{title: "News"}} />
        </Tabs>
    )
}