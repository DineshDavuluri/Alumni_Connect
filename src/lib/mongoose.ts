import mongoose from "mongoose";

const MONGODB_URI = 'mongodb+srv://DBUser:DBUser@mydb.nmkiusn.mongodb.net/?retryWrites=true&w=majority&appName=MyDB';
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is missing in environment variables");
}

export const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    console.log("MongoDB already connected");
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    console.log("MongoDB Connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("MongoDB connection failed");
  }
};
