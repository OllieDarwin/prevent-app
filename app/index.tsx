import { View, Text, ImageBackground, Image } from "react-native";
import "@/global.css"
import { Button, ButtonText } from "./components/ui/button";
import { useRouter } from "expo-router";

export default function Home() {
    const router = useRouter()

    return (
        <ImageBackground source={require("../assets/images/hero-bg.jpg")} resizeMode="cover" className="flex-1 flex-col justify-between w-full h-full">
            <View className="flex-1 flex-row justify-center py-16 px-2 h-32">
                <Image source={require("../assets/images/logo-white.png")} resizeMode="contain" className="h-16"></Image>
            </View>
            <View className="p-4 mb-8">
                <Button className="bg-blue-600 rounded-full h-12 items-center justify-center" onPress={() => router.push("/auth/login")}>
                    <ButtonText className="text-white font-semibold">Log In</ButtonText>
                </Button>
                <Button className="bg-gray-400 rounded-full h-12 items-center justify-center mt-2" onPress={() => router.navigate("/auth/signup")}>
                    <ButtonText className="text-white font-semibold">Create an Account</ButtonText>
                </Button>
            </View>
        </ImageBackground>
    )
}