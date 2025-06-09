import { BreedsData, ComboBoxItem } from "@/types"
import { capitalizeWithSpaces } from "@/utils"
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
        return { success: true,  data: response.data.data, message: response.data.message }
    } else {
        return { success: true, message: "Error al crear la mascota" }
    }
  } catch (error) {
    return { success: false, message: "Ha ocurrido un error de conexión." }
  }
}

// Función que devuelve la url de la imagen de la mascota
export async function getPetImage(petName: string) {
  try {
    const name = petName.toLowerCase().trim();

    // Separar posibles subraza y raza
    const parts = name.split(' ');
    let url = '';

    if (parts.length === 1) {
      // Solo raza
      url = `https://dog.ceo/api/breed/${parts[0]}/images/random`;
    } else if (parts.length === 2) {
      // Formato: "raza subraza", invertimos para API: "raza/subraza"
      const [breed, subBreed] = parts;
      url = `https://dog.ceo/api/breed/${breed}/${subBreed}/images/random`;
    } else {
      return { success: false, message: 'Formato de nombre no válido' };
    }

    const response = await axios.get(url);

    if (response.status === 200) {
      return { success: true, message: response.data.message };
    } else {
      return { success: false, message: 'No se pudo obtener la imagen' };
    }

  } catch (error) {
    return { success: false, message: error };
  }
}

// Función que obtiene todas las razas de animales filtradas 
// export async function getFilteredBreeds(searchTerm: string) {
//   try {
//     const url = `${import.meta.env.VITE_PET_API_URL}/breeds/list/all`;
//     const response = await axios.get(url);

//     if (response.status === 200) {
//       const data: BreedsData = response.data.message
//       const allBreeds: string[] = [];
          
//     Object.entries(data).forEach(([breed, subBreeds]) => {
//       if (subBreeds.length === 0) {
//         allBreeds.push(breed); // solo raza
//       } else {
//         subBreeds.forEach(sub => {
//           allBreeds.push(`${breed} ${sub}`);
//         });
//       }
//     });

//       const lowerTerm = searchTerm.toLowerCase();
//       return allBreeds.filter(breed => breed.toLowerCase().includes(lowerTerm));
//     } else {
//       console.error('Error al obtener las razas');
//       return [];
//     }
//   } catch (error) {
//     console.error('Error en la petición:', error);
//     return [];
//   }
// }

export async function getFilteredBreeds(): Promise<ComboBoxItem[]> {
  try {
    const url = `${import.meta.env.VITE_PET_API_URL}/breeds/list/all`
    const response = await axios.get(url)

    if (response.status === 200) {
      const data: BreedsData = response.data.message
      const allBreeds: ComboBoxItem[] = []

      Object.entries(data).forEach(([breed, subBreeds]) => {
        if (subBreeds.length === 0) {
          allBreeds.push({
            value: breed,
            label: capitalizeWithSpaces(breed),
          })
        } else {
          subBreeds.forEach((sub) => {
            const full = `${breed} ${sub}`
            allBreeds.push({
              value: full,
              label: capitalizeWithSpaces(full),
            })
          })
        }
      })

      return allBreeds
    } else {
      console.error("Error al obtener las razas")
      return []
    }
  } catch (error) {
    console.error("Error en la petición:", error)
    return []
  }
}


// Función que obtiene todas las mascotas de un usuario por id
export async function getAllPetsByUserId(userId: number | undefined) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/pet/user/${userId}`
    const response = await axios.get(url)

    if (response.status === OK_CODE) {
        return { success: true, data: response.data }
    }
  } catch (error) {
    return { success: false, message: error }
  }
}

// Función que actualiza los datos de una mascota
export async function updatePetData(pet_id: number, name: string, breed: string, gender: string, weight: number, birthday: string, photo: string) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/pet/${pet_id}`
    const response = await axios.put(url, {
      name, breed, gender, weight, birthday, photo
    })

    if (response.status === OK_CODE) {
        return { success: true, message: "Mascota actualizada correctamente." }
    } else {
        return { success: true, message: "Error al actualizar la mascota" }
    }
  } catch (error) {
    return { success: false, message: error }
  }
}

// Función que elimina una mascota de un usuario por id
export async function deletePet(petId: number | undefined) {
  try {
    const url = `${import.meta.env.VITE_API_URL}/pet/${petId}`
    const response = await axios.delete(url)

    if (response.status === OK_CODE) {
        return { success: true, data: response.data }
    }
  } catch (error) {
    return { success: false, message: error }
  }
}