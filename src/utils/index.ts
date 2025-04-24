import { User } from "@/types";

export function getUserDataFromLocalStorage(): User | null {
    const userData = localStorage.getItem("user");
  
    if (userData) {
        const user: User = JSON.parse(userData);
        return user;
    }
    return null;
}