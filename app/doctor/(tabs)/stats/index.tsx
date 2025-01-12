import { getConfirmedCases, UserProfile } from "@/firebase/auth";
import axios from "axios";
import { useEffect, useState } from "react";
import { View } from "react-native";
import MapView, { Heatmap } from "react-native-maps";

export default function Statistics() {

    const [cases, setCases] = useState<UserProfile[]>([])
    const [casePositions, setCasePositions] = useState<{ latitude: number, longitude: number, weight: number }[]>([])

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const confirmedCases = await getConfirmedCases()
                setCases(confirmedCases)

                const casePositionPromises = confirmedCases.map(async (user) => {
                    const response = await axios.get("https://api.mapbox.com/search/geocode/v6/forward", {
                        params: {
                            q: `${user.address?.addressLine1}, ${user.address?.city}, ${user.address?.country}, ${user.address?.postalCode}`,
                            access_token: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN
                        }
                    })
                    return {
                        latitude: response.data.features[0].geometry.coordinates[1], 
                        longitude: response.data.features[0].geometry.coordinates[0], 
                        weight: Math.random()*256
                    }
                })

                const newCasePositions = await Promise.all(casePositionPromises)
                setCasePositions(newCasePositions)
                
            } catch (error) {
                console.error("Error fetching cases:", error)
            }
        }

        fetchCases()
    }, [])

    return (
        <View className="flex-1">
            <MapView 
                initialRegion={{
                    latitude: 53.417204118778315, 
                    longitude: -2.9625004425431705,
                    latitudeDelta: 0.16,
                    longitudeDelta: 0.08
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
                {casePositions.length > 0 && (
                    <Heatmap
                        points={casePositions}
                        radius={50}
                    />
                )}
            </MapView>
        </View>
    )
}