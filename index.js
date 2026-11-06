const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");

const app = express();

/**************** EJS & Middleware Configuration ****************/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Serve static files (CSS, images) from public directory
app.use(express.static(path.join(__dirname, "public")));

// Parse incoming URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Override HTTP methods for PUT & DELETE support from HTML forms
app.use(methodOverride("_method"));

/**************** MongoDB Connection ****************/
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

main()
    .then(() => {
        console.log("MongoDB Connection Successful");
    })
    .catch((err) => console.log("MongoDB Connection Error:", err));

/**************** Express Server ****************/
app.listen(8080, () => {
    console.log("Server Is Listening on port 8080");
});

/**************** Routes ****************/

// 1. Home Route - Welcome Screen
app.get("/", (req, res) => {
    res.render("home.ejs");
});

// 2. Index Route - Show All Chats (Read)
app.get("/chats", async (req, res) => {
    try {
        let chaty = await Chat.find(); // fetch all chats from database
        res.render("index.ejs", { chaty });
    } catch (err) {
        console.log("Error fetching chats:", err);
        res.status(500).send("Error loading chats");
    }
});

// 3. New Route - Form to Create New Chat
app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
});

// 4. Create Route - Insert New Chat to Database (Create)
app.post("/chats", async (req, res) => {
    let { from, to, message } = req.body;
    let newchat = new Chat({
        from: from,
        to: to,
        message: message,
        created_at: new Date() // Fixed: corrected typo from 'creates_at' to 'created_at'
    });

    console.log("New chat to save:", newchat);

    try {
        // await ensures the chat is fully saved in MongoDB before redirecting
        await newchat.save();
        console.log("Chat saved successfully");
        res.redirect("/chats"); // Fixed: redirected to '/chats' instead of invalid '/home.ejs'
    } catch (err) {
        console.log("Error occur while save of newchat: " + err);
        res.redirect("/chats/new");
    }
});

// 5. Edit Route - Form to Edit an Existing Chat
app.get("/chats/:id/edit", async (req, res) => {
    try {
        let { id } = req.params;
        let nchat = await Chat.findById(id);
        if (!nchat) {
            return res.status(404).send("Chat not found");
        }
        res.render("edit.ejs", { nchat });
    } catch (err) {
        console.log("Error finding chat to edit:", err);
        res.redirect("/chats");
    }
});

// 6. Update Route - Update Chat Message in Database (Update)
app.put("/chats/:id", async (req, res) => {
    try {
        let { id } = req.params;
        let { message } = req.body;

        let updatedchat = await Chat.findByIdAndUpdate(
            id,
            { message: message },
            { new: true, runValidators: true }
        );

        console.log("Updated Chat:", updatedchat);
        res.redirect("/chats");
    } catch (err) {
        console.log("Error updating chat:", err);
        res.redirect("/chats");
    }
});

// 7. Destroy Route - Delete Chat from Database (Delete)
app.delete("/chats/:id", async (req, res) => {
    try {
        let { id } = req.params;
        // await ensures the document is deleted before we redirect back to /chats
        await Chat.findByIdAndDelete(id);
        console.log("Deleted Successfully");
    } catch (err) {
        console.log("Error deleting chat:", err);
    }
    res.redirect("/chats");
});
