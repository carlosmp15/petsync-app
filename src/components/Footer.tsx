
export default function Footer() {
  return (
    <div className="text-center md:text-right">
        <p className="text-gray-400">
            &copy; {new Date().getFullYear()} PetSync. Todos los derechos reservados.
        </p>

        <p className="text-gray-500 text-sm mt-1">Cuidando a tus mascotas con tecnología</p>
    </div>
  )
}
