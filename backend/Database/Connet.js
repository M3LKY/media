import mongoose from "mongoose";

const Connet = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // to avoid warning in the console

      useUnifiedTopology: true,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default Connet;
