import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase-config";
import { collection, doc, getDoc, setDoc, query, orderBy, startAt, endAt, getDocs, updateDoc, Timestamp, where } from "firebase/firestore";

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
    id?: string;
    infectionState?: {
        state: "healthy" | "suspected" | "confirmed";
        changedBy: string;
        changedAt: Timestamp;
    };
    availability?: Timestamp[];
    appointments: {
        patientId?: string;
        doctorId?: string;
        facilityId?: string;
        time: Timestamp;
        endTime: Timestamp;
    }[]
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
            id: userCredential.user.uid,
            createdAt: new Date(),
            ...userData,
        })

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
            return userSnapshot.data() as UserProfile
        } else if (doctorSnapshot.exists()) {
            return doctorSnapshot.data() as UserProfile
        } else {
            console.error("No user data found!")
            return null
        }
    } catch (error) {
            console.error("Error fetching user profile:", error)
            return null
    }
}

export const updateUserProfile = async (userId: string, data: Partial<User>) => {
    try {
        const userDocRef = doc(db, "users", userId)
        const userSnapshot = await getDoc(userDocRef)

        const doctorDocRef = doc(db, "doctors", userId)
        const doctorSnapshot = await getDoc(doctorDocRef)

        if (userSnapshot.exists()) {
            await updateDoc(userDocRef, data)
        } else if (doctorSnapshot.exists()) {
            await updateDoc(doctorDocRef, data)
        } else {
            console.error("Profile wan't found.")
        }
    } catch (error) {
        console.error("Error updating user profile:", error)
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

export interface User extends UserProfile {
    id: string;
}

export const searchForUsers = async (input: string) => {
    try {
        const firstNameQuery = query(collection(db, "users"), orderBy("firstName"), startAt(input), endAt(input + "\uf8ff"))
        const lastNameQuery = query(collection(db, "users"), orderBy("lastName"), startAt(input), endAt(input + "\uf8ff"))

        const [firstNameSnapshot, lastNameSnapshot] = await Promise.all([
            await getDocs(firstNameQuery),
            await getDocs(lastNameQuery)
        ])

        const resultsMap = new Map<string, User>()
        firstNameSnapshot.forEach((doc) => {
            resultsMap.set(doc.id, {
                id: doc.id,
                ...(doc.data() as UserProfile)
            })
        })
        lastNameSnapshot.forEach((doc) => {
            resultsMap.set(doc.id, {
                id: doc.id,
                ...(doc.data() as UserProfile)
            })
        })

        return [...resultsMap.values()]
    } catch (error) {
        console.error("Error fetching users:", error)
        return []
    }
}

// export const getUserFromId = async (userId: string) => {
//     try {
//         const userDoc = doc(db, "users", userId)
//         const userSnapshot = await getDoc(userDoc)
//         if (userSnapshot.exists()) {
//             return userSnapshot.data() as User
//         } else {
//             console.error("User not found.")
//             return {id: ""}
//         }
//     } catch (error) {
//         console.error("Error fetching user:", error)
//         return {id: ""}
//     }
// }

export const setInfectionState = async (userId: string, currentUserId: string, state: "healthy" | "suspected" | "confirmed") => {
    try {
        await updateUserProfile(userId, {infectionState: {state, changedBy: currentUserId, changedAt: Timestamp.fromDate(new Date())}})
    } catch (error) {
        console.error("Error setting infection state:", error)
    }
}

export const getFullName = async (userId: string) => {
    try {
        const userProfile = await fetchUserProfile(userId)
        if (userProfile) {
            return userProfile.firstName + " " + userProfile.lastName
        }
        throw new Error("User profile wasn't found.")
    } catch (error) {
        console.error("Error fetching full name:", error)
    }
}

export const getConfirmedCases = async () => {
    try {
        const confirmedCasesQuery = query(collection(db, "users"), where("infectionState.state", "==", "confirmed"))
        const confirmedCasesSnapshot = await getDocs(confirmedCasesQuery)

        const resultsMap = new Map<string, User>()
        confirmedCasesSnapshot.forEach((doc) => {
            resultsMap.set(doc.id, {
                id: doc.id,
                ...(doc.data() as UserProfile)
            })
        })

        return [ ...resultsMap.values() ]
    } catch (error) {
        console.error("Error fetching confirmed cases:", error)
        return []
    }
}