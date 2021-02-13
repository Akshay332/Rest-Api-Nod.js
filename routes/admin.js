const express = require("express");
const router = express.Router();
const Admin = require("../model/admin");
const auth = require("../middleware/adminAuth");
const { sendWelcomeEmail } = require("../emails/account");
const upload = require("../middleware/upload");

router.post("/register", upload.single("avatar"), async (req, res) => {
  try {
    Admin.findOne({ email: req.body.email }).then(async (user) => {
      if (user) {
        return res.status(404).json({ email: "email-found" });
      } else {
        const admin = new Admin({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          avatar: req.file.path,
        });
        const token = await admin.generateAuthToken();

        await admin
          .save()
          .then((admin) => res.status(201).send({ admin, token }));
      }
    });
  } catch (err) {
    res, json(err).send(err);
  }
});

//Login admin
router.post("/login", async (req, res) => {
  try {
    const admin = await Admin.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await admin.generateAuthToken();
    res.send({ admin, token });
  } catch (e) {
    res.status(400).send();
  }
});

//Logout admin
router.post("/logout", auth, async (req, res) => {
  try {
    req.admin.tokens = req.admin.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.admin.save();
    res.send();
  } catch (e) {
    res.status(500).send();
  }
});

//Read admin profile when he is logged in
router.get("/read/profile", auth, async (req, res) => {
  res.send(req.admin);
});

//Read admin by id
router.get("/read/:adminID", async (req, res) => {
  const _id = req.params.adminID;
  try {
    const admin = await Admin.findById(_id);
    if (!admin) {
      return res.status(404).send();
    }
    res.send(admin);
  } catch (e) {
    res.status(500).send();
  }
});

//Read all admins
router.get("/alladmins", (req, res) => {
  Admin.find({})
    .then((admins) => {
      res.status(200).send(admins);
    })
    .catch((e) => {
      res.status(500).send();
    });
});

//Update admin
router.patch("/update/profile", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowUpdates = ["name", "email", "password"];
  const isValidOperation = updates.every((update) =>
    allowUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }
  try {
    updates.forEach((update) => (req.admin[update] = req.body[update]));

    await req.admin.save();
    res.send(req.admin);
  } catch (e) {
    res.status(400).send(e);
  }
});

//Delete admin profile
router.delete("/delete/profile", auth, async (req, res) => {
  try {
    await req.admin.remove();
    res.send(req.admin);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
