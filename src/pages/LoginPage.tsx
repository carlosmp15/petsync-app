import React, { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authUsers } from "@/services/UserService"
import { useNavigate } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { NavLink } from "react-router-dom"
import debounce from "just-debounce-it"
import { useUserStore } from "@/stores/userStore"

export default function LoginPage() {
    const navigate = useNavigate()

    useEffect(() => {
        const user = localStorage.getItem("user")
        if (user) navigate("/")
   }, [navigate])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    // Obteniendo datos del formulario
    const form = event.target as HTMLFormElement
    const email = (form.elements.namedItem("email") as HTMLInputElement).value
    const password = (form.elements.namedItem("password") as HTMLInputElement).value

    const result = await authUsers(email, password)
    try {
      if (result.success) {
        // Guardamos el usuario en store con zustand 
        const { name, surname, email, phone, birthday, id } = result.data.results;
        const setUser = useUserStore.getState().setUser;

        setUser({
          name,
          surname,
          email,
          phone,
          birthday,
          id,
        });

        // Usuario autenticado exitosamente
        const debouncedNavigate = debounce(() => {
            navigate("/")
        }, 2200)

        localStorage.setItem("user", JSON.stringify(result.data.results))
          
        toast.success(result.data.message, {
            autoClose: 2000,
        })
        debouncedNavigate()
        
      } else {
        toast.error(result.message, {
          autoClose: 2000,
        })
      }
    } catch (error) {
      toast.error(result.data.message)
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col items-center gap-2 text-center mb-3">
                <h1 className="text-2xl font-bold">
                  Inicie sesión en su cuenta
                </h1>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                  <NavLink
                    to="/account/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    ¿Has olvidado la contraseña?
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
      <div className="relative hidden lg:flex bg-primary items-center justify-center flex-col text-white gap-6">
        <h1 className="text-6xl font-bold">PetSyn</h1>
        <img
          src="/image.png"
          alt="PetSyn"
          className="w-60 object-contain dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
