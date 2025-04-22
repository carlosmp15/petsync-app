import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { PhoneInput } from "@/components/PhoneInput"
import { DatePicker } from "@/components/ui/date-picker"
import { updateUserData } from "@/services/UserService"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import debounce from "just-debounce-it"
import { toast, ToastContainer } from "react-toastify"
import { useUserStore } from "@/stores/userStore"

export default function SettingsPage() {
  const {
      name, setName,
      surname, setSurname,
      email, setEmail,
      phone, setPhone,
      password, setPassword,
      birthday, setBirthday,
    } = useUserStore()

  const navigate = useNavigate()

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault()

    const result = await updateUserData(
      name,
      surname,
      email,
      phone,
      password,
      birthday as Date
    )

    try {
      if (result?.success) {
        const debouncedNavigate = debounce(() => {
          navigate("/account/login")
        }, 2200)

        toast.success(result.message, {
          autoClose: 2000,
        })
        debouncedNavigate()
      }
    } catch (error) {
      toast.error(result?.message)
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
              <h1 className="text-2xl font-bold">Luis Pérez Gómez</h1>
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
                  defaultValue="Luis"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surname">Apellidos</Label>
                <Input
                  id="surname"
                  name="surname"
                  placeholder="E.j Pérez Gómez"
                  defaultValue="Pérez Gómez"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  placeholder="E.j email@example.com" 
                  defaultValue="email@example.com" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone-number">Número de teléfono</Label>
                <PhoneInput
                  id="phone-number"
                  name="phone-number"
                  placeholder="E.j +34 654 34 23 12"
                  value="+34654342312"
                />
              </div>
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="birthday">Fecha de nacimiento</Label>
                <DatePicker />
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
                <Input type="password" id="new-password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                <Input type="password" id="confirm-password" />
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
