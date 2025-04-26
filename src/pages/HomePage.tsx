import { getAllPetsByUserId } from "@/services/PetService"
import { getUserDataFromLocalStorage } from "@/utils"

export default function HomePage() {
  const userData = getUserDataFromLocalStorage()

  
  return (
    <>
      <div>Home Page</div>
    </>
  )
}
