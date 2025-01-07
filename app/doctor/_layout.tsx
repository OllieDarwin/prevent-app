import { Tabs } from "expo-router";
import "@/global.css";

export default function DoctorDashboardLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="(tabs)/index" options={{ title: "Home" }} />
            <Tabs.Screen name="(tabs)/appointments/index" options={{ title: "Appointments" }} />
            <Tabs.Screen name="(tabs)/users" options={{ title: "Users", headerShown: false }} />
        </Tabs>
    )
}