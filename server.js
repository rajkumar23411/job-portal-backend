import app from "./app.js";
import connectDatabase from "./db.connection.js";

const port = process.env.PORT || 5670;

// database connection
connectDatabase();

// app port
app.listen(port, () => console.log(`Server running on port ${port}`));
