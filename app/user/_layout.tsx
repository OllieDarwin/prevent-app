import { Tabs } from "expo-router"
import "@/global.css";
import { House, Newspaper } from "lucide-react-native";

export default function UserDashboardLayout() {
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
                name="(tabs)/home" 
                options={{
                    title: "Home", 
                    headerShown: false,
                    tabBarIcon: ({ color, focused }) => (
                        <House color={color} size={24} style={focused ? { opacity: 1 } : { opacity: 0.7 }} />
                    )
                }} 
            />
            <Tabs.Screen 
                name="(tabs)/news" 
                options={{
                    title: "News",
                    tabBarIcon: ({ color, focused }) => (
                        <Newspaper color={color} size={24} style={focused ? { opacity: 1 } : { opacity: 0.7 }} />
                    )
                }} 
            />
        </Tabs>
    )
}