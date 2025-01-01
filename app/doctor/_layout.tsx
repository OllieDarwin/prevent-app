import { Tabs } from "expo-router";
import "@/global.css";

export default function DoctorDashboardLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="(tabs)/index" options={{ title: "Doctor Dashboard" }} />
            <Tabs.Screen name="(tabs)/users" options={{ title: "Users", headerShown: false }} />
        </Tabs>
    )
}