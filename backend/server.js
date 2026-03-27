const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Read individual env vars (production style)
const {
    MONGO_USER,
    MONGO_PASS,
    MONGO_HOST = "mongo",
    MONGO_PORT = "27017",
    MONGO_DB = "mydb"
} = process.env;

// Build Mongo URI (fallback for local/dev)
let mongoURI;

if (MONGO_USER && MONGO_PASS) {
    mongoURI = `mongodb://${MONGO_USER}:${MONGO_PASS}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`;
} else {
    mongoURI = process.env.MONGO_URI || "mongodb://mongo:27017/mydb";
}
console.log("Using Mongo URI:", mongoURI); // DEBUG

mongoose.connect(mongoURI)
.then(() => {
    console.log("MongoDB connected");

    app.listen(5000, () => {
        console.log("Backend running on port 5000");
    });
})
.catch(err => console.log(err));

// Schema
const ItemSchema = new mongoose.Schema({
    name: String
});

const Item = mongoose.model("Item", ItemSchema);

// Routes
app.get("/items", async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

app.post("/items", async (req, res) => {
    const item = new Item({ name: req.body.name });
    await item.save();
    res.json(item);
});
