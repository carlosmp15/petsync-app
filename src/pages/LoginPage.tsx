"use client"

import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authUsers } from "@/services/UserService"
import { useNavigate, NavLink } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { useUserStore } from "@/stores/userStore"
import type { LoginFormInputs } from "@/types"
import { encryptData } from "@/utils"

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<LoginFormInputs>()

  const navigate = useNavigate()

  const onSubmit = async (data: LoginFormInputs) => {
    const { email, password } = data
    const result = await authUsers(email, password)

    try {
      if (result.success) {
        const { name, surname, email, phone, birthday, id } = result.data.results
        const setUser = useUserStore.getState().setUser

        setUser({ name, surname, email, phone, birthday, id })
        localStorage.setItem("user", encryptData(result.data.results))

        toast.success(result.data.message, {
          autoClose: 2000,
          onClose: () => {
            navigate("/home")
          },
        })
        reset()
      } else {
        toast.error(result.message, {
          autoClose: 2000,
        })
      }
    } catch (error) {
      toast.error("Error de autenticación")
    }
  }

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) navigate("/")
  }, [navigate])

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
              <h1 className="text-5xl font-bold text-primary">PetSync</h1>
              <NavLink to="/">
                <img src="/image.png" alt="PetSync Logo" className="w-32 h-32 object-contain border-2 border-zinc-400 rounded-full" />
              </NavLink>
            </NavLink>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col items-center gap-2 text-center mb-6">
                <h2 className="text-2xl font-bold">Inicie sesión en su cuenta</h2>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: "Email requerido",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email no válido",
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <>
                        <Input id="email" type="email" placeholder="email@example.com" {...field} />
                        {fieldState.error && <span className="text-red-500 text-sm">{fieldState.error.message}</span>}
                      </>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: "Contraseña requerida" }}
                    render={({ field, fieldState }) => (
                      <>
                        <Input id="password" type="password" placeholder="••••••••" {...field} />
                        {fieldState.error && <span className="text-red-500 text-sm">{fieldState.error.message}</span>}
                      </>
                    )}
                  />

                  <NavLink
                    to="/account/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    ¿Has olvidado tu contraseña?
                  </NavLink>
                </div>
                <Button type="submit" className="w-full">
                  Entrar
                </Button>
                <div className="text-center text-sm">
                  ¿No tienes una cuenta?{" "}
                  <NavLink to="/account/register" className="underline underline-offset-4">
                    Regístrate
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
