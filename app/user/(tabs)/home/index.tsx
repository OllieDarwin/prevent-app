import { View, Text, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import InfectionStateDisplay from "@/app/components/InfectionStateDisplay";
import { useEffect, useState } from "react";
import { fetchUserProfile, getFullName, UserProfile } from "@/firebase/auth";
import { Timestamp } from "firebase/firestore";
import { Button, ButtonText } from "@/app/components/ui/button";
import { Alert, AlertIcon, AlertText } from "@/app/components/ui/alert";
import { BadgeCheck, CircleUser, Clock, Hospital, X } from "lucide-react-native";
import React from "react";
import { Toast, ToastDescription, ToastTitle, useToast } from "@/app/components/ui/toast";
import { facilities } from "./facilities";

// TODO: ADD LOADING STATE

export default function UserDashboard() {
    const router = useRouter()
    const { currentUser } = useAuth()
    
    const [infectionState, setInfectionState] = useState<{state: "healthy" | "suspected" | "confirmed", changedBy: string, changedAt: Timestamp, changedByName?: string}>({state: "healthy", changedBy: "", changedAt: Timestamp.fromDate(new Date())})
    const [doctors, setDoctors] = useState<UserProfile[]>([])

    useEffect(() => {
        console.log(doctors)
    }, [doctors])

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

        const fetchDoctorProfiles = async () => {
            try {
                const profiles = await Promise.all(
                    (currentUser.appointments ?? []).map(async (appointment) => {
                        if (!appointment.doctorId) throw new Error("Doctor ID couldn't be found")

                        const profile = await fetchUserProfile(appointment.doctorId)
                        if (!profile) throw new Error (`Profile for doctor ${appointment.doctorId} is undefined. Check the doctor ID is correct.`)
                       
                            return {...profile} as UserProfile
                    })
                )
                setDoctors(profiles)
            } catch (error) {
                console.error("Error fetching user profiles")
            }
        }

        getInfectionState()
        fetchDoctorProfiles()
    }, [currentUser])

    useEffect(() => {
        
    }, [currentUser])

    if (!currentUser) return <Text>Error: No user found</Text>

    return (
        <>
            <ScrollView className="bg-gray-100 p-4 min-h-full">
                <View className="p-4 bg-white rounded-lg">
                    <Text className="font-semibold text-2xl">Welcome back, {currentUser.firstName}!</Text>
                    <View className="flex flex-row items-center gap-2">
                        <Text className="text-lg">You are currently rated as:</Text>
                        <InfectionStateDisplay state={infectionState.state} />
                    </View>
                    <Text className="text-lg">This was changed by <Text className="font-semibold">{infectionState.changedByName}</Text> at <Text className="font-semibold">{infectionState.changedAt.toDate().toLocaleString()}</Text>.</Text>
                </View>
                {infectionState.state === "suspected" && (currentUser.appointments?.length === 0 ? (
                    <View className="bg-[#eac9f1] p-4 rounded-lg mt-4">
                        <Text className="font-semibold text-2xl">You are a suspected case.</Text>
                        <Text className="text-lg mt-2">We have decided that you may have contracted an illness that must be urgently treated.</Text>
                        <Text className="text-lg mt-2">We suggest you book an appointment as soon as possible.</Text>
                        <Button className="bg-[#f9ebfc] mt-2" onPress={() => router.push("/user/home/book")}>
                            <ButtonText>Book an appointment</ButtonText>
                        </Button>
                    </View>
                ) : (
                    // See appointments
                    <View className="bg-white p-4 rounded-lg mt-4"> 
                        <Text className="font-semibold text-2xl mb-4">Upcoming appointments:</Text>
                        {currentUser.appointments?.map((appointment, i) => {
                            const facility = facilities.find(facility => facility.id === appointment.facilityId)

                            return (
                                <View className="p-4 rounded-xl border border-gray-200" key={appointment.doctorId}>
                                    <View className="flex flex-row gap-4 items-center">
                                        <Hospital color="#2563eb" size={36} />
                                        <Text className="font-semibold text-lg w-4/5">{facility?.name}</Text>
                                    </View>
                                    <View className="flex flex-row gap-4 items-center mt-4">
                                        <CircleUser color="#2563eb" size={36} />
                                        <Text className="font-semibold text-lg w-4/5">{doctors.length !== 0 ? `${doctors[i].firstName} ${doctors[i].lastName}` : ""}</Text>
                                    </View>
                                    <View className="flex flex-row gap-4 items-center mt-4">
                                        <Clock color="#2563eb" size={36} />
                                        <Text className="font-semibold text-lg">{appointment.time.toDate().toTimeString().slice(0,5)}</Text>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                ))}
            </ScrollView>
        </>
    )
}