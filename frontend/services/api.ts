import DashboardPage from "@/app/(resident)/dashboard/page"

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



// ===============================
// SUBSCRIPTION PLANS
// ===============================

// GET SUBSCRIPTION PLANS
export async function getSubscriptionPlans() {

  const res = await fetch(`${API_URL}/subscriptions`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  })

  return res.json()
}


// UPDATE SUBSCRIPTION PLAN
export async function updateSubscriptionPlan(id:number, amount:number) {

  const res = await fetch(`${API_URL}/subscriptions/${id}`, {

    method: "PUT",

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },

    body: JSON.stringify({
      monthly_amount: amount
    })

  })

  return res.json()

}




// ===============================
// MONTHLY RECORDS
// ===============================

export async function getMonthlyRecords(month:number,year:number){

  const res = await fetch(
    `${API_URL}/monthly-records?month=${month}&year=${year}`,
    {
      headers:{
        Authorization:`Bearer ${localStorage.getItem("token")}`
      }
    }
  )

  return res.json()
}


export async function generateMonthlyRecords(month:number,year:number){

  const res = await fetch(
    `${API_URL}/monthly-records/generate`,
    {
      method:"POST",

      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${localStorage.getItem("token")}`
      },

      body:JSON.stringify({month,year})
    }
  )

  return res.json()
}


export async function markRecordPaid(id:number){

  const res = await fetch(
    `${API_URL}/monthly-records/${id}`,
    {
      method:"PUT",

      headers:{
        "Content-Type":"application/json",
        Authorization:`Bearer ${localStorage.getItem("token")}`
      },

      body:JSON.stringify({
        status:"paid"
      })
    }
  )

  return res.json()
}


// ===============================
// PAYMENTS
// ===============================

export async function createOfflinePayment(data:any){

  const res = await fetch(`${API_URL}/payments/offline`,{

    method:"POST",

    headers:{
      "Content-Type":"application/json",
      Authorization:`Bearer ${localStorage.getItem("token")}`
    },

    body:JSON.stringify(data)

  })

  return res.json()

}


export async function getPaymentsByFlat(flatId:number){

  const res = await fetch(`${API_URL}/payments/${flatId}`,{

    headers:{
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }

  })

  return res.json()

}

// REPORTS

export async function getMonthlyReport(){

  const res = await fetch(`${API_URL}/reports/monthly`,{
    headers:{
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }
  })

  return res.json()
}


export async function getYearlyReport(){

  const res = await fetch(`${API_URL}/reports/yearly`,{
    headers:{
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }
  })

  return res.json()
}


export async function getPendingPayments(){

  const res = await fetch(`${API_URL}/reports/pending`,{
    headers:{
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }
  })

  return res.json()
}

// ===============================
// NOTIFICATIONS
// ===============================


export async function getNotifications(){

  const res = await fetch(`${API_URL}/notifications`,{
    headers:{
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }
  })

  return res.json()
}


export async function createNotification(data:any){

  const res = await fetch(`${API_URL}/notifications`,{

    method:"POST",

    headers:{
      "Content-Type":"application/json",
      Authorization:`Bearer ${localStorage.getItem("token")}`
    },

    body:JSON.stringify(data)

  })

  return res.json()

}


// PROFILE

export async function getProfile(){

  const res = await fetch(`${API_URL}/profile`,{
    headers:{
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }
  })

  if(!res.ok){
    const error = await res.json()
    return { error: error.error || "Failed to fetch profile" }
  }

  return res.json()
}


export async function updateProfile(data:any){

  const res = await fetch(`${API_URL}/profile`,{

    method:"PUT",

    headers:{
      "Content-Type":"application/json",
      Authorization:`Bearer ${localStorage.getItem("token")}`
    },

    body:JSON.stringify(data)

  })

  if(!res.ok){
    const error = await res.json()
    return { error: error.error || "Failed to update profile" }
  }

  return res.json()

}


export async function changePassword(data:any){

  const res = await fetch(`${API_URL}/profile/password`,{

    method:"PUT",

    headers:{
      "Content-Type":"application/json",
      Authorization:`Bearer ${localStorage.getItem("token")}`
    },

    body:JSON.stringify(data)

  })

  if(!res.ok){
    const error = await res.json()
    return { error: error.error || "Failed to change password" }
  }

  return res.json()

}





// DashboardPage

export async function getDashboardStats(){

  const res = await fetch(`${API_URL}/dashboard`,{
    headers:{
      Authorization:`Bearer ${localStorage.getItem("token")}`
    }
  })

  if(!res.ok){
    const error = await res.json()
    return { error: error.error || "Failed to fetch dashboard" }
  }

  return res.json()

}