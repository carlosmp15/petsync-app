import axios from "axios"

const OK_CODE = 200 // Código OK de la API

// Obtiene las mascotas que pertenecen a un usuario
export async function getAllPetsNameByUserId(id: number | undefined) {
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

// Función que crea una nueva mascota
export async function createNewPet(user_id: number | undefined, name: string, breed: string, gender: string, weight: number, birthday: string, photo: string) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/pet`
    const response = await axios.post(url, {
      user_id, name, breed, gender, weight, birthday, photo
    })

    if (response.status === OK_CODE) {
        return { success: true, message: response.data.message }
    } else {
        return { success: true, message: "Error al crear la mascota" }
    }
  } catch (error) {
    return { success: false, message: error }
  }
}

// Función que devuelve la url de la imagen de la mascota
export async function getPetImage(petName: string) {
  try {
    const url = `${import.meta.env.VITE_PET_API_URL}/breed/${petName}/images/random`
    const response = await axios.get(url)

    if (response.status) {
        return { success: true, message: response.data.message }
    } else {
        return { success: true, message: "Error al obtener la imagen" }
    }
  } catch (error) {
    return { success: false, message: error }
  }
}

// Función que obtiene todas las razas de animales filtradas 
export async function getFilteredBreeds(searchTerm: string) {
  try {
    const url = `${import.meta.env.VITE_PET_API_URL}/breeds/list/all`
    const response = await axios.get(url)

    if (response.status === 200) {
      const data = response.data.message
      const allBreeds: string[] = []

      Object.entries(data).forEach(([breed, subBreeds]) => {
        if (subBreeds.length === 0) {
          allBreeds.push(breed)
        } else {
          subBreeds.forEach(sub => {
            allBreeds.push(`${sub} ${breed}`)
          });
        }
      });
      const lowerTerm = searchTerm.toLowerCase();
      return allBreeds.filter(breed => breed.toLowerCase().includes(lowerTerm))
    } else {
      console.error('Error al obtener las razas')
      return []
    }
  } catch (error) {
    console.error('Error en la petición:', error)
    return []
  }
}

export async function getAllPetsByUserId(userId: number) {
try {
  const url = `${import.meta.env.VITE_API_URL}/pet/${userId}`
  const response = await axios.get(url)

  if (response.status === OK_CODE) {
      return { success: true, data: response.data }
  }
} catch (error) {
  return { success: false, message: error }
}
}
