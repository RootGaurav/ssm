const service = require("../services/monthlyRecordService")


// GET RECORDS
const getMonthlyRecords = async (req, res) => {

  try {

    const { month, year } = req.query

    const records = await service.getMonthlyRecords(month, year)

    res.json(records)

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

}


// GENERATE RECORDS
const generateMonthlyRecords = async (req, res) => {

  try {

    const { month, year } = req.body

    const records = await service.generateMonthlyRecords(month, year)

    res.json(records)

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

}


// UPDATE STATUS
const updateMonthlyRecord = async (req, res) => {

  try {

    const id = req.params.id
    const { status } = req.body

    const record = await service.updateMonthlyRecord(id, status)

    res.json(record)

  } catch (error) {

    res.status(500).json({
      error: error.message
    })

  }

}

module.exports = {
  getMonthlyRecords,
  generateMonthlyRecords,
  updateMonthlyRecord
}