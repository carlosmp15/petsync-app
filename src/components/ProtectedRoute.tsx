import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!user) { // si no existe user en localstorage redirigir al login
                navigate("/account/login");
            } else {
                setLoading(false);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [user, navigate]);

    if (loading) {
        return (
            <div role="status" className="flex justify-center items-center min-h-screen bg-[#2B2B2B]">
                <Spinner />
            </div>
        );
    }
    return <>{children}</>;
}
