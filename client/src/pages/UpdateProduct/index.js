import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { cpp, c } from 'react-syntax-highlighter/dist/esm/languages/hljs';

SyntaxHighlighter.registerLanguage('cpp', cpp);
SyntaxHighlighter.registerLanguage('c', c);

function UpdateProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [error, setError] = useState(null);
    const [selectedStep, setSelectedStep] = useState("1");
    const [content, setContent] = useState([]);
    const [currentField, setCurrentField] = useState(null);
    const [formValue, setFormValue] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);  // Lưu index của phần tử đang chỉnh sửa
    console.log(content)
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

    const handleStepClick = (stepId) => setSelectedStep(stepId);

    const selectedStepData = useMemo(() => {
        return product?.steps?.find(step => step.id === selectedStep.toString()) || null;
    }, [product, selectedStep]);

    const handleInputChange = (e) => setFormValue(e.target.value);

    const handleSave = () => {
        console.log(content)
        if (currentField && formValue.trim()) {
            const newElement = {
                type: currentField,
                content: formValue.trim()
            };

            if (editingIndex !== null) {
                // Nếu đang chỉnh sửa, cập nhật phần tử đó trong mảng content
                const updatedContent = [...content];
                updatedContent[editingIndex] = newElement;
                setContent(updatedContent);
                setEditingIndex(null);  // Reset khi đã lưu chỉnh sửa
            } else {
                setContent(prevContent => [...prevContent, newElement]);
            }

            setFormValue('');
            setCurrentField(null);
        }
    };

    
    const handleDelete = (index) => {
        const updatedContent = content.filter((_, i) => i !== index);
        setContent(updatedContent);
    };

    const handleSubmit = async () => {
        if (content.length === 0) {
            alert('Please add content before submitting');
            return;
        }

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/product/${id}`, { content });
            alert('Product content updated successfully!');
            setProduct(response.data);
            setContent([]);
        } catch (error) {
            console.error('Error updating product content:', error);
            alert('Error updating product content: ' + (error.response?.data?.message || error.message));
        }
    };

    const renderProductContent = (content) => (
        <div className="mt-4">
            <h2>Product Content:</h2>
            <ul>
                {content.length > 0 ? (
                    content.map((item, index) => (
                        <li key={index}>
                            <div className="flex items-center justify-between">
                                {item.type === 'title' && <h3>{item.content}</h3>}
                                {item.type === 'description' && <p>{item.content}</p>}
                                {item.type === 'imageUrl' && <img src={item.content} alt="step" className="mt-4 w-6/12 h-full object-cover m-auto" />}
                                {item.type === 'code' && (
                                    <div className="mt-4">
                                        <SyntaxHighlighter language={item.language || 'c'} style={dracula}>
                                            {item.content}
                                        </SyntaxHighlighter>
                                    </div>
                                )}
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => handleDelete(index)} className="text-red-500 text-lg">X</button>
                                    <button onClick={() => { 
                                        setEditingIndex(index); 
                                        setFormValue(item.content); 
                                        setCurrentField(item.type);
                                    }} className="text-blue-500 text-lg">Update</button>
                                </div>
                            </div>
                        </li>
                    ))
                ) : (
                    <li>No content available</li>
                )}
            </ul>
        </div>
    );

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
            <div className='p-4'>
                <h3 className="mt-4 text-blue-500 text-2xl uppercase chakra-petch-bold-italic">{product.title}</h3>
                <p className="mt-2 text-gray-700">{product.description}</p>
                <div className='flex w-10/12 m-auto mt-8'>
                    {product.author?.avatar && (
                        <img src={product.author.avatar} className="w-12 h-12 object-cover transform -rotate-6 border-2" alt=""/>
                    )}
                    <div className='ml-6'>
                        <h1 className='text-xl uppercase font-bold chakra-petch-bold-italic tracking-wider'>
                            {product.author?.name} - {product.author?.nickname}
                        </h1>
                        <p className='text-left text-neutral-500 tracking-wider text-sm'>
                            {product.author?.description}
                        </p>
                    </div>
                </div>
            </div>

            <div className='w-full mx-auto flex'>
                <div className="w-9/12 p-4 mr-4 ml-4">
                    {selectedStepData ? (
                        <div className="mt-6 text-left">
                            {selectedStepData.content?.length > 0 ? (
                                selectedStepData.content.map((contentItem, index) => {
                                    switch (contentItem.type) {
                                        case 'title':
                                            return (
                                                <div key={index} className='relative border border-gray-300'>
                                                    <h3 className="text-xl font-semibold">{contentItem.content}</h3>
                                                    <span class="absolute top-0 right-0 text-red-500 text-xl cursor-pointer">×</span>
                                                </div>
                                            );
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

                <div className="w-3/12 p-4">
                    <ul className="text-left mt-4">
                        {product?.steps?.length > 0 ? (
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

            <div className="flex ml-8 mr-8">
                <div className="bg-yellow-500 w-9/12 mr-4 text-left p-4">
                    <div>
                        <button onClick={() => setCurrentField('title')} className="bg-white text-primary p-2 text-xl hover:bg-slate-400 duration-150 ease-linear mr-4">Add Title</button>
                        <button onClick={() => setCurrentField('description')} className="bg-white text-primary p-2 text-xl hover:bg-slate-400 duration-150 ease-linear mr-4">Add Description</button>
                        <button onClick={() => setCurrentField('imageUrl')} className="bg-white text-primary p-2 text-xl hover:bg-slate-400 duration-150 ease-linear mr-4">Add Image</button>
                        <button onClick={() => setCurrentField('code')} className="bg-white text-primary p-2 text-xl hover:bg-slate-400 duration-150 ease-linear">Add Code</button>
                    </div>

                    {currentField && (
                        <div className="mt-4">
                            <h3 className="font-bold">Enter {currentField.charAt(0).toUpperCase() + currentField.slice(1)}:</h3>
                            {currentField === 'code' ? (
                                <textarea
                                    value={formValue}
                                    onChange={handleInputChange}
                                    placeholder={`Enter ${currentField}`}
                                    className="w-full h-32 p-2 border rounded-md"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={formValue}
                                    onChange={handleInputChange}
                                    placeholder={`Enter ${currentField}`}
                                    className="w-full p-2 border rounded-md"
                                />
                            )}
                            <button onClick={handleSave} className="mt-4 bg-green-500 text-white p-2">Save</button>
                        </div>
                    )}

                    <div>
                        <h2>Added Content:</h2>
                        <ul>
                            {content.map((item, index) => (
                                <li key={index}>
                                    <div className="flex items-center justify-between">
                                        <strong>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}:</strong> {item.content}
                                        <div className="flex space-x-2">
                                            <button onClick={() => handleDelete(index)} className="text-red-500">X</button>
                                            <button onClick={() => {
                                                setEditingIndex(index);
                                                setFormValue(item.content);
                                                setCurrentField(item.type);
                                            }} className="text-blue-500">Update</button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button onClick={handleSubmit} className="mt-4 bg-blue-500 text-white p-2">Submit Product</button>
                </div>
            </div>
        </div>
    );
}

export default UpdateProduct;
