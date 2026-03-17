const flatService = require("../services/flatService")





// GET ALL FLATS
const getFlats = async (req, res) => {

  try {

    const flats = await flatService.getAllFlats()

    res.json(flats)

  } catch (error) {

    res.status(500).json({
      error: "Failed to fetch flats"
    })

  }

}


// CREATE FLAT
const createFlat = async (req, res) => {

  try {

    const flat = await flatService.createFlat(req.body)

    res.status(201).json(flat)

  } catch (error) {

    res.status(400).json({
      error: error.message || "Failed to create flat"
    })

  }

}


// UPDATE FLAT
const updateFlat = async (req, res) => {

  try {

    const id = parseInt(req.params.id)
    if(isNaN(id)){
      return res.status(400).json({error: "Invalid flat id"})
    }

    const updatedFlat = await flatService.updateFlat(
      id,
      req.body
    )

    if(!updatedFlat){
      return res.status(404).json({error: "Flat not found"})
    }

    res.json(updatedFlat)

  } catch (error) {

    res.status(400).json({
      error: error.message || "Failed to update flat"
    })

  }

}


// DELETE FLAT
const deleteFlat = async (req, res) => {

  try {

    const id = parseInt(req.params.id)
    if(isNaN(id)){
      return res.status(400).json({error: "Invalid flat id"})
    }

    await flatService.deleteFlat(id)

    res.json({
      message: "Flat deleted successfully"
    })

  } catch (error) {

    res.status(500).json({
      error: "Failed to delete flat"
    })

  }

}

module.exports = {
  getFlats,
  createFlat,
  updateFlat,
  deleteFlat
}