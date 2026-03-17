const service = require("../services/residentSubscriptionService")

// LIST
const getSubscriptions = async (req,res)=>{

  try{

    const data = await service.getSubscriptions(
      req.user.id
    )

    res.json(data)

  }catch(error){

    res.status(500).json({
      error:error.message
    })

  }

}


// DETAIL
const getSubscriptionDetail = async (req,res)=>{

  try{

    const {year,month} = req.params

    const data = await service.getSubscriptionDetail(
      req.user.id,
      year,
      month
    )

    res.json(data)

  }catch(error){

    res.status(500).json({
      error:error.message
    })

  }

}

module.exports = {
  getSubscriptions,
  getSubscriptionDetail
}