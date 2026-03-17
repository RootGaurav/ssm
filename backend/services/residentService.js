const residentQueries = require("../db/queries/residentQueries")
const bcrypt = require("bcrypt")

const getAllResidents = async () => {
  return await residentQueries.getAllResidents()
}

const createResident = async (resident) => {
  // Hash password before storing
  const hashedPassword = await bcrypt.hash(resident.password, 10)
  const residentWithHashedPassword = {
    ...resident,
    password: hashedPassword
  }
  return await residentQueries.createResident(residentWithHashedPassword)
}

const updateResident = async (id, resident) => {
  return await residentQueries.updateResident(id, resident)
}

const deleteResident = async (id) => {
  return await residentQueries.deleteResident(id)
}

const assignResidentToFlat = async (residentId, flatId) => {
  return await residentQueries.assignResidentToFlat(residentId, flatId)
}

const vacateFlat = async (flatId) => {
  return await residentQueries.vacateFlat(flatId)
}

module.exports = {
  getAllResidents,
  createResident,
  updateResident,
  deleteResident,
  assignResidentToFlat,
  vacateFlat
}