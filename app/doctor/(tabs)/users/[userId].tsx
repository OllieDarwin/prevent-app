import { getUserFromId, User } from "@/firebase/auth";
import { useSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { View, Text } from "react-native";

export default function UserProfile() {
    const searchParams = useSearchParams()
    const userId = searchParams.get("userId")
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        console.log(userId)
        const fetchUser = async () => {
            if (!userId) return

            setLoading(true)
            const userProfile = await getUserFromId(userId)
            if (userProfile) {
                setUser(userProfile)
            }
            setLoading(false)
        }

        fetchUser()
    }, [userId])

    if (loading) return <Text>Loading ...</Text>
    if (!user) return <Text>User not found</Text>

    return (
        <View className="p-4">
            <Text>{user.firstName} {user.lastName}</Text>
        </View>
    )
}