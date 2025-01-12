import { useRouter } from "expo-router";
import { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { Button, ButtonText } from "../components/ui/button";
import { Link, LinkText } from "../components/ui/link";
import { Input, InputField } from "../components/ui/input";
import { doSignInWithEmailAndPassword, getUserRole } from "../../firebase/auth";

// TODO: Add user authentication and redirect to relevant dashboard

export default function Login() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = async () => {
        const userCredential = await doSignInWithEmailAndPassword(email, password)
        const role = await getUserRole(userCredential.user.uid)
        if (role === "user") {
            router.replace("/user/home")
        } else {
            router.replace("/doctor")
        }
    }

    return (
        <ScrollView className="bg-gray-100 p-4 h-full">
            <View className="flex justify-center items-center min-h-full">
                <View className="bg-white w-full px-4 py-16 rounded-lg">
                    <View className="w-full">
                        <Text className="text-center text-gray-900 text-3xl font-bold">Welcome Back!</Text>
                        <Text className="text-center text-gray-500 mt-2">Sign in to access your account.</Text>
                    </View>
                    <View className="mt-8 w-full px-8">
                        <View>
                            <Text className="text-gray-700">Email</Text>
                            <Input className="h-12 px-1 border border-gray-300 rounded-lg justify-center mt-2" variant="outline" size="sm" isDisabled={false} isInvalid={false} isReadOnly={false} >
                                <InputField className="flex" placeholder="Enter your email" placeholderTextColor="#9CA3AF" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                            </Input>
                        </View>
                        <View className="mt-4">
                            <Text className="text-gray-700">Password</Text>
                            <Input className="h-12 px-1 border border-gray-300 rounded-lg justify-center mt-2" variant="outline" size="sm" isDisabled={false} isInvalid={false} isReadOnly={false} >
                                <InputField className="flex" placeholder="Enter your password" placeholderTextColor="#9CA3AF" value={password} onChangeText={setPassword} secureTextEntry />
                            </Input>
                        </View>
                        <Button className="bg-blue-600 rounded-full h-12 items-center justify-center mt-8" onPress={() => handleLogin()}>
                            <ButtonText className="text-white font-semibold text-sm">Sign In</ButtonText>
                        </Button>
                    </View>
                    <Link className="h-12 items-center justify-center mt-4" onPress={() => router.replace("/auth/signup")}>
                        <Text className="text-gray-900 text-sm">Don't have an account? <LinkText className="text-sm text-blue-600">Sign up</LinkText></Text>
                    </Link>
                </View>
            </View>
        </ScrollView>
    )
}
