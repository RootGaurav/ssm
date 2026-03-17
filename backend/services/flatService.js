const flatQueries = require("../db/queries/flatQueries")

const getAllFlats = async () => {
  return await flatQueries.getAllFlats()
}

const createFlat = async (flat) => {
  
  return await flatQueries.createFlat(flat)
}

const updateFlat = async (id, flat) => {
  return await flatQueries.updateFlat(id, flat)
}

const deleteFlat = async (id) => {
  return await flatQueries.deleteFlat(id)
}

module.exports = {
  getAllFlats,
  createFlat,
  updateFlat,
  deleteFlat
}