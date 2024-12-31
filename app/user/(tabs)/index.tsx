import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

export default function UserDashboard() {
    const router = useRouter()
    const { currentUser } = useAuth()

    if (!currentUser) return <Text>Error: No user found</Text>

    return (
        <View>
            <Text>Hello {currentUser.firstName}! You are a {currentUser.role}.</Text>
        </View>
    )
}