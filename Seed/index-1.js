const mongoose = require("mongoose");
const Data = require("./MOCK_DATA.js");
const ProductModel = require("../Model/Product");
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/PlotLine-Assignment", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
      type: 'serive',
      price: Data[i].price,
    });
    await product.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
