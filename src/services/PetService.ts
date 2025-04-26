import axios from "axios"

const OK_CODE = 200 // Código OK de la API

// Obtiene las mascotas que pertenecen a un usuario
export async function getAllPetsByUserId(id: number | undefined) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/pet/name/user/${id}`
    const response = await axios.get(url)

    if (response.status === OK_CODE) {
        return { success: true, data: response.data.results }
    } else {
        return { success: true, data: [] }
    }
  } catch (error) {
    return { success: false, message: "Ha ocurrido un error de conexión." }
  }
}