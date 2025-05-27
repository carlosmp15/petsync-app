import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Calendar,
  Activity,
  Users,
  Shield,
  Smartphone,
  PawPrint,
  Stethoscope,
  Apple,
  Clock,
  Star,
  ArrowRight,
  CheckCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import Footer from "@/components/Footer"

export default function LandingPage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: Stethoscope,
      title: "Historial Médico Completo",
      description:
        "Registra vacunas, medicamentos, visitas al veterinario y mantén toda la información médica de tu mascota organizada.",
      color: "text-blue-600",
    },
    {
      icon: Apple,
      title: "Control Nutricional",
      description:
        "Monitorea la alimentación, peso y hábitos nutricionales para mantener a tu mascota en óptimas condiciones.",
      color: "text-green-600",
    },
    {
      icon: Activity,
      title: "Seguimiento de Actividades",
      description: "Registra ejercicios, paseos y actividades diarias para asegurar el bienestar físico de tu mascota.",
      color: "text-orange-600",
    },
    {
      icon: Users,
      title: "Múltiples Mascotas",
      description: "Gestiona todos tus compañeros peludos desde una sola cuenta con perfiles individualizados.",
      color: "text-pink-600",
    },
    {
      icon: Smartphone,
      title: "Acceso Móvil",
      description: "Accede a toda la información desde cualquier dispositivo, en cualquier momento y lugar.",
      color: "text-indigo-600",
    },
  ]

  const benefits = [
    "Historial médico completo y organizado",
    "Control de peso y alimentación",
    "Recordatorios de vacunas y medicamentos",
    "Seguimiento de actividad física",
    "Múltiples perfiles de mascotas",
    "Interfaz intuitiva y fácil de usar",
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <PawPrint className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">PetSync</span>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => navigate("/account/login")} className="hidden sm:inline-flex">
                Iniciar Sesión
              </Button>
              <Button onClick={() => navigate("/account/register")}>Registrarse</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  <Heart className="w-4 h-4 mr-2" />
                  Cuidado Integral para tu Mascota
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Gestiona la salud de tu mascota con <span className="text-primary">PetSync</span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  La plataforma completa para el cuidado de tus mascotas. Registra historiales médicos, controla la
                  nutrición y mantén un seguimiento detallado de sus actividades diarias.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => navigate("/account/register")} className="text-lg px-8 py-6">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span>100% Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span>Fácil de usar</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>Acceso 24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Todo lo que necesitas para cuidar a tu mascota
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              PetSync te ofrece herramientas completas para gestionar la salud, nutrición y bienestar de tus compañeros
              peludos de manera profesional y organizada.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="space-y-4">
                  <div className={`w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center ${feature.color}`}>
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">¿Por qué elegir PetSync?</h2>
                <p className="text-xl text-gray-600">
                  Diseñado por amantes de las mascotas para amantes de las mascotas. Nuestra plataforma te ayuda a
                  brindar el mejor cuidado posible.
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">¿Listo para comenzar?</h2>
            <p className="text-xl text-blue-100">
              Únete a miles de dueños de mascotas que ya confían en PetSync para el cuidado integral de sus compañeros.
            </p>
          </div>


          <p className="text-blue-100 text-sm">
            No se requiere tarjeta de crédito • Configuración en menos de 2 minutos
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <PawPrint className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-white">PetSync</span>
            </div>

            <Footer />
          </div>
        </div>
      </footer>
    </div>
  )
}
