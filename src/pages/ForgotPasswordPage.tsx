import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NavLink, useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import { forgotPassword } from "@/services/UserService"
import { useForm } from "react-hook-form"
import { useState } from "react"

interface FormValues {
  email: string
}

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>()

  const onSubmit = async ({ email }: FormValues) => {
    setLoading(true)
    try {
      const result = await forgotPassword(email)
      if (result?.success) {
        toast.success(result.message, { 
          autoClose: 2000,
          onClose: () => {
            navigate("/account/login")
          }
        })
      }
    } catch (error) {
      toast.error("Error al enviar el correo.", { autoClose: 2000 })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            ¿Olvidaste tu contraseña?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Introduce tu correo electrónico y recibirás un enlace para restablecerla.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Input
              type="email"
              placeholder="Correo electrónico"
              {...register("email", {
                required: "Email requerido",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Introduce un email válido"
                }
              })}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando..." : "Enviar enlace de acceso"}
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
