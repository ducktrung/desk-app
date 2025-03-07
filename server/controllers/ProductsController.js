const Product = require('../model/product');
const axios = require('axios');
const cheerio = require('cheerio');


const getAllProducts = async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ message: "Lỗi khi lấy dữ liệu sản phẩm", error: error.message });
    }
  };


// Lấy chi tiết sản phẩm theo id
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




const addProduct = async (req, res) => {
    try {
        const { title, description, image_url, author, steps } = req.body
        const newProduct = new Product({ title, description, image_url, author, steps });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Sửa sản phẩm
// Cập nhật sản phẩm với nội dung mới
const updateProduct = async (req, res) => {
    try {
        const { content } = req.body; // Lấy content từ request body

        // Kiểm tra xem sản phẩm có tồn tại không
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Nếu có content, cập nhật content mới vào sản phẩm
        if (content && content.length > 0) {
            product.content = [...product.content, ...content]; // Thêm vào content hiện tại
        }

        // Lưu lại sản phẩm
        await product.save();
        return res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
};


// Xóa sản phẩm
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct };
