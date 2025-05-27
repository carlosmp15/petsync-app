"use client"

import { useNavigate, NavLink } from "react-router-dom"
import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast, ToastContainer } from "react-toastify"
import { PhoneInput } from "@/components/PhoneInput"
import { createNewUser } from "@/services/UserService"
import { DatePicker } from "@/components/ui/date-picker"
import type { RegisterFormInputs } from "@/types"

export default function RegisterPage() {
  const navigate = useNavigate()

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    mode: "onTouched", // valida al tocar el input
  })

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) navigate("/")
  }, [navigate])

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const result = await createNewUser(data.name, data.surname, data.email, data.phone, data.password, data.birthday)
      console.log(result)
      if (result?.success) {
        toast.success(result.message as string, {
          autoClose: 2000,
          onClose: () => navigate("/account/login"),
        })
        reset()
      } else {
        toast.error((result?.message as string) || "Error en el registro")
      }
    } catch (error) {
      toast.error("Error en el registro" + error)
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {/* Vista movil */}
            <NavLink 
              to="/"
              className="flex flex-col items-center gap-4 mb-4 lg:hidden"
            >
              <h1 className="text-4xl font-bold text-primary">PetSync</h1>
              <img src="/image.png" alt="PetSync Logo" className="w-32 h-32 object-contain border-2 border-zinc-400 rounded-full" />
            </NavLink>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col items-center gap-2 text-center mb-6">
                <h2 className="text-2xl font-bold">Crear cuenta</h2>
              </div>

              <div className="grid gap-6">
                {/* Nombre */}
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Controller
                    name="name"
                    control={control}
                    rules={{ required: "Nombre requerido" }}
                    render={({ field, fieldState }) => (
                      <>
                        <Input id="name" type="text" placeholder="Luis" {...field} />
                        {fieldState.error && <span className="text-red-500 text-sm">{fieldState.error.message}</span>}
                      </>
                    )}
                  />
                </div>

                {/* Apellidos */}
                <div className="grid gap-2">
                  <Label htmlFor="surname">Apellidos</Label>
                  <Controller
                    name="surname"
                    control={control}
                    rules={{ required: "Apellidos requeridos" }}
                    render={({ field, fieldState }) => (
                      <>
                        <Input id="surname" type="text" placeholder="Pérez Gómez" {...field} />
                        {fieldState.error && <span className="text-red-500 text-sm">{fieldState.error.message}</span>}
                      </>
                    )}
                  />
                </div>

                {/* Email */}
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email requerido",
                      pattern: { value: /^\S+@\S+$/, message: "Formato de email inválido" },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <Input id="email" type="email" placeholder="email@example.com" {...field} />
                        {fieldState.error && <span className="text-red-500 text-sm">{fieldState.error.message}</span>}
                      </>
                    )}
                  />
                </div>

                {/* Teléfono */}
                <div className="grid gap-2">
                  <Label htmlFor="phone-number">Número de teléfono</Label>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{ required: "Teléfono requerido" }}
                    render={({ field, fieldState }) => (
                      <>
                        <PhoneInput
                          id="phone-number"
                          placeholder="Ej. 641 12 32 90"
                          defaultCountry="ES"
                          {...field}
                          onChange={(value) => field.onChange(value || "")}
                          value={field.value || ""}
                        />
                        {fieldState.error && <span className="text-red-500 text-sm">{fieldState.error.message}</span>}
                      </>
                    )}
                  />
                </div>

                {/* Contraseña */}
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Controller
                    name="password"
                    control={control}
                    rules={{
                      required: "Contraseña requerida",
                      minLength: { value: 6, message: "La contraseña debe tener al menos 6 caracteres" },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <Input id="password" type="password" placeholder="••••••••" {...field} />
                        {fieldState.error && <span className="text-red-500 text-sm">{fieldState.error.message}</span>}
                      </>
                    )}
                  />
                </div>

                {/* Fecha de nacimiento */}
                <div className="grid gap-2">
                  <Label htmlFor="birthday">Fecha de nacimiento</Label>
                  <Controller
                    name="birthday"
                    control={control}
                    rules={{ required: "Fecha de nacimiento requerida" }}
                    render={({ field, fieldState }) => (
                      <>
                        <DatePicker selected={field.value} onChange={field.onChange} />
                        {fieldState.error && <span className="text-red-500 text-sm">{fieldState.error.message}</span>}
                      </>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Completar registro
                </Button>

                <div className="text-center text-sm">
                  ¿Tienes ya una cuenta?{" "}
                  <NavLink to="/account/login" className="underline underline-offset-4">
                    Iniciar sesión
                  </NavLink>
                </div>

                <ToastContainer />
              </div>
            </form>
          </div>
        </div>
      </div>

      <NavLink
        className="relative hidden lg:flex bg-primary items-center justify-center flex-col text-white gap-6"
        to="/"
      >
        <h1 className="text-6xl font-bold">PetSync</h1>
        <img src="/image.png" alt="PetSync" className="w-60 object-contain dark:brightness-[0.2] dark:grayscale" />
      </NavLink>
    </div>
  )
}
