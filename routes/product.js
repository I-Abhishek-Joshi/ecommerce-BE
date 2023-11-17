const Product = require("../models/Product");


const { filterProducts } = require("../utils/productUtils");
const {
  verifyTokenAndAdmin,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE
router.post("/", async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    return res.status(200).send(savedProduct);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(err);
  }
});

//UPDATE
router.put("/:id", async (req, res) => {
  console.log(req.body);
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(200).send(updatedProduct);
  } catch (err) {
    console.log(err.message);
    return res.status(500).send(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).send("Product has been deleted...");
  } catch (err) {
    return res.status(500).send(err);
  }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    return res.status(200).send(product);
  } catch (err) {
    return res.status(500).send(err);
  }
});

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const params = req.query;

  const category = params.category;
  const color = params.color;
  const size = params.size;
  const sort = params.sort;
  const search = params.search;

  const searchQuery = {}
  const sortQuery = {}

  if (search) {
    searchQuery.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { category: {$elemMatch: { $eq: search }} }
    ];
  }


  if(sort) {
    switch (sort) {
      case 'newest' :
        sortQuery.createdAt = -1;
        break;
      case 'increasing' :
        sortQuery.price = 1;
        break;
      case 'decreasing' :
        sortQuery.price = -1;
        break;
      default:
        sortQuery = { }
        break;
    }
  }

  try {
    const products = await Product.find(searchQuery).sort(sortQuery);

    // filter products 
    
    const response = filterProducts({products, category, color, size});
    return res.status(200).send(response);

  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;