const express = require("express");
const fs = require("fs");
const path = require("path");
const { noteModel } = require("../model/note.model");
const upload = require("../middleware/upload");

const noteRouter = express.Router();

const uploadImage = (req, res, next) => {
    upload.single("image")(req, res, (err) => {
        if (err) {
            return res.send({ msg: "Image must be under 2 MB" });
        }
        next();
    });
};

// Delete an image file from the uploads folder (value looks like "/uploads/abc.jpg")
const deleteImageFile = (image) => {
    if (!image) return;
    const file = path.join(__dirname, "..", "uploads", path.basename(image));
    fs.unlink(file, () => {});
};

// GET: Read all notes belonging to logged-in user
noteRouter.get("/read", async (req, res) => {
    try {
        const notes = await noteModel.find({ userID: req.userID });
        res.send(notes);
    } catch (error) {
        res.send({ msg: "Something went wrong" });
    }
});

// GET: Read a particular note
noteRouter.get("/read/:id", async (req, res) => {
    try {
        const note = await noteModel.findOne({ _id: req.params.id, userID: req.userID });
        if (!note) return res.status(404).send({ msg: "Note not found" });
        res.send(note);
    } catch (error) {
        console.log(error);
        res.status(400).send({ msg: "Invalid note id" });
    }
});

// POST: Create a new note
noteRouter.post("/create", uploadImage, async (req, res) => {
    try {
        const payload = req.body;

        const newNote = new noteModel({
            title: payload.title,
            description: payload.description,
            userID: req.userID,
            image: req.file ? "/uploads/" + req.file.filename : ""
        });

        await newNote.save();

        res.send({ msg: "Note created successfully" });
    } catch (error) {
        console.log(error);
        res.send({ msg: "Something went wrong" });
    }
});

// PUT: Update a note (title, description, optional new image, optional removeImage)
noteRouter.put("/update/:id", uploadImage, async (req, res) => {
    try {
        const note = await noteModel.findOne({ _id: req.params.id, userID: req.userID });
        if (!note) return res.send({ msg: "Note not found" });

        const update = {
            title: req.body.title,
            description: req.body.description
        };

        if (req.file) {
            // new image picked: remove the old file, save the new path
            deleteImageFile(note.image);
            update.image = "/uploads/" + req.file.filename;
        } else if (req.body.removeImage === "true") {
            // user removed the image
            deleteImageFile(note.image);
            update.image = "";
        }

        await noteModel.findByIdAndUpdate(req.params.id, update);
        res.send({ msg: "Note updated successfully" });
    } catch (error) {
        console.log(error);
        res.send({ msg: "Something went wrong" });
    }
});

// DELETE: Delete a note
noteRouter.delete("/delete/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const deletedNote = await noteModel.findOneAndDelete({
            _id: id,
            userID: req.userID
        });

        if (!deletedNote) {
            return res.send({ msg: "Note not found" });
        }

        deleteImageFile(deletedNote.image);

        res.send({ msg: "Note deleted successfully" });
    } catch (error) {
        res.send({ msg: "Something went wrong" });
    }
});

module.exports = { noteRouter };