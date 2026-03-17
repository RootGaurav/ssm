const residentDashboardService = require("../services/residentDashboardService")

const getDashboard = async (req,res)=>{

  try{

    const data = await residentDashboardService.getResidentDashboard(
      req.user.id
    )

    res.json(data)

  }catch(error){

    res.status(500).json({
      error:error.message
    })

  }

}

module.exports = {
  getDashboard
}