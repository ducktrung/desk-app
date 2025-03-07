const express = require('express');
const router = express.Router();
const { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } = require('../controllers/ProductsController');

// API lấy tất cả sản phẩm
router.get('/products', getAllProducts);

// API lấy sản phẩm theo id
router.get('/product/:id', getProductById);

// API thêm mới sản phẩm
router.post('/product', addProduct);

// API cập nhật sản phẩm
router.put('/product/:id', updateProduct);

// API xóa sản phẩm
router.delete('/product/:id', deleteProduct);

module.exports = router;
