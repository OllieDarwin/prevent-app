import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase-config";
import { collection, doc, getDoc, setDoc, where, query, orderBy, startAt, endAt, getDocs } from "firebase/firestore";

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

export interface User extends UserProfile {
    id: string;
}

export const searchForUsers = async (input: string) => {
    if(!input.trim()) {
        // Empty query
        return []
    }

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

        // const usersRef = collection(db, "users")

        // const inputParts = input.toLowerCase().split(" ").filter((part) => part)

        // let firstNameMatches: User[] = []
        // let lastNameMatches: User[] = []
        // let fullNameMatches: User[] = []

        // if (inputParts.length === 1) {
        //     // Single input (e.g., "John", "Doe")
        //     const firstNameQuery = query(usersRef, orderBy("firstName"), startAt(inputParts[0]), endAt(inputParts[0] + "\uf8ff"))
        //     const lastNameQuery = query(usersRef, orderBy("lastName"), startAt(inputParts[0]), endAt(inputParts[0] + "\uf8ff"))

        //     const [firstNameSnapshot, lastNameSnapshot] = await Promise.all([
        //         await getDocs(firstNameQuery),
        //         await getDocs(lastNameQuery)
        //     ])

        //     firstNameSnapshot.forEach((doc) => firstNameMatches.push({ ...(doc.data() as User) }))
        //     lastNameSnapshot.forEach((doc) => lastNameMatches.push({ ...(doc.data() as User) }))
        // } else if (inputParts.length === 2) {
        //     // Double input (e.g., "John Doe")
        //     const [firstNameInput, lastNameInput] = inputParts

        //     const firstNameQuery = query(usersRef, where("firstName", ">=", firstNameInput), where("firstName", "<=", firstNameInput + "\uf8ff"))
        //     const lastNameQuery = query(usersRef, where("lastName", ">=", lastNameInput), where("lastName", "<=", lastNameInput + "\uf8ff"))

        //     const [firstNameSnapshot, lastNameSnapshot] = await Promise.all([
        //         await getDocs(firstNameQuery),
        //         await getDocs(lastNameQuery)
        //     ])

        //     firstNameSnapshot.forEach((doc) => {
        //         const userData = doc.data() as User
        //         if (userData.lastName?.toLowerCase() === lastNameInput) {
        //             fullNameMatches.push({ ...userData })
        //         }
        //     })
        // }

        // // Combine and deduplicate results

        // const resultsMap = new Map<string, User>()
        // // [...firstNameMatches, ...lastNameMatches, ...fullNameMatches].forEach((user: User) => resultsMap.set(user.id, user))
        // firstNameMatches.forEach((doc) => {
        //     resultsMap.set(doc.id, {
        //         id: doc.id,
        //         ...(doc as UserProfile)
        //     })
        // })
        // lastNameMatches.forEach((doc) => {
        //     resultsMap.set(doc.id, {
        //         id: doc.id,
        //         ...(doc as UserProfile)
        //     })
        // })

        // fullNameMatches.forEach((doc) => {
        //     resultsMap.set(doc.id, {
        //         id: doc.id,
        //         ...(doc as UserProfile)
        //     })
        // })

        // return [...resultsMap.values()]
    } catch (error) {
        console.error("Error fetching users:", error)
        return []
    }
}

export const getUserFromId = async (userId: string) => {
    try {
        const userDoc = doc(db, "users", userId)
        const userSnapshot = await getDoc(userDoc)
        if (userSnapshot.exists()) {
            return userSnapshot.data() as User
        } else {
            console.error("User not found.")
            return []
        }
    } catch (error) {
        console.error("Error fetching user:", error)
        return []
    }
}