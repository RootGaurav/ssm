const service = require("../services/dashboardService")

const getDashboardStats = async (req,res)=>{

  try{

    const data = await service.getDashboardStats()

    res.json(data)

  }catch(error){

    res.status(500).json({
      error:"Failed to fetch dashboard stats"
    })

  }

}

module.exports = {
  getDashboardStats
}