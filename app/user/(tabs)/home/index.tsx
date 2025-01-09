import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import InfectionStateDisplay from "@/app/components/InfectionStateDisplay";
import { useEffect, useState } from "react";
import { getFullName } from "@/firebase/auth";
import { Timestamp } from "firebase/firestore";
import { Button, ButtonText } from "@/app/components/ui/button";

// TODO: ADD LOADING STATE

export default function UserDashboard() {
    const router = useRouter()
    const { currentUser } = useAuth()
    const [infectionState, setInfectionState] = useState<{state: "healthy" | "suspected" | "confirmed", changedBy: string, changedAt: Timestamp, changedByName?: string}>({state: "healthy", changedBy: "", changedAt: Timestamp.fromDate(new Date())})

    useEffect(() => {
        if (!currentUser) return

        const getInfectionState = async () => {
            if(currentUser.infectionState) {
                await setInfectionState(currentUser.infectionState)
                const setterName = await getFullName(currentUser.infectionState.changedBy)
                if (setterName) {
                    setInfectionState({changedByName: setterName, ...currentUser.infectionState})
                }
            }
        }

        getInfectionState()
    }, [currentUser])

    if (!currentUser) return <Text>Error: No user found</Text>

    return (
        <ScrollView className="bg-gray-100 p-4">
            <View className="p-4 bg-white rounded-lg">
                <Text className="font-semibold text-2xl">Welcome back, {currentUser.firstName}!</Text>
                <View className="flex flex-row items-center gap-2">
                    <Text className="text-lg">You are currently rated as:</Text>
                    <InfectionStateDisplay state={infectionState.state} />
                </View>
                <Text className="text-lg">This was changed by <Text className="font-semibold">{infectionState.changedByName}</Text> at <Text className="font-semibold">{infectionState.changedAt.toDate().toLocaleString()}</Text>.</Text>
            </View>
            {infectionState.state === "suspected" && (
                <View className="bg-[#eac9f1] p-4 rounded-lg mt-4">
                    <Text className="font-semibold text-2xl">You are a suspected case.</Text>
                    <Text className="text-lg mt-2">We have decided that you may have contracted an illness that must be urgently treated.</Text>
                    <Text className="text-lg mt-2">We suggest you book an appointment as soon as possible.</Text>
                    <Button className="bg-[#f9ebfc] mt-2" onPress={() => router.push("/user/home/book")}>
                        <ButtonText>Book an appointment</ButtonText>
                    </Button>
                </View>
            )}
        </ScrollView>
    )
}