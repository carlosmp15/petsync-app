import axios from "axios"

const OK_CODE = 200 // Código OK de la API
const BAD_CODE = 404

// Obtiene los historiales alimentarios de una mascota
export async function getAllFeedingsByPetId(id: number | undefined) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/feeding/pet/${id}`
    const response = await axios.get(url)

    if (response.status === OK_CODE) {
        return { success: true, data: response.data.data }
    } else if(response.status === BAD_CODE) {
      return { success: true, data: response.data.error }
    } else {
        return { success: true, data: [] }
    }
  } catch (error) {
    return { success: false, message: "Ha ocurrido un error de conexión." }
  }
}

// Función que crea un nuevo historial alimentario
export async function createNewFeeding(pet_id: number | undefined, type: string, description: string, quantity: number, date: string) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/feeding`
    const response = await axios.post(url, {
      pet_id, type, description, quantity, date
    })

    if (response.status === OK_CODE) {
        return { success: true, message: response.data.message }
    } else {
        return { success: true, message: "Error al crear la actividad diaria" }
    }
  } catch (error) {
    return { success: false, message: error }
  }
}

// Función que elimina un historial alimentario de una mascota por id
export async function deleteFeeding(feeeding_id: number | undefined) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/feeding/${feeeding_id}`
    const response = await axios.delete(url)

    if (response.status === OK_CODE) {
        return { success: true, data: response.data }
    }
  } catch (error) {
    return { success: false, message: error }
  }
}

// Función que actualiza un historial alimentario
export async function updateFeeding(feeeding_id: number | undefined, type: string, description: string, quantity: number, date: string) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/feeding/${feeeding_id}`
    const response = await axios.put(url, {
      type, description, quantity, date
    })

    if (response.status === OK_CODE) {
        return { success: true, message: "Historial médico actualizado correctamente." }
    } else {
        return { success: true, message: "Error al actualizar el historial médico." }
    }
  } catch (error) {
    return { success: false, message: error }
  }
}