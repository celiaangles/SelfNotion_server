// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");

// const Bruixa = require("../models/Bruixa.model");
// const Nuvol = require("../models/Nuvol.model");

// router.post("/bruixes", (req, res, next) => {
//   const { gat, peix, nuvolId } = req.body;

//   Bruixa.create({ gat, peix, nuvol: nuvolId })
//     .then((newBruixa) => {
//       return Nuvol.findByIdAndUpdate(nuvolId, {
//         $push: { bruixes: newBruixa._id },
//       });
//     })
//     .then((response) => res.json(response))
//     .catch((err) => {
//       console.log("Error while creating the fantasma", err);
//       res.status(500).json({ message: "Error while creating the fantasma" });
//     });
// });
// // Update an existing fantasma by ID
// router.put("/bruixes/:bruixaId", (req, res, next) => {
//   const { gat, peix } = req.body;
//   const { bruixaId } = req.params;

//   Bruixa.findByIdAndUpdate(
//     bruixaId,
//     { gat, peix },
//     { new: true } // Returns the updated document
//   )
//     .then((updatedBruixa) => {
//       if (!updatedBruixa) {
//         return res.status(404).json({ message: "Fantasma not found" });
//       }
//       res.json(updatedBruixa);
//     })
//     .catch((err) => {
//       console.log("Error while updating the fantasma", err);
//       res.status(500).json({ message: "Error while updating the fantasma" });
//     });
// });

// // Delete an existing fantasma by ID
// router.delete("/bruixes/:bruixaId", (req, res, next) => {
//   const { bruixaId } = req.params;
//   console.log("bruixaId:", bruixaId); // Log the bruixaId

//   Bruixa.findByIdAndDelete(bruixaId)
//     .then((deletedBruixa) => {
//       if (!deletedBruixa) {
//         return res.status(404).json({ message: "Fantasma not found" });
//       }

//       // Remove fantasma ID from the associated nuvol
//       return Nuvol.findByIdAndUpdate(deletedBruixa.nuvol, {
//         $pull: { bruixes: bruixaId },
//       });
//     })
//     .then(() => {
//       res.json({ message: "Fantasma deleted successfully" });
//     })
//     .catch((err) => {
//       console.log("Error while deleting the fantasma", err);
//       res.status(500).json({ message: "Error while deleting the fantasma" });
//     });
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Bruixa = require("../models/Bruixa.model");
const Nuvol = require("../models/Nuvol.model");

// Create a new bruixa
router.post("/bruixes", (req, res, next) => {
  const { gat, peix, nuvolId } = req.body;

  Bruixa.create({ gat, peix: new Date(peix), nuvol: nuvolId }) // Convert peix to a Date
    .then((newBruixa) => {
      return Nuvol.findByIdAndUpdate(nuvolId, {
        $push: { bruixes: newBruixa._id },
      });
    })
    .then((response) => res.json(response))
    .catch((err) => {
      console.log("Error while creating the bruixa", err);
      res.status(500).json({ message: "Error while creating the bruixa" });
    });
});

// Update an existing bruixa by ID
router.put("/bruixes/:bruixaId", (req, res, next) => {
  const { gat, peix } = req.body;
  const { bruixaId } = req.params;

  // Check if the "peix" field is a valid date
  if (peix && !isNaN(new Date(peix))) {
    Bruixa.findByIdAndUpdate(
      bruixaId,
      { gat, peix: new Date(peix) }, // Convert peix to a Date
      { new: true } // Returns the updated document
    )
      .then((updatedBruixa) => {
        if (!updatedBruixa) {
          return res.status(404).json({ message: "Bruixa not found" });
        }
        res.json(updatedBruixa);
      })
      .catch((err) => {
        console.log("Error while updating the bruixa", err);
        res.status(500).json({ message: "Error while updating the bruixa" });
      });
  } else {
    res.status(400).json({ message: "Invalid date format for 'peix'" });
  }
});

// Delete an existing bruixa by ID
router.delete("/bruixes/:bruixaId", (req, res, next) => {
  const { bruixaId } = req.params;

  Bruixa.findByIdAndDelete(bruixaId)
    .then((deletedBruixa) => {
      if (!deletedBruixa) {
        return res.status(404).json({ message: "Bruixa not found" });
      }

      // Remove bruixa ID from the associated nuvol
      return Nuvol.findByIdAndUpdate(deletedBruixa.nuvol, {
        $pull: { bruixes: bruixaId },
      });
    })
    .then(() => {
      res.json({ message: "Bruixa deleted successfully" });
    })
    .catch((err) => {
      console.log("Error while deleting the bruixa", err);
      res.status(500).json({ message: "Error while deleting the bruixa" });
    });
});

module.exports = router;
