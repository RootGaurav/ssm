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
    const flatId = req.query.flat_id ? Number(req.query.flat_id) : null

    const data = await service.getSubscriptionDetail(
      req.user.id,
      year,
      month,
      flatId
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
