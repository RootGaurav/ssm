const residentService = require("../services/residentService")

// GET ALL RESIDENTS
const getResidents = async (req, res) => {
  try {
    const residents = await residentService.getAllResidents()
    res.json(residents)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch residents" })
  }
}

// CREATE RESIDENT
const createResident = async (req, res) => {
  try {
    if (!req.body.name || !req.body.email || !req.body.password || req.body.flat_id === undefined) {
      return res.status(400).json({ error: "Missing required fields: name, email, password, flat_id" })
    }
    const resident = await residentService.createResident(req.body)
    res.status(201).json(resident)
  } catch (error) {
    console.error("Error creating resident:", error)
    res.status(500).json({ error: error.message || "Failed to create resident" })
  }
}

// UPDATE RESIDENT
const updateResident = async (req, res) => {
  try {
    const resident = await residentService.updateResident(req.params.id, req.body)
    res.json(resident)
  } catch (error) {
    res.status(500).json({ error: "Failed to update resident" })
  }
}

// DELETE RESIDENT
const deleteResident = async (req, res) => {
  try {
    await residentService.deleteResident(req.params.id)
    res.json({ message: "Resident deleted" })
  } catch (error) {
    res.status(500).json({ error: "Failed to delete resident" })
  }
}

// ASSIGN RESIDENT TO FLAT
const assignResidentToFlat = async (req, res) => {
  try {
    const { residentId, flatId } = req.body
    await residentService.assignResidentToFlat(residentId, flatId)
    res.json({ message: "Resident assigned to flat" })
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to assign resident" })
  }
}

// VACATE FLAT
const vacateFlat = async (req, res) => {
  try {
    await residentService.vacateFlat(req.params.flatId)
    res.json({ message: "Flat vacated" })
  } catch (error) {
    res.status(500).json({ error: "Failed to vacate flat" })
  }
}

module.exports = {
  getResidents,
  createResident,
  updateResident,
  deleteResident,
  assignResidentToFlat,
  vacateFlat
}