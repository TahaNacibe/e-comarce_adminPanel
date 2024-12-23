"use client"
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {

  // get session
  const { data: session } = useSession()
  

  const checkIfUserAuthorized = () => {
    if (session) {
      console.log("session in main page is: ",session)
      // redirect to sign in if not signed yet
      if (!session) redirect("/sign-in")
      // check if user authorized
      return session?.user.role === "ADMIN" || session?.user.role === "SUB_ADMIN"
    }
  }

  if (session) {
    if (!checkIfUserAuthorized()) {
      console.log("session in main page is: ",session)
      redirect("/unauthorized-access")
    } else {
      redirect("/admin")
    }
  }


  return (
    <div className="">
      <h1>
        Page Content
      </h1>
    </div>
  );
}
