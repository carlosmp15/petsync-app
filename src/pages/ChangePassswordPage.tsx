import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { NavLink } from "react-router-dom"

export default function ChangePasswordPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 py-12 px-4 dark:bg-gray-950">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">
            Actualiza tu contraseña
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Cambia tu contraseña aquí. Una vez que la hayas guardado, podrás iniciar sesión con tu nueva contraseña.
          </p>
        </div>
        <form className="space-y-6" action="#" method="POST">
          <div className="flex flex-col gap-2">
            <Input
              id="password1"
              name="password1"
              type="password"
              required
              placeholder="Nueva contraseña"
            />
            <Input
              id="password2"
              name="password2"
              type="password"
              required
              placeholder="Confirmar contraseña"
            />
          </div>
          <Button type="submit" className="w-full">
            Restablecer contraseña
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
