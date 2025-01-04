import { Input, InputField } from "@/app/components/ui/input";
import { Table, TableBody, TableData, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { User, searchForUsers } from "@/firebase/auth";
import { useRouter } from "expo-router";
import { UserProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, ScrollView } from "react-native";

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
        <ScrollView className="p-4 bg-gray-100 w-full min-h-screen">
            <Input className="h-12 px-1 border border-gray-300 rounded-lg justify-center mt-2 bg-white" variant="outline" size="sm" isDisabled={false} isInvalid={false} isReadOnly={false} >
                <InputField className="flex" placeholder="Search for users" placeholderTextColor="#9CA3AF" value={query} onChangeText={setQuery} keyboardType="default" autoCapitalize="none" />
            </Input>
            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                // <FlatList className="rounded-lg mt-4" data={searchResults} keyExtractor={(item) => item.id} renderItem={({ item }: { item: User }) => (
                //     <TouchableOpacity className="bg-white border-b border-gray-200 p-4" onPress={() => router.push(`/doctor/users/${item.id}`)}>
                //         <Text>{item.firstName} {item.lastName}</Text>
                //     </TouchableOpacity>
                // )} />
                <ScrollView horizontal={true}>
                    <Table className="w-full bg-white rounded-lg mt-4 overflow-hidden">
                        <TableHeader>
                            <TableRow className="border-0 bg-blue-700">
                                <TableHead className="w-48 text-white font-medium">Name</TableHead>
                                <TableHead className="w-48 text-white font-medium">Email Address</TableHead>
                                <TableHead className="w-48 text-white font-medium">Phone Number</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-white h-full">
                            {searchResults.map((result, i) => (
                                <TouchableOpacity onPress={() => router.push(`/doctor/users/${result.id}`)}>
                                    <TableRow className={"border-0" + (i%2==0 ? " bg-white" : " bg-gray-50")} key={`${result.firstName}${result.lastName}`}>
                                        <TableData className="w-48">{result.firstName} {result.lastName}</TableData>
                                        <TableData className="w-48">{result.email}</TableData>
                                        <TableData className="w-48">{result.phone}</TableData>
                                    </TableRow>
                                </TouchableOpacity>
                            ))}
                        </TableBody>
                    </Table>
                </ScrollView>
            )}
        </ScrollView>
    )
}