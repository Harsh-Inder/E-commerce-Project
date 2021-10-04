const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Product = require('../models/product');
const {isLoggedIn} = require('../middleware')

// Adding item in the cart
router.post('/cart/:productid/add', isLoggedIn,  async function (req, res) {

    const { productid } = req.params;

    const product = await Product.findById(productid);

    const currentUser= req.user;

    currentUser.cart.push(product);

    await currentUser.save();

    req.flash('success','Item added to your cart successfully');
    res.redirect(`/products/${productid}`);
});


// displaying items in the cart
router.get('/user/cart', isLoggedIn, async (req, res) => {

    const userid= req.user._id;

    const user = await User.findById(userid).populate('cart');

    res.render('cart/userCart', {user});

})


// remove item from the cart
router.delete('/cart/:id/remove', isLoggedIn,  async function(req, res) {

    const productid = req.params.id;
    const userid = req.user._id;

    await User.findByIdAndUpdate(userid ,{$pull:{cart:productid}})

    res.redirect('/user/cart');
})














module.exports = router;


