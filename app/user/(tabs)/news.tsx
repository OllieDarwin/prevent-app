import { Link, LinkText } from "@/app/components/ui/link";
import axios from "axios";
import { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import * as WebBrowser from "expo-web-browser";

const defaultArticles = [
    {
        "source": {
            "id": null,
            "name": "Science Daily"
        },
        "author": null,
        "title": "A new class of antivirals could help prevent future pandemics",
        "description": "Researchers discovered a vulnerability in viral enzymes that could lead to novel treatments for diseases as diverse as COVID-19 and Ebola -- while also minimizing side effects and reducing the odds of drug resistance.",
        "url": "https://www.sciencedaily.com/releases/2024/12/241211124334.htm",
        "urlToImage": "https://www.sciencedaily.com/images/scidaily-icon.png",
        "publishedAt": "2024-12-11T17:43:34Z",
        "content": "The arrival of Paxlovid in December 2021 marked another turning point in the COVID-19 pandemic -- an effective antiviral that has since successfully treated millions. But like many antivirals before … [+4920 chars]"
    },
    {
        "source": {
            "id": null,
            "name": "Science Daily"
        },
        "author": null,
        "title": "CAST mouse model: A crucial tool for future COVID-19 outbreaks",
        "description": "Researchers have identified the first mouse strain that is susceptible to severe COVID-19 without the need for genetic modification. This development marks a pivotal step forward in infectious disease research, providing an essential tool to develop vaccines …",
        "url": "https://www.sciencedaily.com/releases/2024/12/241206162112.htm",
        "urlToImage": "https://www.sciencedaily.com/images/scidaily-icon.png",
        "publishedAt": "2024-12-06T21:21:12Z",
        "content": "Researchers at The Jackson Laboratory and Trudeau Institute have identified the first mouse strain that is susceptible to severe COVID-19 without the need for genetic modification. This development, … [+3939 chars]"
    },
    {
        "source": {
            "id": null,
            "name": "Nakedcapitalism.com"
        },
        "author": "Yves Smith",
        "title": "A Tale of Two Pandemics",
        "description": "A look at two pandemics, HIV and COVID-19, shows how much public health has suffered due to the advance of neoliberalism.",
        "url": "https://www.nakedcapitalism.com/2024/12/a-tale-of-two-pandemics.html",
        "urlToImage": "https://www.nakedcapitalism.com/wp-content/uploads/2024/12/00-pandemics.png",
        "publishedAt": "2024-12-18T11:54:10Z",
        "content": "Yves here. KLG compares the performance of the medical and scientific establishment in two pandemics: HIV and COVID-19. He systematically works his way to the conclusion that a vaccine-dominated appr… [+27367 chars]"
    }
]

export default function NewsTab() {

    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)

    const NEWSAPI_API_KEY = process.env.EXPO_PUBLIC_NEWSAPI_API_KEY
    const NEWSAPI_URL = "https://newsapi.org/v2/everything"

    const handleFetchArticles = async () => {
        try {
            const response = await axios.get(NEWSAPI_URL, {
                params: {
                    q: "Pandemics",
                    pageSize: 10,
                    apiKey: NEWSAPI_API_KEY,
                },
            })
            console.log(response)
            setArticles(response.data.articles || [])
            setLoading(false)
        } catch (error) {
            console.error("Error fetching news data:", error)
            setLoading(false)
            setArticles(defaultArticles)
        }
    }

    const handleOpenArticle = async (url: string) => {
        await WebBrowser.openBrowserAsync(url)
    }

    useEffect(() => {
        handleFetchArticles()
    }, [])

    if (loading) return <View>
        <Text>Loading...</Text>
    </View>

    return (
        <ScrollView className="py-8">
            <Text className="font-bold text-4xl ml-4">News:</Text>
            {articles.map((article: {title: string, description: string, url: string, urlToImage: string}) => (
                <View className="bg-white rounded-lg mt-4 mx-4 p-4">
                    <Text className="font-bold text-2xl">{article.title}</Text>
                    <Text className="font-normal">{article.description}</Text>
                    <Link className="" onPress={() => handleOpenArticle(article.url)}>
                        <LinkText className="text-blue-600">See more</LinkText>
                    </Link>
                </View>
            ))}
        </ScrollView>
    )
}