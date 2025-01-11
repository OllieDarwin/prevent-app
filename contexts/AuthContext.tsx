import { onAuthStateChanged, User } from "firebase/auth";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase-config";
import { fetchUserProfile, UserProfile } from "../firebase/auth";

export interface ExtendedUser extends User, UserProfile {}

interface AuthContextType {
    currentUser: ExtendedUser | null
    userLoggedIn: boolean
    isLoading: boolean
    reloadUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be wrapped inside a <AuthProvider />")
    }
    return context
}

export function AuthProvider({children}: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<ExtendedUser | null>(null)
    const [userLoggedIn, setUserLoggedIn] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, initializeUser)
            return unsubscribe
    }, [])

    async function initializeUser(user: ExtendedUser | null) {
        if (user) {
            const profile = await fetchUserProfile(user.uid)
            setCurrentUser({ ...user, ...profile })
            setUserLoggedIn(true)
        } else {
            setCurrentUser(null)
            setUserLoggedIn(false)
        }
        setIsLoading(false)
    }

    // Function to reload the current user
    async function reloadUser() {
        if (auth.currentUser) {
            try {
                await auth.currentUser.reload();
                const updatedUser = auth.currentUser;
                if (updatedUser) {
                    const profile = await fetchUserProfile(updatedUser.uid);
                    setCurrentUser({ ...updatedUser, ...profile });
                }
            } catch (error) {
                console.error("Failed to reload user:", error);
            }
        }
    }

    return (
        <AuthContext.Provider value={{currentUser, userLoggedIn, isLoading, reloadUser}}>
         {!isLoading && children}
        </AuthContext.Provider>
    )
}