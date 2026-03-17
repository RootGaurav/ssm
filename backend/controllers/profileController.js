const service = require("../services/profileService")

const getProfile = async (req,res)=>{

  try{

    const user = await service.getProfile(req.user.id)

    res.json(user)

  }catch(error){

    res.status(500).json({
      error:"Failed to fetch profile"
    })

  }

}


const updateProfile = async (req,res)=>{

  try{

    const user = await service.updateProfile(
      req.user.id,
      req.body
    )

    res.json(user)

  }catch(error){

    res.status(400).json({
      error:error.message
    })

  }

}


const changePassword = async (req,res)=>{

  try{

    const result = await service.changePassword(
      req.user.id,
      req.body
    )

    res.json(result)

  }catch(error){

    res.status(400).json({
      error:error.message
    })

  }

}

module.exports = {
    getProfile,
  updateProfile,
  changePassword
}