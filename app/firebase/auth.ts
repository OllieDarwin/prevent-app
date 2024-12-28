import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";

export interface UserProfile {
    firstName?: string;
    lastName?: string;
    dateOfBirth?: string;
    phone?: string;
    role?: "user" | "doctor";
    address?: {
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        country?: string;
        postalCode?: string;
    };
    emergencyContact?: {
        name?: string;
        phone?: string;
        relationship?: string;
    };
}

/**
 * Create user
 * @param email Desired email
 * @param password Desired password
 * @returns the user's new credential
 */
export const doCreateUserWithEmailAndPassword = async (userData: Partial<UserProfile>, role: "user" | "doctor", email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const userId = userCredential.user.uid

        // Save the user/doctor in the relevant collection
        const collectionName = role === "doctor" ? "doctors" : "users"
        // Collate data
        await setDoc(doc(db, collectionName, userId), {
            email,
            createdAt: new Date(),
            ...userData,
        })

        console.log(`${role} account created successfully!`)
        return userCredential
    } catch (error) {
        console.error("Error creating account:", error)
        return null
    }
}

/**
 * Sign in
 * @returns Result
 */
export const doSignInWithEmailAndPassword = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Get a user's profile by ID
 * @param userID ID of the desired user
 * @returns Their user profile
 */
export const fetchUserProfile = async (userId: string | null) => {
    if (userId === null) {
        return null
    }
    try {
        const userDocRef = doc(db, "users", userId)
        const userSnapshot = await getDoc(userDocRef)

        const doctorDocRef = doc(db, "doctors", userId)
        const doctorSnapshot = await getDoc(doctorDocRef)

        if (userSnapshot.exists()) {
            return userSnapshot.data()
        } else if (doctorSnapshot.exists()) {
            return doctorSnapshot.data()
        } else {
            console.error("No user data found!")
            return null
        }
    } catch (error) {
            console.error("Error fetching user profile:", error)
            return null
    }
}

export const getUserRole = async (userId: string | null) => {
    if (userId === null) {
        return null
    }
    try {
        const userDoc = await getDoc(doc(db, "users", userId))
        if (userDoc.exists()) return "user"

        const doctorDoc = await getDoc(doc(db, "doctors", userId))
        if (doctorDoc.exists()) return "doctor"

        throw new Error("User not found.")
    } catch (error) {
        console.error("Error fetching user role:", error)
        return null
    }
}