const express = require("express");
const sauceCtrl = require("../controllers/sauces");
const multer = require("../middleware/multer-config");
const auth = require("../middleware/auth");
const router = express.Router();

// route pour toutes les sauces
router.get("/", auth, sauceCtrl.findAllSauces);

// route pour une sauce
router.get("/:id", auth, sauceCtrl.findOneSauces);

// route pour creer une sauce
router.post("/", auth, multer, sauceCtrl.createSauces);

// route pour supprimer une sauce
router.delete("/:id", auth, sauceCtrl.deleteSauces);

// route pour changer une sauce
router.put("/:id", auth, multer, sauceCtrl.updateSauces);

// route pour like ou dislike une sauce
router.post("/:id/like", auth, sauceCtrl.likeOrDislike);

module.exports = router;
