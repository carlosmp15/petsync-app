import React, { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { PhoneInput } from "@/components/PhoneInput"
import { DatePicker } from "@/components/ui/date-picker"
import { deleteUser, updateUserData } from "@/services/UserService"
import { toast } from "react-toastify"
import { useUserStore } from "@/stores/userStore"
import { encryptData, getUserDataFromLocalStorage } from "@/utils"
import { format } from 'date-fns'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { handleLogout } from "@/utils"
import { useNavigate } from "react-router-dom"
import { useUserUpdateStore } from "@/stores/userUpdated"

export default function SettingsPage() {
  const [password, setPassword] = useState("")
  const [confirmPasswd, setConfirmPasswd] = useState("")
  const [isOpenSave, setIsOpenSave] = useState(false)
  const [isOpenDelete, setIsOpenDelete] = useState(false)

  const [isUserLoaded, setIsUserLoaded] = useState(false) // estado de carga
  const [error, setError] = useState("")

  const { setNeedsUpdate } = useUserUpdateStore()

  const {
    id, 
    name, setName,
    surname, setSurname,
    email, setEmail,
    phone, setPhone,
    birthday, setBirthday, 
    setUser, resetUser
  } = useUserStore()
  
  const userData = getUserDataFromLocalStorage()
  const navigate = useNavigate()

  useEffect(() => {
    validatePasswords();
  }, [password, confirmPasswd])

  

  const validatePasswords = () => {
    if (!password && !confirmPasswd) {
      setError("")
      return
    }

    if (password !== confirmPasswd) {
      setError("Las contraseñas no coinciden")
    } else {
      setError("")
    }
  };
  

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      setUser(userData)
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
      setIsOpenSave(false)
      return
    }

    if(birthday) {
      try {
        const result = await updateUserData(id, name, surname, email, phone, password, format(birthday, 'yyyy-MM-dd'))
        if (result?.success && result.user.data) {
          const updatedUser = {
            name: result.user.data.name,
            surname: result.user.data.surname,
            email: result.user.data.email,
            phone: result.user.data.phone,
            birthday: result.user.data.birthday,
            id: result.user.data.id
          };
        
          localStorage.removeItem("user");
          localStorage.setItem("user", encryptData(updatedUser));
          setUser(updatedUser);

          setIsOpenSave(false)

          toast.success(result.message as string, {
            autoClose: 2000
          })

          setNeedsUpdate(true) // actualiza el estado de actualización del usuario

        } else {
          toast.error(result?.message as string || "Error al actualizar el usuario")
        }
      } catch (error) {
        toast.error("Error inesperado al actualizar")
      }
    }
  }

  const handleDeleteAccount = async () => {
    try {
      const result = await deleteUser(userData?.id);
      if (result?.success) {
        
        setIsOpenDelete(false)
        toast.success(result.message, {
          autoClose: 2000
        });
  
        setTimeout(() => {
          handleLogout(navigate, resetUser);
        }, 2500);
      } else {
        toast.error("Error al eliminar la cuenta: " + result?.message);
      }
    } catch (error) {
      toast.error("Error inesperado al eliminar la cuenta.");
    }
  }
  
  
  return (
    <div>
      <div className="px-4 space-y-6 sm:px-6">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold underline pb-2">Mis datos personales</h1>
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div className="space-y-1">
              <h1 className="text-2xl font-bold">{userData?.name + " " + userData?.surname}</h1>
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
                  required
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
                  required
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
                  required
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
                  required
                  value={userData?.phone}
                  onChange={setPhone}
                />
              </div>
              <div className="space-y-2 flex flex-col">
                <Label htmlFor="birthday">Fecha de nacimiento</Label>
                <DatePicker selected={userData?.birthday} onChange={setBirthday}/>
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
                  onChange={(e) => {
                    setConfirmPasswd(e.target.value)
                    validatePasswords()
                  }}
                />
                {error && <p className="text-sm text-red-700">{error}</p>}
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="flex gap-2">

          <AlertDialog open={isOpenSave} onOpenChange={setIsOpenSave}>
            <AlertDialogTrigger asChild>
            <Button>Guardar cambios</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Actualización de datos</AlertDialogTitle>
                <AlertDialogDescription>
                  Está a punto de actualizar su información personal.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleUpdate}>Continuar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={isOpenDelete} onOpenChange={setIsOpenDelete}>
            <AlertDialogTrigger asChild>
              <Button className="bg-red-800 hover:bg-red-700">Eliminar cuenta</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminación de cuenta</AlertDialogTitle>
                <AlertDialogDescription>
                  Está a punto de eliminar su cuenta. Esta acción es irreversible y se eliminarán todos los datos asociados a su cuenta.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-red-800 hover:bg-red-700"
                  onClick={handleDeleteAccount}>Continuar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  )
}