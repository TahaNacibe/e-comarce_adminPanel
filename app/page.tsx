"use client"
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {

  // get session
  const { data: session } = useSession()
  

  const checkIfUserAuthorized = () => {
    // redirect to sign in if not signed yet
    if (!session) redirect("/signInPage")
    // check if user authorized
    return session?.user.role === "ADMIN" || session?.user.role === "SUB_ADMIN"
  }

  if (!checkIfUserAuthorized()) {
    redirect("/UnauthorizedAccessPage")
  }


  return (
    <div className="">
      <h1>
        Page Content
      </h1>
    </div>
  );
}
