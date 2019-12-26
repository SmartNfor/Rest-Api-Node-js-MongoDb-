const express = require('express');
const router = express.Router();

// Item Model
const Mesure = require('../../models/Mesure');
const Capteur = require('../../models/Capteur');


function getMesure(capteur,res) {
    Mesure.findOne({ capteur: capteur},{ sort: { 'date' : -1 }}, function (err, data) {
        if(data){
            res.json(data)
        }       
    });
}
// @route   GET api/capteur
// @desc    Get All capteurs
// @access  Public
router.get('/latest/', (req, res) => {
  Capteur.find()
    .sort({ name: 1 })
    .then(data => getMesure(data, res))
    .catch(err => console.log(err));
});

// @route   GET api/capteur
// @desc    Get one capteur
// @access  Public
router.get('/:id', (req, res) => {
    Capteur.findById(req.params.id)
    .then(data => {
        if(!data) {
            return res.status(404).send({
                message: "Capteur not found with id " + req.params.id
            });            
        }
        res.json(data)
    })
    .catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Capteur not found with id " + req.params.id
            });                
        }
        return res.status(500).send({
            message: "Error retrieving capteur with id " + req.params.id
        });
    });
});

//@route POST api/capteurs
//@desc Create a capteur
//@access Public
router.post("/", (req, res) => {
    const data = new Capteur({
      name: req.body.name,
      type_grandeur:req.body.type,
      description:req.body.desc,
      effectif:req.body.effectif,
    });
    data.save()
      .then(data => {
        res.json(data);
      }).catch(err => {
          res.status(500).send({
              message: err.message || "Some error occurred while creating the Capteur."
          });
      });
  });

//@route POST api/capteur
//@desc Create an capteur
//@access Public
router.post("/update/:id", (req, res) => {
        Capteur.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            type_grandeur:req.body.type,
            description:req.body.desc,
            effectif:req.body.effectif,
        }, {new: true})
        .then(data => {
            if(!data) {
                return res.status(404).send({
                    message: "Capteur not found with id " + req.params.id
                });
            }
            res.json(data);
        })
        .catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Capteur not found with id " + req.params.id
                });                
            }
            return res.status(500).send({
                message: "Error updating capteur with id " + req.params.id
            });
        });
  });

//@route DELETE api/capteur:id
//@desc Delete Capteur
//@access Public
router.delete("/:id", (req, res) => {
    Capteur.findById(req.params.id)
      .then(data =>
        data
          .remove()
          .then(data => res.json(data))
          .catch(err => res.json({ success: false }))
      )
      .catch(err => res.status(404).json({ success: false }));
  });
module.exports = router;

