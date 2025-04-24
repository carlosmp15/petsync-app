import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { PhoneInput } from "@/components/PhoneInput"
import { DatePicker } from "@/components/ui/date-picker"
import { updateUserData } from "@/services/UserService"
import { toast, ToastContainer } from "react-toastify"
import { useUserStore } from "@/stores/userStore"
import { getUserDataFromLocalStorage } from "@/utils"

export default function SettingsPage() {
  const [password, setPassword] = useState("")
  const [confirmPasswd, setConfirmPasswd] = useState("")

  const {
    id, 
    name, setName,
    surname, setSurname,
    email, setEmail,
    phone, setPhone,
    birthday, setBirthday, 
    setUser
  } = useUserStore()
  
  const userData = getUserDataFromLocalStorage()

  const [isUserLoaded, setIsUserLoaded] = useState(false) // estado de carga

  const [error, setError] = useState("")

  const validatePasswords = () => {
    if (password && confirmPasswd && password !== confirmPasswd) {
      setError("Las contraseñas no coinciden")
    } else {
      setError("")
    }
  }  

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const parsedUser = JSON.parse(user)
      setUser(parsedUser)
    }
    setIsUserLoaded(true)
  }, [setUser])

  if (!isUserLoaded) return <div>Cargando datos del usuario...</div>

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault()

    if (error && (password || confirmPasswd)) {
      toast.warning("Las contraseñas no coinciden o están incompletas", {
        autoClose: 2000
      })
      return
    }

    if(birthday) {
      try {
        const result = await updateUserData(id, name, surname, email, phone, password, new Date(birthday))
  
        if (result?.success && result.user) {
          setUser({
            name: result.user.name,
            surname: result.user.surname,
            email: result.user.email,
            phone: result.user.phone,
            birthday: result.user.birthday,
            id: result.user.id
          })
          toast.success(result.message, {
            autoClose: 2000,
          })
        } else {
          toast.error(result?.message || "Error al actualizar el usuario")
        }
      } catch (error) {
        toast.error("Error inesperado al actualizar")
        console.error("Error en handleUpdate:", error)
      }
    }
  }

  return (
    <div>
      <div className="px-4 space-y-6 sm:px-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold underline pb-2">Mis datos personales</h1>
          <div className="flex items-center space-x-3">
            <ToastContainer />
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold">{userData?.name + " " + userData?.surname}</h1>
              <Button size="sm">Cambiar foto</Button>
            </div>
          </div>
        </header>
        <div className="space-y-8">
          <Card className="pt-3">
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="E.j Luis"
                  defaultValue={userData?.name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname">Apellidos</Label>
                <Input
                  id="surname"
                  name="surname"
                  placeholder="E.j Pérez Gómez"
                  defaultValue={userData?.surname}
                  onChange={(e) => setSurname(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="E.j email@example.com"
                  defaultValue={userData?.email} 
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone-number">Número de teléfono</Label>
                <PhoneInput
                  id="phone-number"
                  name="phone-number"
                  placeholder="E.j +34 654 34 23 12"
                  value={userData?.phone}
                  onChange={setPhone}
                />
              </div>
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="birthday">Fecha de nacimiento</Label>
                <DatePicker selected={userData?.birthday} onSelect={setBirthday}/>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div>
                <h1 className="text-xl font-semibold">Actualizar contraseña</h1>
              </div>
              <div>
                Por su seguridad, por favor no comparta su contraseña con otras personas.
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                <Input 
                  type="password" 
                  id="new-password" 
                  name="new-password" 
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    validatePasswords()
                  }}
                />
                {error && <p className="text-sm text-red-700">{error}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                <Input 
                  type="password" 
                  id="confirm-password" 
                  name="confirm-password" 
                  value={confirmPasswd}
                  onChange={(e) => setConfirmPasswd(e.target.value)}
                />
                {error && <p className="text-sm text-red-700">{error}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleUpdate}>Guardar cambios</Button>
          <Button className="bg-red-800 hover:bg-red-700">Eliminar cuenta</Button>
        </div>
      </div>
    </div>
  )
}
