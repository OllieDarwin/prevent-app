import { Tabs } from "expo-router";
import "@/global.css";
import { BookUser, CalendarRange, ChartColumn, House } from "lucide-react-native";

export default function DoctorDashboardLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarStyle: {
                    position: "absolute",
                    bottom: 0,
                    paddingBottom: 10,
                    paddingTop: 6,
                },
                animation: "shift"
            }}
        >
            <Tabs.Screen 
                name="(tabs)/index" 
                options={{ 
                    title: "Home", 
                    tabBarIcon: ({ color, focused }) => (
                        <House color={color} size={24} style={focused ? { opacity: 1 } : { opacity: 0.7 }} />
                    )
                }} 
            />
            <Tabs.Screen 
                name="(tabs)/appointments/index" 
                options={{ 
                    title: "Appointments", 
                    tabBarIcon: ({ color, focused }) => (
                        <CalendarRange color={color} size={24} style={focused ? { opacity: 1 } : { opacity: 0.7 }} />
                    )
                }} 
            />
            <Tabs.Screen 
                name="(tabs)/stats/index" 
                options={{ 
                    title: "Statistics", 
                    tabBarIcon: ({ color, focused }) => (
                        <ChartColumn color={color} size={24} style={focused ? { opacity: 1 } : { opacity: 0.7 }} />
                    )
                }} 
            />
            <Tabs.Screen 
                name="(tabs)/users" 
                options={{ 
                    title: "Users", 
                    headerShown: false ,
                    tabBarIcon: ({ color, focused }) => (
                        <BookUser color={color} size={24} style={focused ? { opacity: 1 } : { opacity: 0.7 }} />
                    )
                }}
            />
        </Tabs>
    )
}