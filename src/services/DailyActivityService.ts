import axios from "axios"

const OK_CODE = 200 // Código OK de la API
const BAD_CODE = 404

// Obtiene las actividades diarias de una mascota
export async function getAllDailyActivityByPetId(id: number | undefined) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/daily_activities/pet/${id}`
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

// Función que crea una nueva actividad diaria
export async function createNewDailyActivity(pet_id: number | undefined, type: string,  duration: number, notes: string, date: string) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/daily_activity`
    const response = await axios.post(url, {
      pet_id, type, duration, notes, date
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

// Función que elimina una actividad diaria de una mascota por id
export async function deleteDailyActivity(dailyActivityId: number | undefined) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/daily_activity/${dailyActivityId}`
    const response = await axios.delete(url)

    if (response.status === OK_CODE) {
        return { success: true, data: response.data }
    }
  } catch (error) {
    return { success: false, message: error }
  }
}

// Función que actualiza un historial médico
export async function updateDailyActivity(pet_id: number | undefined, type: string, duration: number, notes: string, date: string) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/daily_activity/${pet_id}`
    const response = await axios.put(url, {
      type, duration, notes, date
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