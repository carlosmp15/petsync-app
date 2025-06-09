import { User } from "@/types"
import { NavigateFunction } from 'react-router-dom'
import CryptoJS from "crypto-js"

const SECRET_KEY = import.meta.env.VITE_SECRET_KEY


export function getUserDataFromLocalStorage(): User | null {
  const encryptedUserData = localStorage.getItem("user");

  if (encryptedUserData) {
    try {
      const decrypted = decryptData(encryptedUserData);
      const user: User = JSON.parse(decrypted); 
      return user;
    } catch (error) {
      console.error("Error al desencriptar los datos del usuario:", error);
      return null;
    }
  }
  return null;
}


// Funcion que cierra la sesion del usuario
export function handleLogout (navigate: NavigateFunction, resetUser: () => void) {
    localStorage.removeItem("user")
    resetUser()
    navigate("/account/login")
}


// Encriptar: convierte un string a AES
export function encryptData(data: object): string {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
}

// Desencriptar: convierte AES a string
export function decryptData(ciphertext: string): string {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  return decrypted;
}


export function capitalizeWithSpaces(text: string): string {
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}



