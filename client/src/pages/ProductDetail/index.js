import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs'; // Chọn theme
import { cpp, c } from 'react-syntax-highlighter/dist/esm/languages/hljs'; // Import ngôn ngữ C và C++

SyntaxHighlighter.registerLanguage('cpp', cpp); // Đăng ký ngôn ngữ C++
SyntaxHighlighter.registerLanguage('c', c); // Đăng ký ngôn ngữ C++

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [selectedStep, setSelectedStep] = useState("1"); // Bước mặc định là 1

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/${id}`);
                setProduct(response.data);
            } catch (err) {
                setError(`Lỗi khi tải chi tiết sản phẩm: ${err.message}`);
            }
        };

        fetchProduct();
    }, [id]);

    const handleStepClick = (stepId) => {
        setSelectedStep(stepId);
    };

    // Sử dụng useMemo để chỉ chọn dữ liệu của bước được chọn
    const selectedStepData = useMemo(() => {
        if (product?.steps) {
            return product.steps.find(step => step.id === selectedStep.toString()); // Đảm bảo so sánh đúng kiểu dữ liệu
        }
        return null;
    }, [product, selectedStep]);

    if (error) {
        return (
            <div className="w-full mx-auto mt-24">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (!product) {
        return <p className="text-center mt-24">Đang tải chi tiết sản phẩm...</p>;
    }

    return (
        <div className="w-full mx-auto mt-24 p-2 chakra-petch-regular-italic">
            {/* Khu vực nội dung chính */}
            <div className='p-4'>
                <h3 className="mt-4 text-blue-500 text-2xl uppercase chakra-petch-bold-italic">{product.title}</h3>
                <p className="mt-2 text-gray-700">{product.description}</p>
                <div className='flex w-10/12 m-auto mt-8'>
                    <img src={product.author.avatar} className="w-12 h-12 object-cover transform -rotate-6 border-2" alt=""/>
                    <div className='ml-6'>
                        <h1 className='text-xl uppercase font-bold chakra-petch-bold-italic tracking-wider'>{product.author.name} - {product.author.nickname}</h1>
                        <p className='text-left text-neutral-500 tracking-wider text-sm'>{product.author.description}</p>
                    </div>
                </div>
            </div>
            <div className='w-full mx-auto flex'>
                {/* Nội dung bước được chọn */}
                <div className="w-9/12 p-4 mr-4 ml-4">
                    {selectedStepData ? (
                        <div className="mt-6 text-left">
                            {selectedStepData.content && Array.isArray(selectedStepData.content) && selectedStepData.content.length > 0 ? (
                                selectedStepData.content.map((contentItem, index) => {
                                    switch (contentItem.type) {
                                        case 'title':
                                            return <h3 key={index} className="text-xl font-semibold">{contentItem.content}</h3>;
                                        case 'description':
                                            return <p key={index} className="mt-2 leading-7">{contentItem.content}</p>;
                                        case 'image_url':
                                            return <img key={index} src={contentItem.content} alt="step" className="mt-4 w-6/12 h-full object-cover m-auto" />;
                                        case 'list_text':
                                            return (
                                                <ul key={index} className="mt-2 list-disc pl-6">
                                                    {Array.isArray(contentItem.content) && contentItem.content.length > 0 ? (
                                                        contentItem.content.map((listItem, listIndex) => (
                                                            <li key={listIndex}>{listItem}</li>
                                                        ))
                                                    ) : (
                                                        <li>Không có danh sách nào.</li>
                                                    )}
                                                </ul>
                                            );
                                        case 'code':
                                            return (
                                                <div key={index} className="mt-4">
                                                    <SyntaxHighlighter language={contentItem.language || 'c'} style={dracula}>
                                                        {contentItem.content}
                                                    </SyntaxHighlighter>
                                                </div>
                                            );
                                        default:
                                            return null;
                                    }
                                })
                            ) : (
                                <p className="mt-4 text-gray-500">Không có nội dung cho bước này.</p>
                            )}
                        </div>
                    ) : (
                        <p className="mt-4 text-gray-500">Không có nội dung cho bước này.</p>
                    )}
                </div>

                {/* Thanh bên */}
                <div className="w-3/12 p-4">
                    <ul className="text-left mt-4">
                        {product?.steps && product.steps.length > 0 ? (
                            product.steps.map((item) => (
                                <li
                                    key={item.id}
                                    className={`p-4 border-b-2 rounded-sm font-bold cursor-pointer hover:bg-slate-500 duration-100 ease-linear ${item.id === selectedStep ? 'bg-slate-500' : ''}`}
                                    onClick={() => handleStepClick(item.id)}
                                >
                                    {item.id}. {item.title}
                                </li>
                            ))
                        ) : (
                            <li>Không có bước nào</li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail;
