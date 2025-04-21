import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NavLink } from "react-router-dom"

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            ¿Olvidaste tu contraseña?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Introduce la dirección de correo electrónico asociada a tu cuenta y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>
        <form className="space-y-6" action="#" method="POST">
          <div>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Email"
            />
          </div>
          <Button type="submit" className="w-full">
            Enviar enlace de acceso
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
    </div>
  )
}
