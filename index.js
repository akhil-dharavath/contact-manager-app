const express = require("express");
const cors = require('cors');
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");
const dotenv = require("dotenv").config();
const app = express();

connectDb();
const port = process.env.PORT || 5000;

// middlewares
app.use(express.json());
app.use(cors())
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("*", (req, res) => {
  res.status(404);
  throw new Error("Endpoint Not found");
});
app.use(errorHandler);

// server listening at port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
