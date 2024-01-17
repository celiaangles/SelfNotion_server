const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Fantasma = require("../models/Fantasma.model");
const Nuvol = require("../models/Nuvol.model");

//  POST /api/fantasmes  -  Creates a new fantasma
router.post("/fantasmes", (req, res, next) => {
  const { title, description, nuvolId } = req.body;

  Fantasma.create({ title, description, nuvol: nuvolId })
    .then((newFantasma) => {
      return Nuvol.findByIdAndUpdate(nuvolId, {
        $push: { fantasmes: newFantasma._id },
      });
    })
    .then((response) => res.json(response))
    .catch((err) => {
      console.log("Error while creating the fantasma", err);
      res.status(500).json({ message: "Error while creating the fantasma" });
    });
});

module.exports = router;
