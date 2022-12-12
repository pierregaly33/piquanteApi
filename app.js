const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user");
const saucesRoutes = require("./routes/sauces");
const path = require("path");
const cors = require("cors");

const app = express();

app.use(cors());

mongoose
    .connect("mongodb+srv://pierre:pierre@cluster0.leqvdum.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));

app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
