import { Input, InputField } from "@/app/components/ui/input";
import { User, searchForUsers } from "@/firebase/auth";
import { useRouter } from "expo-router";
import { UserProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity } from "react-native";

export default function UserMangement() {
    const router = useRouter()

    const [query, setQuery] = useState("")
    const [searchResults, setSearchResults] = useState<User[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true)
            const users = await searchForUsers(query)
            setSearchResults(users)
            setLoading(false)
        }

        fetchUsers()
    }, [query])

    return (
        <View className="p-4">
            <Text>User Management Page</Text>
            <Input className="h-12 px-1 border border-gray-300 rounded-lg justify-center mt-2" variant="outline" size="sm" isDisabled={false} isInvalid={false} isReadOnly={false} >
                <InputField className="flex" placeholder="Search for users" placeholderTextColor="#9CA3AF" value={query} onChangeText={setQuery} keyboardType="default" autoCapitalize="none" />
            </Input>
            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <FlatList className="rounded-lg" data={searchResults} keyExtractor={(item) => item.id} renderItem={({ item }: { item: User }) => (
                    <TouchableOpacity className="bg-white border-b border-gray-800 p-4" onPress={() => router.push(`/doctor/users/${item.id}`)}>
                        <Text>{item.firstName} {item.lastName}</Text>
                    </TouchableOpacity>
                )} />
            )}
        </View>
    )
}