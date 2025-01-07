import { View, Text } from "react-native"

export default function InfectionStateDisplay({state}: {state: "healthy" | "suspected" | "confirmed"}) {
    const states = [
        {
            id: "healthy",
            label: "Healthy",
            color: "#bdfcc5"
        },
        {
            id: "suspected",
            label: "Suspected",
            color: "#ecbcf7"
        },
        {
            id: "confirmed",
            label: "Confirmed",
            color: "#f7bcbc"
        }
    ]

    const getStateById = (id: "healthy" | "suspected" | "confirmed") => {
        return states.find(state => state.id === id)
    }

    return (
        <View className="py-2 px-4 rounded-full" style={{ backgroundColor: getStateById(state)?.color }}>
            <Text>{getStateById(state)?.label}</Text>
        </View>
    )
}