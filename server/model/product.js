const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        name: String,
        age: String,
        nickname: String,
        avatar: String,
        description: String
    },
    image_url: {
        type: String,
        require: true
    },
    steps: [
        {
            id: {type: String, required: true},
            title: {type: String, required: true},
            content: [
                {
                    type: {
                        type: String, // 'title', 'description', 'imageUrl', 'videoUrl'
                        required: true
                    },
                    content: {
                        type: mongoose.Schema.Types.Mixed, // Nội dung thực tế của phần tử (text, URL, v.v.)
                        required: true
                    }
                }
            ]
        }
    ]
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
