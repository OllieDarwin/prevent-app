import { facilities } from "@/app/user/(tabs)/home/facilities";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserProfile } from "@/firebase/auth";
import { UserProfile } from "firebase/auth";
import { CircleUser, Clock, Hospital } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";

export default function Appointments() {

    const { currentUser } = useAuth()

    const [appointments, setAppointments] = useState<{}[]>([])
    const [patients, setPatients] = useState<UserProfile[]>([])

    useEffect(() => {
        if (!currentUser) return
        const fetchAppointments = async () => {
            try {
                setAppointments(currentUser.appointments) 

                const profiles = await Promise.all(
                    (currentUser.appointments ?? []).map(async (appointment) => {
                        if (!appointment.patientId) throw new Error("Patient ID couldn't be found")

                        const profile = await fetchUserProfile(appointment.patientId)
                        if (!profile) throw new Error (`Profile for doctor ${appointment.patientId} is undefined. Check the doctor ID is correct.`)
                        
                            return {...profile} as UserProfile
                    })
                )
                setPatients(profiles)
            } catch (error) {
                console.error("Error fetching appointments:", error)
            }
        }

        fetchAppointments()
    }, [currentUser])

    return (
        <ScrollView className="bg-gray-100 p-4">
            <Text className="font-semibold text-2xl mb-4">Upcoming appointments:</Text>
            {currentUser?.appointments.map((appointment, i) => {
                return (
                    <View className="p-4 rounded-xl border border-gray-200 bg-white mb-2" key={appointment.patientId}>
                        <View className="flex flex-row gap-4 items-center">
                            <CircleUser color="#2563eb" size={36} />
                            <Text className="font-semibold text-lg w-4/5">{patients.length !== 0 ? `${patients[i].firstName} ${patients[i].lastName}` : ""}</Text>
                        </View>
                        <View className="flex flex-row gap-4 items-center mt-4">
                            <Clock color="#2563eb" size={36} />
                            <Text className="font-semibold text-lg">{appointment.time.toDate().toTimeString().slice(0,5)}</Text>
                        </View>
                    </View>
                )
            })}
        </ScrollView>
    )
}