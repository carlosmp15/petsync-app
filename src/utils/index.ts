import { User } from "@/types"
import { NavigateFunction } from 'react-router-dom'

export function getUserDataFromLocalStorage(): User | null {
    const userData = localStorage.getItem("user");
  
    if (userData) {
        const user: User = JSON.parse(userData);
        return user;
    }
    return null;
}

export function handleLogout (navigate: NavigateFunction, resetUser: () => void) {
    localStorage.removeItem("user")
    localStorage.removeItem("selectedPet")
    resetUser()
    navigate("/account/login")
}