const express = require("express");
const app = express();

app.use(express.json());

const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server running on port", port));
