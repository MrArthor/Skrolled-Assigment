const mongoose = require("mongoose");
const Data = require("./MOCK_DATA.js");
const ProductModel = require("../Model/Product");
mongoose.set("strictQuery", false);

const URL =  "mongodb+srv://qwert:vanshsachdeva@cluster0.7zuhob5.mongodb.net/PlotLine?retryWrites=true&w=majority";


const connectDB = async () => {
  try {
    await mongoose.connect(URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });

          console.log("Database connected");
  } catch (error) {
    console.log("error", error);
  }
};
connectDB();

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await ProductModel.deleteMany({});
  mongoose.set("strictQuery", true);

  for (let i = 0; i < 10; i++) {
    const product = new ProductModel({
      name: Data[i].productname,
      type: 'Product',
      price: Data[i].price,
    });
    await product.save();
  }for (let i = 10; i < 20; i++) {
    const product = new ProductModel({
      name: Data[i].productname,
      type: 'service',
      price: Data[i].price,
    });
    await product.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
