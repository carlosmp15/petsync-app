import { useNavigate, NavLink } from "react-router-dom"
import { useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import debounce from "just-debounce-it"
import { toast, ToastContainer } from "react-toastify"
import { PhoneInput } from "@/components/PhoneInput"
import { createNewUser } from "@/services/UserService"
import { DatePicker } from "@/components/ui/date-picker"
import { RegisterFormInputs } from "@/types"

export default function RegisterPage() {
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<RegisterFormInputs>()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) navigate("/")
  }, [navigate])

  const onSubmit = async (data: RegisterFormInputs) => {
    const result = await createNewUser(
      data.name,
      data.surname,
      data.email,
      data.phone,
      data.password,
      data.birthday
    )

    try {
      if (result?.success) {
        toast.success(result.message, { autoClose: 2000,
          onClose: () => {
            navigate("/account/login")
          },
         })
        reset()
      }
    } catch (error) {
      toast.error(result?.message || "Error en el registro")
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col items-center gap-2 text-center mb-3">
                <h1 className="text-2xl font-bold">Crear cuenta</h1>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Luis"
                    {...register("name", { required: "Nombre requerido" })}
                  />
                  {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="surname">Apellidos</Label>
                  <Input
                    id="surname"
                    type="text"
                    placeholder="Pérez Gómez"
                    {...register("surname", { required: "Apellidos requeridos" })}
                  />
                  {errors.surname && <span className="text-red-500 text-sm">{errors.surname.message}</span>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    {...register("email", {
                      required: "Email requerido",
                      pattern: { value: /^\S+@\S+$/i, message: "Formato de email inválido" }
                    })}
                  />
                  {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone-number">Número de teléfono</Label>
                  <Controller
                    name="phone"
                    control={control}
                    rules={{ required: "Teléfono requerido" }}
                    render={({ field }) => (
                      <PhoneInput id="phone-number" name="phone-number" value={field.value} onChange={field.onChange} />
                    )}
                  />
                  {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
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
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="birthday">Fecha de nacimiento</Label>
                  <Controller
                    name="birthday"
                    control={control}
                    rules={{ required: "Fecha nacimiento requerida" }}
                    render={({ field }) => (
                      <DatePicker selected={field.value} onSelect={field.onChange} />
                    )}
                  />
                  {errors.birthday && <span className="text-red-500 text-sm">{errors.birthday.message}</span>}
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
