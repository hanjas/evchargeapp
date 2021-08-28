import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";

export default function LoginPage() {
		const { loginWithRedirect } = useAuth0();
		return (
				<div className="h-screen flex justify-center items-center">
						<button className="underline text-xl" onClick={loginWithRedirect}>Login</button>
				</div>
		)
}
