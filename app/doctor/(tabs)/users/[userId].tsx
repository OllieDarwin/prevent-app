import InfectionStateDisplay from "@/app/components/InfectionStateDisplay";
import { useAuth } from "@/contexts/AuthContext";
import { getUserFromId, setInfectionState, User } from "@/firebase/auth";
import { useSearchParams } from "expo-router/build/hooks";
import React from "react";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

export default function UserProfile() {

    // User state & variables
    const searchParams = useSearchParams()
    const userId = searchParams.get("userId")
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    
    const { currentUser } = useAuth()

    // Dropdown state
    const [value, setValue] = useState<"healthy" | "suspected" | "confirmed">("healthy")
    const [isOpen, setIsOpen] = useState(false)

    const dropdownOptions: {id: "healthy" | "suspected" | "confirmed", label: string}[] = [
        {
            id: "healthy",
            label: "Healthy"
        },
        {
            id: "suspected",
            label: "Suspected Case"
        },
        {
            id: "confirmed",
            label: "Confirmed Case"
        }
    ]

    // Handle state selection
    const handleSelect = async (selection: {id: "healthy" | "suspected" | "confirmed"}) => {
        setValue(selection.id)
        setIsOpen(false)
        if (userId && currentUser && currentUser.id) {
            await setInfectionState(userId, currentUser.id, selection.id)
        }
    }

    // Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return

            setLoading(true)
            const userProfile = await getUserFromId(userId)
            if (userProfile) {
                setUser(userProfile)
            }
            setLoading(false)

            // Update default selection value
            if (userProfile.infectionState) {
                setValue(userProfile.infectionState?.state)                
            }
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
            <View className="bg-white w-full py-6 px-4 rounded-lg mt-4">
                <Text className="text-2xl font-bold">Infection State</Text>
                <View className="relative w-full">
                    <TouchableOpacity onPress={() => setIsOpen(!isOpen)}>
                        <View className="px-4 py-2 border border-gray-300 rounded-lg flex flex-row items-center justify-between mt-2 text-sm">
                            <InfectionStateDisplay state={value} />
                            <Text className="ml-[10px]">▼</Text>
                        </View>
                    </TouchableOpacity>
                    {isOpen && (
                        <View className="absolute top-full left-0 w-full border border-gray-300 rounded-lg mt-1 z-[1000] bg-white">
                            {dropdownOptions.map((option) => (
                                <TouchableOpacity onPress={() => handleSelect(option)} key={option.id}>
                                    <View className="p-4">
                                        <Text className="font-medium">{option.label}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    )}
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