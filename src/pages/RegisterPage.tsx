import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { NavLink } from "react-router-dom"
import debounce from "just-debounce-it"
import { toast, ToastContainer } from "react-toastify"
import { PhoneInput } from "@/components/PhoneInput"
import { createNewUser } from "@/services/UserService"
import { DatePicker } from "@/components/ui/date-picker"

export default function RegisterPage() {
  const [name, setName] = useState<string>("")
  const [surname, setSurname] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [birthday, setBirthday] = useState<Date>()

  const navigate = useNavigate()

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) navigate("/")
  }, [navigate])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const result = await createNewUser(
      name,
      surname,
      email,
      phone,
      password,
      birthday as Date
    )

    try {
      if (result?.success) {
        const debouncedNavigate = debounce(() => {
          navigate("/account/login")
        }, 2200)

        toast.success(result.message, {
          autoClose: 2000,
        })
        debouncedNavigate()
      }
    } catch (error) {
      toast.error(result?.message)
    }
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <form onSubmit={handleSubmit}>
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
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Apellidos</Label>
                  <Input
                    id="surname"
                    type="text"
                    placeholder="Pérez Gómez"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone-number">
                    Número de teléfono
                  </Label>
                  <PhoneInput
                    id="phone-number"
                    name="phone-number"
                    value={phone}
                    onChange={setPhone}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="birthday">Fecha de nacimiento</Label>
                  {/* <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] justify-start text-left font-normal",
                          !birthday && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {birthday ? (
                          format(birthday, "PPP", { locale: es })
                        ) : (
                          <span>Selecciona una fecha</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={birthday}
                        onSelect={setBirthday}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover> */}
                  <DatePicker selected={birthday} onSelect={setBirthday} />
                </div>
                <Button type="submit" className="w-full">
                  Completar registro
                </Button>
                <div className="text-center text-sm">
                  ¿Tienes ya una cuenta?{" "}
                  <NavLink
                    to="/account/login"
                    className="underline underline-offset-4"
                  >
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
