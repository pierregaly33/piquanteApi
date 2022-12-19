const Sauce = require("../models/sauces");
const fs = require("fs");
const { json } = require("express");

exports.findAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(400).json({ error }));
};

exports.findOneSauces = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id,
    })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

exports.createSauces = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject.userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    });
    sauce
        .save()
        .then(() => res.status(201).json({ message: "Objet enregistré !" }))
        .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauces = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message: "Suppression non-autorisé" });
            } else {
                const filename = sauce.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                    sauce
                        .deleteOne({ _id: req.params.id })
                        .then(() => res.status(200).json({ message: "objet supprimé !" }))
                        .catch((error) => res.status(401).json({ error }));
                });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};

exports.updateSauces = (req, res, next) => {
    if (req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                if (req.auth.userId != sauce.userId) {
                    res.status(401).json({ message: "Non-autorisé" });
                    return;
                }
                const filename = sauce.imageUrl.split("/images")[1];
                fs.unlink(`images/${filename}`, () => {
                    const sauceObject = {
                        ...JSON.parse(req.body.sauce),
                        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
                    };
                    delete sauceObject.userId;
                    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                        .then(() => res.status(200).json({ message: "Sauce modifiée" }))
                        .catch((error) => res.status(400).json({ error }));
                    console.log(sauceObject);
                });
            })
            .catch((error) => res.status(500).json({ error }));
    } else {
        const sauceObject = { ...req.body };
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce modifiée" }))
            .catch((error) => res.status(400).json({ error }));
    }
};

exports.likeOrDislike = (req, res, next) => {
    if (req.body.like == 1) {
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $push: { usersLiked: req.body.userId },
                $inc: { likes: 1 },
            }
        )
            .then(() => res.status(200).json({ message: "Objet modifié" }))
            .catch((error) => res.status(400).json({ error }));
    }

    if (req.body.like == -1) {
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $push: { usersDisliked: req.body.userId },
                $inc: { dislikes: 1 },
            }
        )
            .then(() => res.status(200).json({ message: "Objet modifié" }))
            .catch((error) => res.status(400).json({ error }));
    }

    if (req.body.like == 0) {
        Sauce.updateOne(
            { _id: req.params.id },
            {
                $pull: { usersLiked: req.body.userId },
                $inc: { likes: -1 },
            }
        )
            .then(() => res.status(200).json({ message: "Objet modifié" }))
            .catch((error) => res.status(400).json({ error }));
    }
};
