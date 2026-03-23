"use client"

import { useEffect,useState } from "react"
import {
  getProfile,
  updateProfile,
  changePassword
} from "@/services/api"

export default function ProfilePage(){

  const [profile,setProfile] = useState<any>(null)

  const [password,setPassword] = useState({
    oldPassword:"",
    newPassword:""
  })

  const [successProfile, setSuccessProfile] = useState(false)
  const [successPassword, setSuccessPassword] = useState(false)
  const [errorProfile, setErrorProfile] = useState("")
  const [errorPassword, setErrorPassword] = useState("")

async function loadProfile(){

  const data = await getProfile()

  if(data.error){
    setErrorProfile(data.error)
    return
  }

  setProfile(data)

}

  useEffect(()=>{
    loadProfile()
  },[])



  async function handleProfileUpdate(e:any){

    e.preventDefault()

    setErrorProfile("")

    try {
      const result = await updateProfile(profile)

      if (result.error) {
        setErrorProfile(result.error)
        return
      }

      setSuccessProfile(true)
      setTimeout(() => setSuccessProfile(false), 3000)
    } catch (err: any) {
      setErrorProfile(err.message || "Failed to update profile")
    }

  }


  async function handlePasswordChange(e:any){

    e.preventDefault()

    setErrorPassword("")

    try {
      const result = await changePassword(password)

      if(result.error){
        setErrorPassword(result.error)
        return
      }

      setSuccessPassword(true)
      setTimeout(() => setSuccessPassword(false), 3000)
      setPassword({
        oldPassword:"",
        newPassword:""
      })
    } catch (err: any) {
      setErrorPassword(err.message || "Failed to change password")
    }

  }



  if(!profile) return <p>Loading...</p>



  return(

    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">

      <div className="space-y-8 max-w-4xl mx-auto">

        <div className="mb-8">

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Update Profile Information
          </h2>

          <p className="text-gray-600">
            Edit your personal details below.
          </p>

        </div>



          <form
            onSubmit={handleProfileUpdate}
            className="space-y-6"
          >

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>

                <label className="block text-gray-700 font-semibold mb-2">
                  Name
                </label>

                <input
                  value={profile.name}
                  onChange={(e)=>setProfile({
                    ...profile,
                    name:e.target.value
                  })}
                  placeholder="Enter your name"
                  className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />

              </div>

              <div>

                <label className="block text-gray-700 font-semibold mb-2">
                  Phone
                </label>

                <input
                  value={profile.phone || ""}
                  onChange={(e)=>setProfile({
                    ...profile,
                    phone:e.target.value
                  })}
                  placeholder="Enter your phone number"
                  className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                />

              </div>

            </div>

            <div>

              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>

              <input
                value={profile.email}
                disabled
                placeholder="Your email"
                className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg bg-gray-100 cursor-not-allowed"
              />

            </div>

            <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition duration-200 shadow-md">
              Update Profile
            </button>

            {errorProfile && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{errorProfile}</span>
              </div>
            )}

            {successProfile && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>Profile updated successfully!</span>
              </div>
            )}

          </form>



        <form
          onSubmit={handlePasswordChange}
          className="space-y-6"
        >

          <div>

            <label className="block text-gray-700 font-semibold mb-2">
              Old Password
            </label>

            <input
              type="password"
              placeholder="Enter old password"
              onChange={(e)=>setPassword({
                ...password,
                oldPassword:e.target.value
              })}
              className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

          </div>

          <div>

            <label className="block text-gray-700 font-semibold mb-2">
              New Password
            </label>

            <input
              type="password"
              placeholder="Enter new password"
              onChange={(e)=>setPassword({
                ...password,
                newPassword:e.target.value
              })}
              className="w-full text-black placeholder:text-gray-500 border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-md">
            Change Password
          </button>

          {errorPassword && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{errorPassword}</span>
            </div>
          )}

          {successPassword && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Password changed successfully!</span>
            </div>
          )}

        </form>

      </div>

    </div>

  )

}