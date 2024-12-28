import { Stack } from "expo-router"

export default function DoctorDashboardLayout() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{headerTitle: "Doctor Dashboard"}} />
        </Stack>
    )
}