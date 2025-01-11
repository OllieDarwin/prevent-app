import { Button, ButtonText } from "@/app/components/ui/button";
import { Toast, ToastTitle, useToast } from "@/app/components/ui/toast";
import { useAuth } from "@/contexts/AuthContext";
import { fetchUserProfile, updateUserProfile, UserProfile } from "@/firebase/auth";
import { useRouter } from "expo-router";
import { Timestamp } from "firebase/firestore";
import { BadgeCheck, CircleUser, Clock } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function Appointments() {
    const router = useRouter()
    const { currentUser, reloadUser } = useAuth()

    const [appointments, setAppointments] = useState<{ patientId?: string, facilityId?: string, time: Timestamp, endTime: Timestamp }[]>([])
    const [patients, setPatients] = useState<UserProfile[]>([])

    const toast = useToast()
    const [toastId, setToastId] = useState("0")
    
    const handleToast = () => {
        if(!toast.isActive(toastId)) {
            showNewToast()
        }
    }

    const showNewToast = () => {
        const newId = Math.random().toString()
        setToastId(newId)
        toast.show({
            id: newId,
            placement: "bottom",
            duration: 5000,
            render: ({ id }: { id: string }) => {
                const uniqueToastId="toast-" + id
                return (
                    <Toast nativeID={uniqueToastId} action="success" variant="solid" className="bg-[#a2f1c0] rounded-2xl flex-grow flex flex-row gap-2 items-center pr-24 bottom-16">
                        <BadgeCheck color="#3d8659" size={24} />
                        <ToastTitle className="text-[#3d8659]">Appointment successfully completed.</ToastTitle>
                        <View className="flex-grow"></View>
                    </Toast>
                )
            }
        })
    }

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

    const handleCompleteAppoinment = async (appointment: { patientId?: string, facilityId?: string, time: Timestamp, endTime: Timestamp }, i: number) => {
        if (!currentUser || !currentUser.id || !appointment.patientId) return
        const updatedAppointments = appointments.splice(i, i)

        const patient = await fetchUserProfile(appointment.patientId)
        const updatedPatientAppointments = patient?.appointments.filter(appointment => appointment.doctorId !== currentUser.id)
        if (!patient || !patient.id || !updatedPatientAppointments) return

        try {
            await updateUserProfile(currentUser.id, { // Update doctor appointments
                appointments: [
                    ...updatedAppointments
                ]
            })
            await updateUserProfile(patient.id, { // Update patient appointments
                appointments: [
                    ...updatedPatientAppointments
                ]
            })
            await reloadUser()
            handleToast()
        } catch (error) {
            console.error("Error handling complete appointment")
        }
    }

    const navigateToUser = (userId: string) => {
        router.push("/doctor/users")
        setTimeout(() => {
            router.push(`/doctor/users/${userId}`)
        }, 200)
    }

    return (
        <ScrollView className="bg-gray-100 p-4">
            <Text className="font-semibold text-2xl mb-4">Upcoming appointments:</Text>
            {appointments.length === 0 && <Text className="text-lg text-gray-400">No appointments found.</Text>}
            {appointments.map((appointment, i) => {
                return (
                    <View className="p-4 rounded-xl border border-gray-200 bg-white mb-2" key={appointment.patientId}>
                        <TouchableOpacity onPress={() => patients[i].id && navigateToUser(patients[i].id)} className="flex flex-row gap-4 items-center">
                            <CircleUser color="#2563eb" size={36} />
                            <Text className="font-semibold text-lg w-4/5">{patients.length !== 0 ? `${patients[i].firstName} ${patients[i].lastName}` : ""}</Text>
                        </TouchableOpacity>
                        <View className="flex flex-row gap-4 items-center mt-4">
                            <Clock color="#2563eb" size={36} />
                            <Text className="font-semibold text-lg">{appointment.time.toDate().toTimeString().slice(0,5)}</Text>
                        </View>
                        <Button onPress={() => handleCompleteAppoinment(appointment, i)} className="bg-blue-600 mt-4 rounded-2xl h-12 items-center justify-center">
                            <ButtonText className="text-white">Mark as Completed</ButtonText>
                        </Button>
                    </View>
                )
            })}
        </ScrollView>
    )
}