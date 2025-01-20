"use client"
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import AdminPanel from "./admin/page";
import { useEffect } from "react";

export default function Home() {

  // get session
  const { data: session } = useSession()
  

  useEffect(() => {
    if (!session) redirect("/sign-in")
      const checkIfUserAuthorized = () => {
        if (session) {
          // redirect to sign in if not signed yet
          // check if user authorized
          return session?.user.role === "ADMIN" || session?.user.role === "SUB_ADMIN"
        }
      }
    
      if (session) {
        if (!checkIfUserAuthorized()) {
          redirect("/unauthorized-access")
        } else {
          redirect("/admin")
        }
      }
 },[session])



  return (
    <div className="">
      <AdminPanel />
    </div>
  );
}
