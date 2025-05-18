import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Spinner from "./Spinner"
import { decryptData } from "@/utils"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => {
      const encryptedUser = localStorage.getItem("user")
      const user = encryptedUser ? decryptData(encryptedUser) : null

      if (!user) {
        navigate("/account/login")
      } else {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [navigate])

  if (loading) {
    return (
      <div role="status" className="flex justify-center items-center min-h-screen bg-[#2B2B2B]">
        <Spinner />
      </div>
    )
  }

  return <>{children}</>
}
