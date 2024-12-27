import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Input, InputField } from "../components/ui/input";
import { Button, ButtonText } from "../components/ui/button";
import { Link, LinkText } from "../components/ui/link";
import { useRouter } from "expo-router";
import React from "react";
import MapboxSearchBox from "../components/MapboxSearchBox";

type SignUpStep = "basic" | "personal" | "address" | "emergency"

// TODO: ADD PASSWORD VALIDATION

export default function SignUp() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState<SignUpStep>("basic")

    // Basic Information
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    // Personal Details
    const [dateOfBirth, setDateOfBirth] = useState("")
    const [phone, setPhone] = useState("")
    const [role, setRole] = useState<"user" | "doctor">("user")

    // Address Details
    const [addressLine1, setAddressLine1] = useState("")
    const [addressLine2, setAddressLine2] = useState("")
    const [city, setCity] = useState("")
    const [country, setCountry] = useState("")
    const [postalCode, setPostalCode] = useState("")

    // Emergency Contact
    const [emergencyName, setEmergencyName] = useState("")
    const [emergencyRelation, setEmergencyRelation] = useState("")
    const [emergencyPhone, setEmergencyPhone] = useState("")

    const renderBasicInfo = () => (
        <>
            <View className="w-full">
                <Text className="text-center text-gray-900 text-3xl font-bold">Create an Account.</Text>
                <Text className="text-center text-gray-500 mt-2">It's free and only takes a minute.</Text>
            </View>
            <View className="mt-4">
                <View>
                    <Text className="text-gray-700">First Name</Text>
                    <Input className="h-12 px-1 border border-gray-300 rounded-lg justify-center mt-2" variant="outline" size="sm" isDisabled={false} isInvalid={false} isReadOnly={false} >
                        <InputField className="flex" placeholder="Enter your first name" placeholderTextColor="#9CA3AF" value={firstName} onChangeText={setFirstName} keyboardType="default" autoCapitalize="none" />
                    </Input>
                </View>
                <View className="mt-4">
                    <Text className="text-gray-700">Last Name</Text>
                    <Input className="h-12 px-1 border border-gray-300 rounded-lg justify-center mt-2" variant="outline" size="sm" isDisabled={false} isInvalid={false} isReadOnly={false} >
                        <InputField className="flex" placeholder="Enter your last name" placeholderTextColor="#9CA3AF" value={lastName} onChangeText={setLastName} keyboardType="default" autoCapitalize="none" />
                    </Input>
                </View>
                <View className="mt-4">
                    <Text className="text-gray-700">Email</Text>
                    <Input className="h-12 px-1 border border-gray-300 rounded-lg justify-center mt-2" variant="outline" size="sm" isDisabled={false} isInvalid={false} isReadOnly={false} >
                        <InputField className="flex" placeholder="Enter your email" placeholderTextColor="#9CA3AF" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                    </Input>
                </View>
                <View className="mt-4">
                    <Text className="text-gray-700">Password</Text>
                    <Input className="h-12 px-1 border border-gray-300 rounded-lg justify-center mt-2" variant="outline" size="sm" isDisabled={false} isInvalid={false} isReadOnly={false} >
                        <InputField className="flex" placeholder="Enter a password" placeholderTextColor="#9CA3AF" value={password} onChangeText={setPassword} secureTextEntry />
                    </Input>
                </View>
            </View>
        </>
    )

    const renderPersonalDetails = () => (
        <>
            <View className="w-full">
                <Text className="text-center text-gray-900 text-3xl font-bold">Personal Details</Text>
                <Text className="text-center text-gray-500 mt-2">Tell us a bit more about yourself</Text>
            </View>
            <View className="mt-4">
                <View>
                    <Text className="text-gray-700">Date of Birth</Text>
                    <Input className="h-12 px-1 border border-gray-300 rounded-lg justify-center mt-2" variant="outline" size="sm" isDisabled={false} isInvalid={false} isReadOnly={false} >
                        <InputField className="flex" placeholder="DD/MM/YYYY" placeholderTextColor="#9CA3AF" value={dateOfBirth} onChangeText={setDateOfBirth} keyboardType="numbers-and-punctuation" autoCapitalize="none" />
                    </Input>
                </View>
                <View className="mt-4">
                    <Text className="text-gray-700">Phone Number</Text>
                    <Input className="h-12 px-1 border border-gray-300 rounded-lg justify-center mt-2" variant="outline" size="sm" isDisabled={false} isInvalid={false} isReadOnly={false} >
                        <InputField className="flex" placeholder="Enter your phone number" placeholderTextColor="#9CA3AF" value={phone} onChangeText={setPhone} keyboardType="number-pad" autoCapitalize="none" />
                    </Input>
                </View>
            </View>
        </>
    )

    const addressInfo = () => (
        <>
            <View className="w-full">
                <Text className="text-center text-gray-900 text-3xl font-bold">Address Information</Text>
                <Text className="text-center text-gray-500 mt-2">Please enter your address in the first box and select it in the drop-down menu.</Text>
            </View>
            <View className="mt-4">
                <View className="z-[1000]">
                    <Text className="text-gray-700">Address</Text>
                    <MapboxSearchBox query={addressLine1} setQuery={setAddressLine1} setCity={setCity} setCountry={setCountry} setPostalCode={setPostalCode} />
                </View>
                <View className="mt-4 z-0">
                    <Text className="text-gray-700">Apartment, suite, etc. (optional)</Text>
                    <Input className="h-12 px-1 border border-gray-300 rounded-lg justify-center mt-2" variant="outline" size="sm" isDisabled={false} isInvalid={false} isReadOnly={false} >
                        <InputField className="flex" placeholder="Enter your apartment number, suite, etc. (optional)" placeholderTextColor="#9CA3AF" value={addressLine2} onChangeText={setAddressLine2} keyboardType="default" autoCapitalize="none" />
                    </Input>
                </View>
                <View className="mt-4 z-0">
                    <Text className="text-gray-700">City</Text>
                    <Input className="h-12 px-1 border border-gray-300 rounded-lg justify-center mt-2" variant="outline" size="sm" isDisabled={false} isInvalid={false} isReadOnly={false} >
                        <InputField className="flex" placeholder="Enter your city" placeholderTextColor="#9CA3AF" value={city} onChangeText={setCity} keyboardType="default" autoCapitalize="none" />
                    </Input>
                </View>
                <View className="mt-4 z-0">
                    <Text className="text-gray-700">Country</Text>
                    <Input className="h-12 px-1 border border-gray-300 rounded-lg justify-center mt-2" variant="outline" size="sm" isDisabled={false} isInvalid={false} isReadOnly={false} >
                        <InputField className="flex" placeholder="Enter your country" placeholderTextColor="#9CA3AF" value={country} onChangeText={setCountry} keyboardType="default" autoCapitalize="none" />
                    </Input>
                </View>
                <View className="mt-4 z-0">
                    <Text className="text-gray-700">Postcode</Text>
                    <Input className="h-12 px-1 border border-gray-300 rounded-lg justify-center mt-2" variant="outline" size="sm" isDisabled={false} isInvalid={false} isReadOnly={false} >
                        <InputField className="flex" placeholder="Enter your postal code" placeholderTextColor="#9CA3AF" value={postalCode} onChangeText={setPostalCode} keyboardType="default" autoCapitalize="none" />
                    </Input>
                </View>
            </View>
        </>
    )

    const emergencyDetails = () => (
        <>
            <View className="w-full">
                <Text className="text-center text-gray-900 text-3xl font-bold">Emergency Contact</Text>
                <Text className="text-center text-gray-500 mt-2">Please enter the details of your preferred emergency contact</Text>
            </View>
            <View className="mt-4">
                <View>
                    <Text className="text-gray-700">Name</Text>
                    <Input className="h-12 px-1 border border-gray-300 rounded-lg justify-center mt-2" variant="outline" size="sm" isDisabled={false} isInvalid={false} isReadOnly={false} >
                        <InputField className="flex" placeholder="Enter emergency contact name" placeholderTextColor="#9CA3AF" value={emergencyName} onChangeText={setEmergencyName} keyboardType="default" autoCapitalize="none" />
                    </Input>
                </View>
                <View className="mt-4">
                    <Text className="text-gray-700">Relation</Text>
                    <Input className="h-12 px-1 border border-gray-300 rounded-lg justify-center mt-2" variant="outline" size="sm" isDisabled={false} isInvalid={false} isReadOnly={false} >
                        <InputField className="flex" placeholder="Enter emergency contact relation" placeholderTextColor="#9CA3AF" value={emergencyRelation} onChangeText={setEmergencyRelation} keyboardType="default" autoCapitalize="none" />
                    </Input>
                </View>
                <View className="mt-4">
                    <Text className="text-gray-700">Phone</Text>
                    <Input className="h-12 px-1 border border-gray-300 rounded-lg justify-center mt-2" variant="outline" size="sm" isDisabled={false} isInvalid={false} isReadOnly={false} >
                        <InputField className="flex" placeholder="Enter emergency contact phone number" placeholderTextColor="#9CA3AF" value={emergencyPhone} onChangeText={setEmergencyPhone} keyboardType="number-pad" autoCapitalize="none" />
                    </Input>
                </View>
            </View>
        </>
    )

    const handleNext = () => {
        switch (currentStep) {
            case 'basic':
                setCurrentStep('personal');
                break;
            case 'personal':
                setCurrentStep('address');
                break;
            case 'address':
                setCurrentStep('emergency');
                break;
            case 'emergency':
                // TODO: DO SIGNUP
                break;
        }
    };

    const handleBack = () => {
        switch (currentStep) {
            case 'personal':
                setCurrentStep('basic');
                break;
            case 'address':
                setCurrentStep('personal');
                break;
            case 'emergency':
                setCurrentStep('address');
                break;
            default:
                router.back();
                break;
        }
    }; 

    const renderCurrentStep = () => {
        switch (currentStep) {
            case "basic":
                return renderBasicInfo()
            case "personal":
                return renderPersonalDetails()
            case "address":
                return addressInfo()
            case "emergency":
                return emergencyDetails()
        }
    }

    const isNextDisabled = () => {
        switch (currentStep) {
            case "basic":
                return !firstName || !lastName || !email || !password
            case "personal":
                return !dateOfBirth || !phone
            case "address":
                return !addressLine1 || !city || !country || !postalCode
            case "emergency":
                return !emergencyName || !emergencyRelation || !emergencyPhone
            default:
                return false
        }
    } 

    return (
        <ScrollView className="flex bg-white">
            <View className="min-h-screen justify-center p-6">
                <View className="w-full mx-auto">
                    {renderCurrentStep()}
                    {/* CONTINUE BUTTON */}
                    <Button className={"bg-blue-600 rounded-full h-12 items-center justify-center mt-8 " + (isNextDisabled() && " bg-gray-300")} onPress={() => handleNext()} disabled={isNextDisabled()}>
                        <ButtonText className={"text-white font-semibold text-sm " + (isNextDisabled() && " text-gray-500")}>{currentStep != "emergency" ? "Continue" : "Sign Up"}</ButtonText>
                    </Button>
                    {/* Alrady have an account? / Back */}
                    <Link className="h-12 items-center justify-center mt-4" onPress={() => handleBack()}>
                        {currentStep == "basic" ? <>
                            <Text className="text-gray-900 text-sm">Already have an account? <LinkText className="text-sm text-blue-600">Log in</LinkText></Text>
                        </> : <>
                            <LinkText className="text-sm text-blue-600 no-underline">Back</LinkText>
                        </>}
                    </Link>
                    {/* RENDER CURRENT STEP */}
                </View>
            </View>
        </ScrollView>
    )
}