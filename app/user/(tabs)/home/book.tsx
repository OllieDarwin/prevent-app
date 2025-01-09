import React from "react";
import { Text, View, StyleSheet } from "react-native";
import MapView, { Marker } from "react-native-maps";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function BookAppointment() {
    return (
        <View className="flex-1">
            <MapView style={{ width: "100%", height: "100%", position: "absolute", left: 0, right: 0, top: 0, bottom: 0 }}>
                <Marker title="Hospital" onPress={() => console.log("Marker selected")} coordinate={{ latitude: 53.40181251339209, longitude: -2.967002940087232 }} />
            </MapView>
            <GestureHandlerRootView>
                <BottomSheet snapPoints={[24, 480]}>
                    <BottomSheetView>
                        <Text className="font-bold text-2xl p-4">Hello world.</Text>
                    </BottomSheetView>
                </BottomSheet>
            </GestureHandlerRootView>
        </View>
    )
}