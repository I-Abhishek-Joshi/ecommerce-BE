const Cart = require("../models/Cart");
const router = require("express").Router();

//CREATE

router.post("/", async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    console.log(err.message);
    res.status(500).json(err);
  }
});

//UPDATE

router.patch("/addToCart/:id", async (req, res) => {
  const newCartProduct = new Cart(req.body);

  try {
    const cartDetails = await Cart.findOne({ userId: req.params.id });

    // console.log('req body is', newCartProduct)
    const foundPosition = cartDetails.products.findIndex((product) => {
      return (
        product.product._id.toString() ===
          newCartProduct.products[0].product._id.toString() &&
        product.size === newCartProduct.products[0].size &&
        product.color === newCartProduct.products[0].color
      );
    });

    if (foundPosition === -1) {
      const newProductList = [
        ...cartDetails.products,
        newCartProduct.products[0],
      ];
      cartDetails.products = newProductList;
    } else {
      cartDetails.products[foundPosition].quantity +=
        newCartProduct.products[0].quantity;
    }
    const updatedCart = await cartDetails.save();
    return res.status(200).send(updatedCart);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

//DELETE
router.patch("/clearCart/:id", async (req, res) => {
  try {
    const cartDetails = await Cart.findOne({ userId: req.params.id });
    cartDetails.products = [];
    const updatedCart = await cartDetails.save();
    return res.status(200).send(updatedCart);
  } catch (err) {
    return res.status(500).send(err);
  }
});

//GET USER CART
router.get("/find/:userId", async (req, res) => {
  try {

    const temp = await Cart.findOne({ userId: req.params.userId });
    console.log(temp);
    const cart = await Cart.findOne({ userId: req.params.userId })
      .populate("products.product", "title description image price")
      .exec();
    return res.status(200).send(cart);
  } catch (err) {
    return res.status(500).send(err);
  }
});

module.exports = router;
