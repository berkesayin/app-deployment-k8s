// import mongoose from "mongoose";

// const PORT = 3001;

// export const connectDB = async () => {
//   console.log(`ConnectDB => Server is running on port ${PORT}`);
//   try {
//     await mongoose.connect("mongodb://mongodb:27017/users", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("ConnectDB => Successfully connected to MongoDB");
//   } catch (err) {
//     console.error("Error connecting to MongoDB:", err.message);
//   }
// };

// import mongoose from "mongoose";

// export const connectDB = async () => {
//   const PORT = 27017; // Assuming this is the port for MongoDB
//   console.log(`ConnectDB => Server is running on port ${PORT}`);
//   try {
//     await mongoose.connect("mongodb://mongodb:27017/users", {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     } as any); // Use type assertion here
//     console.log("ConnectDB => Successfully connected to MongoDB");
//   } catch (err) {
//     console.error("Error connecting to MongoDB:", err.message);
//   }
// };

import mongoose, { ConnectOptions } from "mongoose";

// Define custom type for MongoDB connection options
interface MongoDBOptions extends ConnectOptions {
  useNewUrlParser: boolean;
  useUnifiedTopology: boolean;
}

export const connectDB = async () => {
  const PORT = 27017; // Assuming this is the port for MongoDB
  console.log(`ConnectDB => Server is running on port ${PORT}`);
  try {
    const options: MongoDBOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    await mongoose.connect("mongodb://mongodb:27017/users", options);
    console.log("ConnectDB => Successfully connected to MongoDB");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
  }
};
