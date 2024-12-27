import { View, Text } from "react-native";
import "../../global.css"
import { useRouter } from "expo-router";
import { useSession } from "../contexts/AuthContext";

export default function UserDashboard() {
    const router = useRouter()
    const { currentUser } = useSession()

    if (!currentUser) return <Text>Error: No user found</Text>

    return (
        <View>
            <Text>USER: Hello {currentUser.firstName}! You are a {currentUser.role}.</Text>
        </View>
    )
}