const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");

dotenv.config();
const PORT = process.env.PORT || 3000;

const DB = process.env.DATABASE.replace("<password>", process.env.PASSWORD);

mongoose.connect(DB).then(() => {
  console.log("Database connected");
});

app.listen(PORT, () => {
  console.log("Server is running in port " + PORT);
});
