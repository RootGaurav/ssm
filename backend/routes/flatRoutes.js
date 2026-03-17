const express = require("express")
const router = express.Router()

const flatController = require("../controllers/flatController")
const authMiddleware = require("../middleware/authMiddleware")
const adminMiddleware = require("../middleware/adminMiddleware")


// GET ALL FLATS

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  flatController.getFlats
)

// CREATE FLAT
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  flatController.createFlat
)

// UPDATE FLAT
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  flatController.updateFlat
)

// DELETE FLAT
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  flatController.deleteFlat
)

module.exports = router