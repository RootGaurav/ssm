const monthlyService = require("../services/monthlyRecordService")

// GET RECORDS
const getMonthlyRecords = async (req, res) => {

  try {

    const records = await monthlyService.getMonthlyRecords()

    res.json(records)

  } catch (error) {

    res.status(500).json({
      error: "Failed to fetch monthly records"
    })

  }

}


// CREATE RECORD
const createMonthlyRecord = async (req, res) => {

  try {

    const record = await monthlyService.createMonthlyRecord(req.body)

    res.status(201).json(record)

  } catch (error) {

    res.status(500).json({
      error: "Failed to create record"
    })

  }

}


// UPDATE STATUS
const updateMonthlyRecord = async (req, res) => {

  try {

    const id = req.params.id
    const { status } = req.body

    const record = await monthlyService.updateMonthlyRecord(id, status)

    res.json(record)

  } catch (error) {

    res.status(500).json({
      error: "Failed to update record"
    })

  }

}

module.exports = {
  getMonthlyRecords,
  createMonthlyRecord,
  updateMonthlyRecord
}