import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Input, InputField } from "./ui/input";
import { FlatList, Pressable, Text, View } from "react-native";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import 'react-native-get-random-values';

interface Suggestion {
    name: string;
    place_formatted: string;
    context: {
        place: {
            name: string;
        };
        country: {
            name: string;
        };
        postcode: {
            name: string;
        };
    };
}

export default function MapboxSearchBox({ query, setQuery, setCity, setCountry, setPostalCode }: { query: string, setQuery: Dispatch<SetStateAction<string>>, setCity: Dispatch<SetStateAction<string>>, setCountry: Dispatch<SetStateAction<string>>, setPostalCode: Dispatch<SetStateAction<string>> }) {
    const [results, setResults] = useState<Suggestion[]>([])
    const [isDropdownVisible, setIsDropdownVisible] = useState(false)
    const [sessionToken, setSessionToken] = useState(uuidv4())

    // Reset session token when the input is cleared
    useEffect(() => {
        if (!query) {
            setSessionToken(uuidv4())
        }
    }, [query])

    const handleSearch = async (input: string) => {
        setQuery(input)

        // Only show dropdown for valid queries
        if (input.length < 3) {
            setIsDropdownVisible(false)
            setResults([])
            return
        }

        const MAPBOX_ACCESS_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN
        const SEARCH_BOX_URL = "https://api.mapbox.com/search/searchbox/v1/suggest"

        try {
            const response = await axios.get(SEARCH_BOX_URL, {
                params: {
                    q: input,
                    access_token: MAPBOX_ACCESS_TOKEN,
                    session_token: sessionToken,
                    limit: 4,
                },
            })
            setResults(response.data.suggestions || [])
            setIsDropdownVisible(true)
        } catch (error) {
            console.error("Error fetching Mapbox suggestions:", error)
            setResults([])
            setIsDropdownVisible(false)
        }
    }

    const handleSelect = (location: Suggestion) => {
        setQuery(location.name)
        setCity(location.context.place.name)
        setCountry(location.context.country.name)
        setPostalCode(location.context.postcode.name)
        setIsDropdownVisible(false)
    }

    return (
        <View className="flex">
            <Input className="h-12 px-1 border border-gray-300 rounded-lg justify-center mt-2" variant="outline" size="sm" isDisabled={false} isInvalid={false} isReadOnly={false}>
                <InputField className="flex" placeholder="Enter your address" placeholderTextColor="#9CA3AF" value={query} onChangeText={handleSearch} />
            </Input>
            {isDropdownVisible && (
                <FlatList className="absolute top-16 left-0 right-0 max-h-48 border border-gray-300 rounded-lg bg-white" data={results} renderItem={({ item }) => (
                    <Pressable className="py-1 px-4 border-b border-gray-300 bg-white" onPress={() => handleSelect(item)}>
                        <Text className="text-sm font-semibold">{item.name}</Text>
                        <Text className="text-sm text-left">{item.place_formatted}</Text>
                    </Pressable>
                )}></FlatList>
            )}
        </View>
    )
}