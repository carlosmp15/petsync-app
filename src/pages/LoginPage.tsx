import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authUsers } from "@/services/UserService"
import { useNavigate, NavLink } from "react-router-dom"
import { ToastContainer, toast } from "react-toastify"
import { useUserStore } from "@/stores/userStore"
import { LoginFormInputs } from "@/types"
import { encryptData } from "@/utils"


export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
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
        // localStorage.setItem("user", JSON.stringify(result.data.results))
        localStorage.setItem("user", encryptData(result.data.results))

        toast.success(result.data.message, {
          autoClose: 2000,
          onClose: () => {
            navigate("/")
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
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col items-center gap-2 text-center mb-3">
                <h1 className="text-2xl font-bold">Inicie sesión en su cuenta</h1>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    {...register("email", {
                      required: "Email requerido",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Email no válido"
                      }
                    })}
                  />
                  {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password", { required: "Contraseña requerida" })}
                  />
                  {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
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
      <div className="relative hidden lg:flex bg-primary items-center justify-center flex-col text-white gap-6">
        <h1 className="text-6xl font-bold">PetSync</h1>
        <img
          src="/image.png"
          alt="PetSync"
          className="w-60 object-contain dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
