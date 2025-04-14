// require("dotenv").config();
const express = require("express");
const serverless = require('serverless-http');
// const cartRoutes = require("./routes/cartRoutes");
// const orderRoutes = require("./routes/orderRoutes");
// const productRoutes = require("./routes/productRoutes");
// const reportRoutes = require("./routes/reportRoutes");
// const authRoutes = require("./routes/authRoutes");
// const auth = require("./middleware/auth");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Swagger documentation route
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/cart", auth, cartRoutes);
// app.use("/api/orders", auth, orderRoutes);
// app.use("/api/products", auth, productRoutes);
// app.use("/api/reports", auth, reportRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

module.exports.handler = serverless(app);