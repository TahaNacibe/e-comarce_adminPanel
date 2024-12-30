"use client"
import { Button } from "@/components/ui/button"
import { signIn, signOut, useSession } from "next-auth/react"
import Image from "next/image"
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function SignInPage() {
    // consts
    const ILLUSTRATION_SIZE = 500;
    const GOOGLE_ICON_SIZE = 20;
    // get session provider instance
    const { data: session } = useSession()

    // functions 
    const handleSignIn = () => {
        session ? signOut() : signIn("google")
       
      
    }

    useEffect(() => {
        if (session) {
            redirect("/")
        }
    },[session])
    return (
        <section className="flex items-center justify-center h-screen">
            <div className="text-center">
                <Image
                    alt="LogIn_Ilu"
                    width={ILLUSTRATION_SIZE}
                    height={ILLUSTRATION_SIZE}
                    src="log_in.svg"
                />
                <Button
                    onClick={handleSignIn}
                    className="mt-8 px-4 py-6 rounded-xl">
                    <Image
                    alt="Google_Icon"
                    width={GOOGLE_ICON_SIZE}
                    height={GOOGLE_ICON_SIZE}
                    src="/google.png">
                    </Image>
                    <h1 className="text-lg font-medium">
                        {session ? "Sign Out" : "Continue with google"}
                    </h1>
                </Button>
            </div>
        </section>
    )
}


