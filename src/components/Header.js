import React from 'react'
import { useAuth0 } from "@auth0/auth0-react";

export default function Header() {
    const { logout } = useAuth0();
    return (
        <div className="h-20 shadow bg-white flex">
            <div className="flex-1 flex items-center pl-10">
                <div className="text-2xl">App</div>
            </div>
            <div className="flex items-center pr-10">
                <div className="cursor-pointer" onClick={logout}>
                    Logout
                </div>
            </div>
        </div>
    )
}
