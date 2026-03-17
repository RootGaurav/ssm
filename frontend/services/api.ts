const API_URL = "http://localhost:5000/api"

export async function login(data: any) {

  try {

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })

    const result = await res.json()
    
    if (!res.ok) {
      return { error: result.error || "Login failed" }
    }
    localStorage.setItem("token", result.token)

    return result

  } catch (error) {

    return { error: "Server error. Please try again." }

  }

}


export async function register(data: any) {

  try {

    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
    
    const result = await res.json()
    
    if (!res.ok) {
      return { error: result.error || "Registration failed" }
    }
    localStorage.setItem("token", result.token)

    return result

  } catch (error) {

    return { error: "Server error. Please try again." }

  }

}





export async function getFlats() {

  const res = await fetch(`${API_URL}/flats`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })

  return res.json()
}


// CREATE FLAT
export async function createFlat(data:any) {

  const res = await fetch(`${API_URL}/flats`, {

    method: "POST",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },

    body: JSON.stringify(data)

  })

  return res.json()
}


// UPDATE FLAT
export async function updateFlat(id:number,data:any){

  const res = await fetch(`${API_URL}/flats/${id}`,{

    method:"PUT",

    headers:{
      "Content-Type":"application/json",
      Authorization:`Bearer ${localStorage.getItem("token")}`
    },

    body:JSON.stringify(data)

  })

  return res.json()

}


// DELETE FLAT
export async function deleteFlat(id:number){

  const res = await fetch(`${API_URL}/flats/${id}`,{

    method:"DELETE",

    headers:{
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }

  })

  return res.json()

}

// GET RESIDENTS
export async function getResidents() {
  const res = await fetch(`${API_URL}/residents`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
  return res.json()
}

// CREATE RESIDENT
export async function createResident(data: any) {
  const res = await fetch(`${API_URL}/residents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(data)
  })
  return res.json()
}

// UPDATE RESIDENT
export async function updateResident(id: number, data: any) {
  const res = await fetch(`${API_URL}/residents/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify(data)
  })
  return res.json()
}

// DELETE RESIDENT
export async function deleteResident(id: number) {
  const res = await fetch(`${API_URL}/residents/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
  return res.json()
}

// ASSIGN RESIDENT TO FLAT
export async function assignResidentToFlat(residentId: number, flatId: number) {
  const res = await fetch(`${API_URL}/residents/assign`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ residentId, flatId })
  })
  return res.json()
}

// VACATE FLAT
export async function vacateFlat(flatId: number) {
  const res = await fetch(`${API_URL}/residents/vacate/${flatId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })
  return res.json()
}