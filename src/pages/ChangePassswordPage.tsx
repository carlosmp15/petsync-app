import { useSearchParams, useNavigate, NavLink } from "react-router-dom"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast, ToastContainer } from "react-toastify"
import { resetPassword } from "@/services/UserService"
import { useState } from "react"

interface FormValues {
  password1: string
  password2: string
}

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get("token")

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<FormValues>()

  const onSubmit = async ({ password1 }: FormValues) => {
    if (!token) {
      toast.error("Token no válido.", {
        autoClose: 2000
      })
      return
    }

    setLoading(true)
    try {
      const result = await resetPassword(token, password1)
      if (result?.success) {
        toast.success(result.message, {
          autoClose: 2000,
          onClose: () => {
            navigate("/account/login")
          }
        })
      }
    } catch (error) {
      toast.error("Error al cambiar la contraseña.", {
        autoClose: 2000
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Actualiza tu contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Introduce tu nueva contraseña para acceder a tu cuenta.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              type="password"
              placeholder="Nueva contraseña"
              {...register("password1", { required: "Contraseña requerida" })}
            />
            {errors.password1 && (
              <p className="mt-1 text-sm text-red-500">{errors.password1.message}</p>
            )}
          </div>

          <div>
            <Input
              type="password"
              placeholder="Confirmar contraseña"
              {...register("password2", {
                required: "Confirma tu contraseña",
                validate: value =>
                  value === watch("password1") || "Las contraseñas no coinciden."
              })}
            />
            {errors.password2 && (
              <p className="mt-1 text-sm text-red-500">{errors.password2.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Restableciendo..." : "Restablecer contraseña"}
          </Button>
        </form>
        <div className="flex justify-center">
          <NavLink
            to="/account/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            Volver al inicio de sesión
          </NavLink>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}
