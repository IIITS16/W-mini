
const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
    console.log("MongoDB Connection Successful");

    let allchats = [
        {
            from: "Mohak",
            to: "Akshat",
            message: "Aja party ha kal",
            created_at: new Date()
        },
        {
            from: "Rahul",
            to: "Mohak",
            message: "Assignment complete kar liya?",
            created_at: new Date()
        },
        {
            from: "Akshat",
            to: "Nishant",
            message: "Bhai kaha hai tu?",
            created_at: new Date()
        },
        {
            from: "Nishant",
            to: "Mohak",
            message: "Kal college chalna hai",
            created_at: new Date()
        },
        {
            from: "Mohak",
            to: "Rahul",
            message: "Leetcode question solve hua?",
            created_at: new Date()
        },
        {
            from: "Priya",
            to: "Akshat",
            message: "Notes bhej dena please",
            created_at: new Date()
        },
        {
            from: "Rahul",
            to: "Nishant",
            message: "Cricket khelenge sham ko?",
            created_at: new Date()
        },
        {
            from: "Akshat",
            to: "Mohak",
            message: "MongoDB seekh raha hai kya?",
            created_at: new Date()
        },
        {
            from: "Nishant",
            to: "Rahul",
            message: "Kal test hai ya nahi?",
            created_at: new Date()
        },
        {
            from: "Priya",
            to: "Mohak",
            message: "Project ka update dena",
            created_at: new Date()
        }
    ];

    await Chat.insertMany(allchats);

    console.log("All chats inserted successfully!");

    await mongoose.connection.close();
}

main().catch(err => console.log(err));
