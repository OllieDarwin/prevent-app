import { getUserFromId, User } from "@/firebase/auth";
import { useSearchParams } from "expo-router/build/hooks";
import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";

export default function UserProfile() {
    const searchParams = useSearchParams()
    const userId = searchParams.get("userId")
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
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
        <ScrollView className="p-4 bg-gray-100">
            <View className="bg-white w-full py-6 px-4 rounded-lg flex flex-row gap-4 items-center">
                <View className="bg-gray-200 w-16 h-16 rounded-full"></View>
                <View>
                    <Text className="text-2xl font-semibold">{user.firstName} {user.lastName}</Text>
                    <Text className="text-gray-700 text-lg">{user.email}</Text>
                    <Text className="text-gray-700 text-lg">{user.phone}</Text>
                    <Text className="text-gray-700 text-lg">{user.dateOfBirth}</Text>
                </View>
            </View>
            <View className="bg-white w-full py-6 px-4 rounded-lg flex flex-row gap-4 items-center mt-4">
                <View>
                    <Text className="text-2xl font-bold">Address</Text>
                    <View className="mt-2">
                        <Text className="text-gray-700 text-base">{user.address?.addressLine1}</Text>
                        { user.address?.addressLine2 !== "" && <Text className="text-gray-700 text-base">{user.address?.addressLine2}</Text> }
                        <Text className="text-gray-700 text-base">{user.address?.city}</Text>
                        <Text className="text-gray-700 text-base">{user.address?.country}</Text>
                        <Text className="text-gray-700 text-base">{user.address?.postalCode}</Text>
                    </View>
                </View>
            </View>
            <View className="bg-white w-full py-6 px-4 rounded-lg mt-4">
                <Text className="text-2xl font-bold">Emergency Contact</Text>
                <View className="mt-2">
                    <Text className="text-gray-700 text-base">{user.emergencyContact?.name}</Text>
                    <Text className="text-gray-700 text-base">{user.emergencyContact?.phone}</Text>
                    <Text className="text-gray-700 text-base">{user.emergencyContact?.relationship}</Text>
                </View>
            </View>
        </ScrollView>
    )
}