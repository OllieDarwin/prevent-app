import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth"
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage"

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_API_KEY,
    authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
    projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
    storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
    messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
    appId: process.env.EXPO_PUBLIC_APP_ID,
}

const app = initializeApp(firebaseConfig)
initializeAuth(app, { persistence: getReactNativePersistence(ReactNativeAsyncStorage) })

export const db = getFirestore(app)
export const auth = getAuth(app)