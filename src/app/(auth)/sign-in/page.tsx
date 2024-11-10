'use client'
import { useSession, signIn, signOut } from "next-auth/react"

export default function page() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button className=" bg-white text-black rounded-sm m-2 px-2 py-1" onClick={() => signIn()}>Sign in</button>
    </>
  )
}