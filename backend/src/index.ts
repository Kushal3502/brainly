import dotenv from "dotenv";
import app from "./app";
import connectDB from "./db";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT;

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERROR :: ", error);
    });

    app.listen(port, () => {
      console.log(`Server is running on port :: ${port}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection error :: ", error);
  });
