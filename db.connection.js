import mongoose from "mongoose";

const connectDatabase = () => {
    mongoose
        .connect(process.env.MONGODB_URL)
        .then((data) =>
            console.log(
                `MongoDB is connected with server: ${data.connection.host}`
            )
        )
        .catch((error) =>
            console.log(`Could not connect to database with error: ${error}`)
        );
};

export default connectDatabase;
