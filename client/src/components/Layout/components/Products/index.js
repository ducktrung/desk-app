import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import VanillaTilt from 'vanilla-tilt';
import { Link } from 'react-router-dom';



function Products() {

    // Client Variable
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    // Sử dụng useRef cho mỗi phần tử sản phẩm
    const tiltRefs = useRef([]);

    useEffect(() => {
        // Lấy dữ liệu từ API
        axios.get(`${process.env.REACT_APP_API_URL}/api/products`)
            .then((res) => {
                setProducts(res.data);
            })
            .catch((err) => {
                setError(err.message);
            });
    }, []);

    useEffect(() => {
        const tiltElements = tiltRefs.current;
        // Chỉ gọi VanillaTilt.init khi sản phẩm đã được load và phần tử DOM có mặt
        if (products.length > 0) {
            tiltElements.forEach((ref) => {
                if (ref) {
                    VanillaTilt.init(ref, {
                        max: 25,
                        speed: 400,
                        glare: true,
                        "max-glare": 0.5
                    });
                }
            });
        }

        // Cleanup khi component unmount hoặc khi products thay đổi
        return () => {
            tiltElements.forEach((ref) => {
                if (ref && ref.vanillaTilt) {
                    ref.vanillaTilt.destroy();
                }
            });
        };
    }, [products]); // Chạy lại mỗi khi products thay đổi

    if (error) {
        return <p>Error loading products: {error}</p>;
    }

    if (products.length === 0) {
        return <p>No products available</p>;
    }

    return (
        <div>
            <h2 className="text-left text-2xl font-bold mb-4">Products</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {products.map((product, index) => (
                    <Link 
                    to={`/productdetail/${product._id}`} 
                    key={product._id}
                    ref={(el) => tiltRefs.current[index] = el} // Thêm ref vào thẻ Link
                    className="bg-zinc-800 shadow-lg overflow-hidden rounded-xl cursor-pointer"
                  >
                    <div
                      style={{
                        background: `linear-gradient(#fff0 0%, #fff0 70%, #1d1d1d 100%), url(${product.image_url})`,
                        borderTopLeftRadius: '15px',
                        borderTopRightRadius: '15px',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        paddingBottom: '8.75rem'
                      }}
                    ></div>
                    <div className="p-4 text-justify">
                      <p className="text-red-600 text-sm">1 day ago</p>
                      <h2 className="font-bold text-xl text-wrap text-left line-clamp-1 mb-4">
                        {product.title}
                      </h2>
                      <p className="line-clamp-3 text-gray-500 text-sm">
                        {product.description}
                      </p>
                    </div>
                  </Link>
                ))}
            </ul>
        </div>
    );
}

export default Products;
