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

export type DailyActivityProps = {
  id: number
  type: string
  duration: number
  notes: string
  date: Date
}

export type FeedingProps = {
  id: number
  type: string
  description: string
  quantity: number
  date: Date
}

export type BreedsData = {
  [breed: string]: string[]
}

export type ComboBoxItem = {
  value: string
  label: string
}

export interface ComboBoxProps {
  items: ComboBoxItem[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export type FormData = {
  name: string
  surname: string
  email: string
  phone: string
  birthday: Date | null
}