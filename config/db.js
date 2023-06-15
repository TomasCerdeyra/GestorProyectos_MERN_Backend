import mongoose from "mongoose";

try {
    await mongoose.connect(process.env.MONGO_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    console.log('connect BD ok')
} catch (error) {
    console.log(error);
    console.log('Error de conexion DB');
}