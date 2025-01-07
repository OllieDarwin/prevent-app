import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import "@/global.css";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

export default function UserDashboard() {
    const router = useRouter()
    const { currentUser } = useAuth()

    if (!currentUser) return <Text>Error: No user found</Text>

    return (
        <ScrollView className="bg-gray-100 p-4">
            <View className="p-4 bg-white rounded-lg">
                <Text className="font-semibold text-2xl">Welcome back, {currentUser.firstName}!</Text>
                <Text className=" text-lg">Hjifiowivemfv odwckmowco mdwokmvw owkmdcowk dkvok.</Text>
            </View>
            <View className="p-4 bg-white rounded-lg mt-4">
                <Text className="font-semibold text-2xl">Upcoming appointments:</Text>
                {/* SHOW APPOINTMENT BOOKINGS */}
                <TouchableOpacity onPress={() => router.push("/doctor/(tabs)/appointments")}>
                    <Text className="text-blue-600 underline">See more</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}