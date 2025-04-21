import axios from "axios"
import { format } from "date-fns"

const OK_CODE = 200 // Código OK de la API

// Autentica a los usuarios en el sistema
export async function authUsers(email: string, password: string) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/user/auth`
    const response = await axios.post(url, {
      email,
      password,
    })

    if (response.status === OK_CODE && response.data.authenticated) {
      return { success: true, data: response.data.results }
    } else {
      return { success: false, message: response.data.message }
    }
  } catch (error) {
    return { success: false, message: "Ha ocurrido un error de conexión." }
  }
}

// Da de alta un nuevo usuario en el sistema
export async function createNewUser(name: string, surname: string, email: string, phone: string, password: string, birthday: Date) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/user`
    const response = await axios.post(url, {
      name, surname, email, phone, password, birthday: format(birthday, "yyyy-MM-dd")
    })

    if (response.status === OK_CODE) {
      return { success: true, message: "Usuario dado de alta" }
    }
  } catch (error) {
    return { success: false, message: "Ha ocurrido un error de conexión." }
  }
}


