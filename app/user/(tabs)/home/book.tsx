import React, { useEffect, useRef, useState } from "react";
import { Text, View, TouchableOpacity, ScrollView } from "react-native";
import MapView, { MapMarker, Marker, MarkerPressEvent } from "react-native-maps";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { Rating } from "react-native-ratings";
import { BadgeCheck, CircleUser, Clock, Earth, Hospital, MapPin, Phone } from "lucide-react-native";
import { Button, ButtonText } from "@/app/components/ui/button";
import { facilities, Facility } from "./facilities";
import { fetchUserProfile, updateUserProfile, UserProfile } from "@/firebase/auth";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { Toast, ToastDescription, ToastTitle, useToast } from "@/app/components/ui/toast";

export default function BookAppointment() {
    const router = useRouter()
    const { currentUser, reloadUser } = useAuth()

    const sheetRef = useRef<BottomSheetMethods>(null)
    const markerRefs = useRef<(MapMarker)[]>([])

    const [currentStep, setCurrentStep] = useState<"hospitalInfo" | "seeDoctors" | "seeAvailability" | "overview">("hospitalInfo")
    const [isBooking, setIsBooking] = useState(false)

    // useEffect(() => {
    //     console.log(currentStep)
    // }, [currentStep])

    const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null)
    const [selectedDoctor, setSelectedDoctor] = useState<UserProfile | null>(null)
    const [selectedTime, setSelectedTime] = useState<Timestamp | null>(null)
    const [selectedEndTime, setSelectedEndTime] = useState<Timestamp | null>(null)

    useEffect(() => { // Update selectedEndTime when selectedTime is updated.
        if (selectedTime) {
            const time = selectedTime.toDate()
            time.setSeconds(selectedTime.toDate().getSeconds()+1800)
            setSelectedEndTime(Timestamp.fromDate(time))
        }
    }, [selectedTime])

    const [doctors, setDoctors] = useState<UserProfile[]>([])


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
                    <Toast nativeID={uniqueToastId} action="success" variant="solid" className="bg-[#a2f1c0] rounded-2xl flex-grow flex flex-row gap-2 items-center pr-32 bottom-16">
                        <BadgeCheck color="#3d8659" size={24} />
                        <ToastTitle className="text-[#3d8659]">Booking successfully created!</ToastTitle>
                        <View className="flex-grow"></View>
                    </Toast>
                )
            }
        })
    }

    const handleBookAppointment = async () => {
        if (isBooking) return
        try {
            if (currentUser && currentUser.id && currentUser.appointments && selectedFacility && selectedDoctor && selectedDoctor.id && selectedTime && selectedEndTime) {
                setIsBooking(true)
                
                const user = await fetchUserProfile(currentUser.id)
                if (!user) return
                await updateUserProfile(currentUser.id, {
                    appointments: [
                        {
                            doctorId: selectedDoctor.id,
                            facilityId: selectedFacility.id,
                            time: selectedTime,
                            endTime: selectedEndTime
                        },
                        ...user.appointments
                    ]
                })

                const doctor = await fetchUserProfile(selectedDoctor.id)
                if (!doctor) return
                await updateUserProfile(selectedDoctor.id, {
                    appointments: [
                        {
                            patientId: currentUser.id,
                            time: selectedTime,
                            endTime: selectedEndTime
                        },
                        ...doctor.appointments
                    ]
                })
            }

            // Confirmation
            await reloadUser() // Reloads currentUser variable so that "You are suspected ..." pop-up is removed.
            handleToast()
            router.back()
        } catch (error) {
            console.error("Error booking appointment:", error)
        }
    }

    const handleFacilitySelect = (facility: Facility | null, e: MarkerPressEvent) => {
        setSelectedFacility(facility)
        if(facility && sheetRef.current) {
            sheetRef.current.expand()
        }

        // Preload doctors and doctor profiles
        const fetchDoctors = async () => {
            try {
                const profiles = await Promise.all(
                    (facility?.doctors ?? []).map(async (doctor) => {
                        const profile = await fetchUserProfile(doctor)
                        if (!profile) {
                            throw new Error (`Profile for doctor ${doctor} is undefined. Check the doctor ID is correct.`)
                        }
                        return {...profile}
                    })
                )
                setDoctors(profiles)
            } catch (error) {
                console.error("Error fetching doctors:", error)
            }
        }

        fetchDoctors()
    }

    const renderHospitalInfo = () => {
        return (
            <>
                {selectedFacility && (
                    <>
                        <Text className="font-bold text-3xl">{selectedFacility.name}</Text>
                        <View className="flex flex-row items-center gap-2 mt-2">
                            <Text>{selectedFacility.rating.toPrecision(2)}</Text>
                            <Rating startingValue={selectedFacility.rating} readonly imageSize={20} />
                        </View>
                        {/* CTA */}
                        <Button onPress={() => setCurrentStep("seeDoctors")} className="bg-blue-600 mt-4 rounded-2xl h-12 items-center justify-center">
                            <ButtonText className="text-white">Book an Appointment</ButtonText>
                        </Button>
                        {/* Overview */}
                        <View className="flex flex-col mt-4 ml-[-4px]">
                            <View className="w-full h-16 flex flex-row items-center gap-4">
                                <MapPin color="#2563eb" size={36} />
                                <Text className="w-2/3 font-semibold">{selectedFacility.address}</Text>
                            </View>
                            <View className="w-full h-16 flex flex-row items-center gap-4">
                                <Earth color="#2563eb" size={36} />
                                <Text className="w-2/3 font-semibold">{selectedFacility.website}</Text>
                            </View>
                            <View className="w-full h-16 flex flex-row items-center gap-4">
                                <Phone color="#2563eb" size={36} />
                                <Text className="w-2/3 font-semibold">{selectedFacility.phone}</Text>
                            </View>
                        </View>
                    </>
                )}
            </>
        )
    }

    const renderDoctors = () => {
        return (
            <>
                <Text className="font-bold text-3xl mb-2">Select a doctor</Text>
                {doctors.length === 0 && <Text className="mt-2 text-lg text-gray-400">No doctors found.</Text>}
                {doctors.map((doctor) => (
                    <TouchableOpacity key={doctor.id} onPress={() => handleDoctorSelect(doctor)}>
                        <View className="bg-white border border-gray-200 p-4 rounded-2xl flex flex-row items-center gap-4 mt-2">
                            <View className="bg-blue-600 w-16 h-16 rounded-full"></View>
                            <Text className="font-semibold text-lg">{doctor.firstName} {doctor.lastName}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </>
        )
    }

    const renderAvailability = () => {
        if(selectedDoctor) {
            return (
                <>
                    <Text className="font-bold text-3xl">Select a time</Text>
                    <Text className="text-lg mb-2">Book an appointment with {selectedDoctor?.firstName} {selectedDoctor?.lastName}</Text>
                    {selectedDoctor.availability?.length === 0 && <Text className="mt-2 text-lg text-gray-400">No available time slots.</Text>}
                    {selectedDoctor.availability?.map((time) => {
                        const endTime = time.toDate()
                        endTime.setSeconds(time.toDate().getSeconds()+1800)

                        return (
                            <TouchableOpacity 
                                key={time.toString()}
                                onPress={async () => {
                                    await setSelectedTime(time)
                                    setCurrentStep("overview")
                                }}
                            >
                                <View className="bg-white border border-gray-200 p-4 rounded-2xl mt-2 flex flex-row items-center gap-4">
                                    <Clock color="#2563eb" size={36} />
                                    <Text className="font-semibold text-lg">{time.toDate().toLocaleTimeString().slice(0,5)}-{endTime.toLocaleTimeString().slice(0,5)}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </>
            )
        } else {
            setCurrentStep("seeDoctors")
        }
    }

    const renderOverview = () => {
        if (selectedTime && selectedFacility && selectedDoctor && selectedEndTime) {
            return (
                <>
                    <Text className="font-bold text-3xl">Confirm your booking</Text>
                    <Text className="text-lg mb-4">Please double check these details</Text>
                    <View className="bg-white border border-gray-200 p-4 rounded-2xl flex flex-row gap-4 items-center">
                         <Hospital color="#2563eb" size={36} />
                         <Text className="font-semibold text-lg">{selectedFacility.name}</Text>
                    </View>
                    <View className="bg-white border border-gray-200 p-4 rounded-2xl flex flex-row gap-4 items-center mt-2">
                         <CircleUser color="#2563eb" size={36} />
                         <Text className="font-semibold text-lg">{selectedDoctor.firstName} {selectedDoctor.lastName}</Text>
                    </View>
                    <View className="bg-white border border-gray-200 p-4 rounded-2xl flex flex-row gap-4 items-center mt-2">
                         <Clock color="#2563eb" size={36} />
                         <Text className="font-semibold text-lg">{selectedTime.toDate().toLocaleTimeString().slice(0,5)}-{selectedEndTime.toDate().toLocaleTimeString().slice(0,5)}</Text>
                    </View>
                    <Button onPress={() => handleBookAppointment()} className="bg-blue-600 mt-4 rounded-2xl h-12 items-center justify-center">
                        <ButtonText className="text-white">Book an Appointment</ButtonText>
                    </Button>
                </>
            )
        } else {
            setCurrentStep("seeAvailability")
            return <></>
        }
    }

    const renderCurrentStep = () => {
        switch (currentStep) {
            case "hospitalInfo":
                return renderHospitalInfo()
            case "seeDoctors":
                return renderDoctors()
            case "seeAvailability":
                return renderAvailability()
            case "overview":
                return renderOverview()
        }
    }

    const handleDoctorSelect = (doctor: UserProfile) => {
        setSelectedDoctor(doctor)
        setCurrentStep("seeAvailability")
    }

    const handleBackPress = () => {
        switch (currentStep) {
            case "hospitalInfo":
                if (selectedFacility) {
                    if (markerRefs.current) {
                        markerRefs.current[facilities.indexOf(selectedFacility)].hideCallout() // Hide marker selection on map
                    }
                    if (sheetRef.current) {
                        sheetRef.current.collapse()
                    }
                    setSelectedFacility(null)
                }
                break
            case "seeDoctors":
                return setCurrentStep("hospitalInfo")
            case "seeAvailability":
                return setCurrentStep("seeDoctors")
            case "overview":
                return setCurrentStep("seeAvailability")
        }
    }

    return (
        <View className="flex-1">
            <MapView
                userInterfaceStyle="light"
                initialRegion={{
                    latitude: 53.417204118778315, 
                    longitude: -2.9625004425431705,
                    latitudeDelta: 0.16,
                    longitudeDelta: 0.08
                }}
                onPress={() => {
                    if (sheetRef.current){
                        sheetRef.current.collapse()
                    }
                    setSelectedFacility(null)
                    setCurrentStep("hospitalInfo")
                }} 
                style={{ 
                    width: "100%", 
                    height: "100%", 
                    position: "absolute", 
                    left: 0, 
                    right: 0, 
                    top: 0, 
                    bottom: 0 
                }}
            >
                {facilities.map((facility, i) => (
                    <Marker 
                        ref={element => {
                            if (element) {
                                markerRefs.current[i] = element
                            }
                        }} // Assign a ref to each marker
                        stopPropagation // Stop marker press from affecting map press (so that you can reset selected facility)
                        onPress={(e) => handleFacilitySelect(facility, e)} 
                        key={facility.id} 
                        title={facility.name} 
                        titleVisibility="hidden" 
                        coordinate={{ latitude: facility.coordinates[0], longitude: facility.coordinates[1] }} />
                ))}
            </MapView>
            <GestureHandlerRootView>
                <BottomSheet ref={sheetRef} snapPoints={[24, 480]}>
                    <BottomSheetView>
                        <ScrollView className="p-4">
                            <TouchableOpacity 
                                onPress={() => handleBackPress()}
                                className="mb-4"
                            >
                                <Text className="text-blue-600">Back</Text>
                            </TouchableOpacity>
                            {renderCurrentStep()}
                        </ScrollView>
                    </BottomSheetView>
                </BottomSheet>
            </GestureHandlerRootView>
        </View>
    )
}