const express = require("express");
const router = express.Router();
const Product = require("../model/product");
const adminAuth = require("../middleware/adminAuth");
const upload = require("../middleware/upload");

//Create hotel by admin
router.post("/create", async (req, res) => {
  console.log(req.body);
  const product = new Product({
    ...req.body,
    gallery: [req.body.img, req.body.img2, req.body.img3],
  });

  try {
    await product.save();
    res.status(201).send(product);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Read hotels by admin
router.get("/getProduct", async (req, res) => {
  Product.find({})
    .then((product) => {
      res.send(product);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

//Read hotel by id
router.get("/read/:id", adminAuth, async (req, res) => {
  const _id = req.params.id;
  try {
    const product = await Product.findOne({ _id, owner: req.admin._id });
    if (!product) {
      return res.status(404).send();
    }
    res.send(product);
  } catch (e) {
    res.status(500).send();
  }
});

// update hotel information by admin
router.patch("/updateProduct/:ProductID", adminAuth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["name", "description", "itinerary"];
  const isValidOperation = updates.every((update) =>
    allowUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    const product = await Product.findOne({
      _id: req.params.productID,
      owner: req.admin._id,
    });
    if (!product) {
      return res.status(404).send();
    }
    updates.forEach((update) => (product[update] = req.body[update]));
    await product.save();
    res.send(product);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Delete hotel by admin by id
router.delete("/delete/:id", adminAuth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      owner: req.admin._id,
    });
    if (!product) {
      return res.status(404).send();
    }

    res.send(product);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
