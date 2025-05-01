export type User = {
    id: number
    name: string
    surname: string
    email: string
    phone: string
    birthday: Date
}

export type PetsName = {
    id: number
    name: string
}[]

export type PetCardProps = {
    id: number
    name: string
    breed: string
    weight: number
    photo: string
    onDelete?: (id: number) => void
}