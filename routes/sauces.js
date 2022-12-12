const express = require("express");
const sauceCtrl = require("../controllers/sauces");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/", auth, sauceCtrl.findAllSauces);
router.get("/:id", auth, sauceCtrl.findOneSauces);
router.post("/", auth, multer, sauceCtrl.createSauces);
router.delete("/:id", auth, sauceCtrl.deleteSauces);
module.exports = router;
