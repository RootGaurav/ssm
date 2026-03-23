"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Script from "next/script"
import { login, loginResidentWithGoogle } from "@/services/api"

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string
            callback: (response: { credential?: string }) => void
          }) => void
          renderButton: (
            element: HTMLElement,
            options: Record<string, string>
          ) => void
          prompt: () => void
        }
      }
    }
  }
}

export default function ResidentLogin() {

  const router = useRouter()
  const googleButtonRef = useRef<HTMLDivElement | null>(null)
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ""

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState("")
  const [googleReady, setGoogleReady] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleSubmit(e:any){

    e.preventDefault()

    const res = await login({
      email,
      password
    })

    

    if(res.token){
       if (res.user?.role !== "resident") {
        setError("You must login with a resident account")
        return
      }

      document.cookie = `token=${res.token}; path=/`

      router.push("/dashboard")

    }else{

      setError(res.error)

    }

  }

  useEffect(() => {
    if (!googleReady || !googleClientId || !window.google || !googleButtonRef.current) {
      return
    }

    googleButtonRef.current.innerHTML = ""

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async ({ credential }) => {
        if (!credential) {
          setError("Google login failed. Please try again.")
          return
        }

        setGoogleLoading(true)
        setError("")

        const res = await loginResidentWithGoogle(credential)

        if (res.token) {
          document.cookie = `token=${res.token}; path=/`
          router.push("/dashboard")
        } else {
          setError(res.error)
        }

        setGoogleLoading(false)
      }
    })

    window.google.accounts.id.renderButton(googleButtonRef.current, {
      type: "standard",
      theme: "outline",
      size: "large",
      text: "signin_with",
      shape: "pill",
      width: "320"
    })
  }, [googleReady, googleClientId, router])

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {googleClientId && (
        <Script
          src="https://accounts.google.com/gsi/client"
          strategy="afterInteractive"
          onLoad={() => setGoogleReady(true)}
        />
      )}

      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl">

        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Resident Login
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Access your society dashboard
        </p>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        {googleClientId ? (
          <div className="mb-6">
            <div ref={googleButtonRef} className="flex justify-center" />
            {googleLoading && (
              <p className="mt-3 text-center text-sm text-gray-500">
                Signing you in with Google...
              </p>
            )}
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
                Or
              </span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Enter your email"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <button
            className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
          >
            Login
          </button>

        </form>

        <p className="text-center text-gray-600 text-sm mt-6">

          New resident?

          <a
            href="/register"
            className="text-green-600 ml-2 font-semibold hover:underline"
          >
            Register here
          </a>

        </p>

      </div>

    </div>

  )
}
