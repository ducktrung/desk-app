    import React, { useState, useEffect, useRef } from 'react';
    import axios from 'axios';
    import VanillaTilt from 'vanilla-tilt';
    import { Link, useNavigate } from 'react-router-dom';

    function Products() {
        const [products, setProducts] = useState([]);
        const [error, setError] = useState(null);
        const [formVisible, setFormVisible] = useState(false); // Quản lý hiển thị form
        const [newProduct, setNewProduct] = useState({
            title: '',
            description: '',
            image_url: '',
            steps: []
        });
        const navigate = useNavigate();

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

            return () => {
                tiltElements.forEach((ref) => {
                    if (ref && ref.vanillaTilt) {
                        ref.vanillaTilt.destroy();
                    }
                });
            };
        }, [products]);

        if (error) {
            return <p>Error loading products: {error}</p>;
        }

        if (products.length === 0) {
            return <p>No products available</p>;
        }

        // Hàm để mở form thêm sản phẩm
        const handleAddProduct = () => {
            setFormVisible(true);
        };

        // Hàm để đóng form thêm sản phẩm
        const handleCloseForm = () => {
            setFormVisible(false);
            setNewProduct({
                title: '',
                description: '',
                image_url: '',
                steps: []
            });
        };

        // Hàm để thay đổi giá trị input trong form
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setNewProduct((prev) => ({
                ...prev,
                [name]: value
            }));
        };

        // Hàm để lưu sản phẩm mới
        const handleSaveProduct = () => {
            const { title, description, image_url } = newProduct;
            const author = {
                name: "Nguyen Duc Trung",
                age: "19",
                avatar: "https://scontent.fhan15-1.fna.fbcdn.net/v/t39.30808-6/474476930_2015974832254323_4612401693157653202_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=96EiUULxDeMQ7kNvgHXCEz7&_nc_zt=23&_nc_ht=scontent.fhan15-1.fna&_nc_gid=AUnLT2yLGl3jbFf7mTsopKI&oh=00_AYBX3Yp6Dk6w8nDflPrLmB8qX88zTgwmvmg5IQKKW5a0WQ&oe=679C14F2",
                nickname: "SHIN",
                description: "I'm Developer IoT"
            };
            // Kiểm tra dữ liệu đầu vào
            if (!title || !description || !image_url) {
                setError('All fields are required');
                return;
            }
        
            console.log("Sending data to server:", newProduct); // Log dữ liệu gửi đi
        
            axios.post(`${process.env.REACT_APP_API_URL}/api/product`, { ...newProduct, author })
                .then((res) => {
                    setProducts((prevProducts) => [...prevProducts, res.data]);
                    setFormVisible(false);
                    setNewProduct({ title: '', description: '', image_url: '', steps: [] });
                    navigate(`/admin/updateproduct/${res.data._id}`);
                })
                .catch((err) => {
                    setError('Failed to add product: ' + err.message);
                });
        };
        

        return (
            <div>
                <h2 className="text-left text-2xl font-bold mb-4">Products</h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {products.map((product, index) => (
                        <Link 
                            to={`/admin/updateproduct/${product._id}`} 
                            key={product._id}
                            ref={(el) => tiltRefs.current[index] = el}
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
                    <button 
                        className="w-full bg-white text-primary rounded-sm p-4 hover:bg-slate-300 duration-100 ease-linear"
                        onClick={handleAddProduct}
                    >
                        Add Product
                    </button>
                </ul>

                {/* Form thêm sản phẩm */}
                {formVisible && (
                    <div className="w-screen h-screen bg-white fixed top-0 left-0 flex items-center justify-center bg-opacity-50 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-black text-left">
                            <h3 className="text-xl font-bold mb-4">Add New Product</h3>
                            <div>
                                <label className="block mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={newProduct.title}
                                    onChange={handleInputChange}
                                    className="border p-2 mb-4 w-full text-white"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Description</label>
                                <textarea
                                    name="description"
                                    value={newProduct.description}
                                    onChange={handleInputChange}
                                    className="border p-2 mb-4 w-full text-white"
                                />
                            </div>
                            <div>
                                <label className="block mb-2 ">Image URL</label>
                                <input
                                    type="text"
                                    name="image_url"
                                    value={newProduct.image_url}
                                    onChange={handleInputChange}
                                    className="border p-2 mb-4 w-full text-white"
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    onClick={handleCloseForm}
                                    className="bg-gray-500 text-white py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveProduct}
                                    className="bg-blue-500 text-white py-2 px-4 rounded"
                                >
                                    Create
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    export default Products;
