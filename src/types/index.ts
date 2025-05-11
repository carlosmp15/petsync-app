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
    gender: string
    weight: number
    birthday: Date | undefined
    photo: string
    onDelete?: (id: number) => void
}


export type PetFormDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (e: React.FormEvent) => void
    title: string
    description: string
    name: string
    setName: (val: string) => void
    breed: string
    setBreed: (val: string) => void
    gender: string
    setGender: (val: string) => void
    weight: number
    setWeight: (val: number) => void
    birthday: Date | undefined
    setBirthday: (val: Date) => void
    photo?: string
    setPhoto: (val: string) => void
}

export type PetSelected = {
    id: number
    name: string
}

export type LoginFormInputs = {
  email: string
  password: string
}

export type RegisterFormInputs = {
  name: string
  surname: string
  email: string
  phone: string
  password: string
  birthday: Date
}

export type MedicalHistoryProps = {
    id: number
    type: string
    description: string
    date: Date
}