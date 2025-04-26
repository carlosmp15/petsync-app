import { PetsName, User } from "@/types";

export function getUserDataFromLocalStorage(): User | null {
    const userData = localStorage.getItem("user");
  
    if (userData) {
        const user: User = JSON.parse(userData);
        return user;
    }
    return null;
}

    export function getUserPetsFromLocalStorage(): PetsName | null {
        const userPets = localStorage.getItem("userPets");
    
        if (userPets) {
            const pets: PetsName = JSON.parse(userPets);
            return pets;
        }
        return null;
    }