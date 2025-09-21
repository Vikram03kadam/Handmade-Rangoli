import React, { useState, useMemo, useRef, useEffect } from 'react';
import PeacockDesignSmall from './assets/PeacockDesign.jpeg';
import BigSwastikFlower from './assets/BigSwastikFlower.jpeg';
import SmallStarFlower from './assets/SmallStarFlower.jpeg';
import LargeRedYellow8PetalFlower from './assets/LargeRed&Yellow8PetalFlower1.jpeg';
import WelcomeDoorMat from './assets/WelcomeDoorMat.jpeg';
import PecockDesignLarge from './assets/GrandPeacockLArge.jpeg';
import PeacockSmall from './assets/PeacockSmall.jpeg';
import FlowerStairMatsSet from './assets/FlowerStairMatsSet.jpeg';
import KalashDesign from './assets/KalashDesign.jpeg';
import ToranDesign from './assets/ToranDesign.jpeg';
import RoundFlowerRangoli from './assets/RoundFlowerRangoli.jpeg';
import StarShapedRangoli from './assets/Star-shapedrangoli.jpeg';
import LotusDesign  from './assets/LotusDesign.jpeg';
import './index.css';

const App = () => {
    // Product data moved to a separate file or outside the component for better practice
    const initialProducts = [
        { id: '1', name: 'Kalash Design', price: 250, imageUrl: KalashDesign, description: 'Auspicious Kalash rangoli with Swastik, coconut, and mango leaves.' },
        { id: '2', name: 'Toran Design', price: 350, imageUrl: ToranDesign, description: 'Traditional toran with Lord face, and golden bells for Navratri festive decoration.' },
                { id: '12', name: 'Lotus Design', price: 150, imageUrl: LotusDesign, description: 'Lotus Flower Design for Navratri festive decoration.' },

        { id: '11', name: 'Round Flower Rangoli', price: 1600, imageUrl: RoundFlowerRangoli, description: '3*3 feet Vibrant circular rangoli with multi-colored layered petals and a bright floral center.' },
        { id: '12', name: 'Star shaped rangoli', price: 150, imageUrl: StarShapedRangoli, description: 'Star-shaped rangoli with white and yellow florets, outlined with magenta petals and a circular center.' },
        { id: '3', name: 'Small Star Flower', price: 150, imageUrl: SmallStarFlower, description: 'A beautiful flower with Swastick.' },
        { id: '4', name: 'Big Swastik Flower', price: 300, imageUrl: BigSwastikFlower, description: 'A vibrant flower with beautiful orange and white petals.' },
        { id: '5', name: 'Large Red & Yellow 8-Petal Flower', price: 300, imageUrl: LargeRedYellow8PetalFlower, description: 'A large, bold flower that makes a statement.' },
        { id: '6', name: 'Welcome ("सुस्वागतम्") Door Mat', price: 700, imageUrl: WelcomeDoorMat, description: 'A traditional "Welcome" mat for your doorstep.' },
        { id: '7', name: 'Peacock Design (large)', price: 650, imageUrl: PeacockDesignSmall, description: 'An elegant peacock design, perfect for smaller spaces.' },
        { id: '8', name: 'Grand Peacock Rangoli (large)', price: 650, imageUrl: PecockDesignLarge, description: 'A grand and detailed peacock rangoli to impress your guests.' },
        { id: '9', name: 'Peacock (Small)', price: 550, imageUrl: PeacockSmall, description: 'A unique mandala design with a peacock at its center.' },
        { id: '10', name: 'Flower Stair Mats (Set)', price: 700, imageUrl: FlowerStairMatsSet, description: 'A set of multiple flower mats for decorating your stairs.' },
    ];

    const [products] = useState(initialProducts);
    const [formData, setFormData] = useState({
        name: '',
        whatsapp: '',
        address: '',
        orders: {},
    });

    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState('');
    const [submissionStatus, setSubmissionStatus] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const orderFormRef = useRef(null);

    useEffect(() => {
        const hasItems = Object.values(formData.orders).some(qty => qty > 0);
        if (hasItems && orderFormRef.current) {
            orderFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
    }, [formData.orders]);

    const handleQuantityChange = (productId, quantity) => {
        const normalized = quantity === '' ? 0 : Math.max(0, parseInt(quantity || "0", 10));
        setFormData(prevData => {
            const newOrders = { ...prevData.orders };
            if (normalized > 0) {
                newOrders[productId] = normalized;
            } else {
                delete newOrders[productId];
            }
            return {
                ...prevData,
                orders: newOrders,
            };
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const totalPrice = useMemo(() => {
        return Object.entries(formData.orders).reduce((total, [id, quantity]) => {
            if (!quantity) return total;
            const product = products.find(p => p.id === id);
            return total + (product.price * quantity);
        }, 0);
    }, [formData.orders, products]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const orderedItems = Object.entries(formData.orders)
            .filter(([, quantity]) => quantity)
            .map(([id, quantity]) => {
                const product = products.find(p => p.id === id);
                return `${product.name} (₹${product.price}) - Quantity: ${quantity}`;
            }).join('\n');

        const payload = {
            name: formData.name,
            whatsapp: formData.whatsapp,
            address: formData.address,
            order_summary: orderedItems || 'No items selected',
            total_price: `₹${totalPrice}`,
        };

        try {
            const response = await fetch("https://formspree.io/f/xblavqrv", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                setSubmissionStatus('success');
                setShowImageModal(true); // You had showImageModal, but let's use a new state for the success modal.
                setFormData({
                    name: '',
                    whatsapp: '',
                    address: '',
                    orders: {},
                });
            } else {
                setSubmissionStatus('error');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmissionStatus('error');
        }
    };

    const handleWhatsAppClick = () => {
        const orderedItems = Object.entries(formData.orders)
            .filter(([, quantity]) => quantity)
            .map(([id, quantity]) => {
                const product = products.find(p => p.id === id);
                return `* ${product.name} - Qty: ${quantity} (₹${product.price})*`;
            }).join('\n');

        const message = `Hello, my name is ${formData.name} and I would like to place an order.\n\nHere is my order summary:\n${orderedItems || 'No items selected'}\n\n*Total Price: ₹${totalPrice}*\n\n*Address:*\n${formData.address}\n`;
        const whatsappNumber = "919769500899";
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        const whatsappUrl = isMobile
            ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
            : `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    const handleImageClick = (imageUrl) => {
        setSelectedImage(imageUrl);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedImage('');
    };

    const isFormValid = formData.name && formData.whatsapp && formData.address && Object.values(formData.orders).some(qty => qty > 0);
    const hasItemsInCart = Object.values(formData.orders).some(qty => qty > 0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center p-4 font-sans">
            <div className="max-w-4xl w-full bg-white shadow-2xl rounded-3xl p-6 sm:p-12 my-8 border-4 border-pink-200">
                <header className="text-center mb-10">
                    <h1 className="text-5xl font-extrabold text-pink-700 leading-tight tracking-wide sm:text-6xl animate-fade-in">
                        <span role="img" aria-label="sparkles" className="mr-2">✨</span> Om Sai  Rangoli Creations <span role="img" aria-label="sparkles" className="ml-2">✨</span>
                    </h1>
                    <p className="mt-4 text-lg text-purple-600 font-medium">
                        Celebrate with our stunning, reusable Rangoli mats. Perfect for every festive occasion! 🏡
                    </p>
                    <p className="mt-2 text-md text-gray-500 font-small">
                        Sanjana Kodag's Creations | Contact: +91 9769500899
                    </p>
                </header>

                <main className="flex flex-col gap-16">
                    {/* Product Listing Section */}
                    <section className="product-list-section">
                        <h2 className="text-3xl font-bold text-pink-600 mb-6 border-b-4 border-pink-300 pb-2">Our Collection</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {products.map(product => (
                                <div key={product.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                                    <div
                                        onClick={() => handleImageClick(product.imageUrl)}
                                        className="cursor-pointer overflow-hidden relative"
                                    >
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-500 rounded-t-xl"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="text-white text-sm font-semibold p-2 bg-black bg-opacity-50 rounded-full">Click to View</span>
                                        </div>
                                    </div>
                                    <div className="p-4 text-center">
                                        <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
                                        <p className="text-gray-500 text-sm mt-1">{product.description}</p>
                                        <div className="flex items-center justify-between mt-3">
                                            <span className="font-bold text-2xl text-purple-600">₹{product.price}</span>
                                            <div className="flex items-center space-x-2">
                                                <label htmlFor={`qty-${product.id}`} className="text-sm font-medium text-gray-700">Qty:</label>
                                                <input
                                                    id={`qty-${product.id}`}
                                                    type="number"
                                                    min="0"
                                                    value={formData.orders[product.id] || ''}
                                                    onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                    className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Order Form Section - ONLY SHOWS if items are selected */}
                    {hasItemsInCart && (
                        <section ref={orderFormRef} className="order-form-section">
                            <h2 className="text-3xl font-bold text-pink-600 mb-6 border-b-4 border-pink-300 pb-2">Place Your Order</h2>
                            <div className="bg-purple-50 p-6 rounded-2xl mb-8 border border-purple-200 shadow-inner">
                                <h3 className="text-xl font-bold text-purple-800 mb-4">Your Order Summary</h3>
                                <div className="space-y-2 text-sm text-gray-700">
                                    {Object.entries(formData.orders).map(([id, quantity]) => {
                                        if (!quantity) return null;
                                        const product = products.find(p => p.id === id);
                                        return (
                                            <div key={id} className="flex justify-between items-center py-1 border-b border-purple-100 last:border-b-0">
                                                <span>{product.name} <span className="text-gray-400">x {quantity}</span></span>
                                                <span className="font-semibold text-purple-700">₹{product.price * quantity}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="border-t border-purple-300 mt-4 pt-4 flex justify-between items-center">
                                    <span className="text-xl font-bold text-purple-900">Total Price</span>
                                    <span className="text-3xl font-extrabold text-purple-900">₹{totalPrice}</span>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="order-form space-y-6">
                                <input type="text" name="name" placeholder="Your Full Name" value={formData.name} onChange={handleInputChange} required className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow" />
                                <input type="tel" name="whatsapp" placeholder="Your WhatsApp Number" value={formData.whatsapp} onChange={handleInputChange} required className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow" />
                                <textarea name="address" placeholder="Full Delivery Address (including Pincode)" value={formData.address} onChange={handleInputChange} required rows="4" className="w-full px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow" />
                                
                                <div className="space-y-4">
                                    <button
                                        type="submit"
                                        disabled={!isFormValid}
                                        className="w-full px-6 py-4 bg-pink-500 text-white font-bold rounded-xl shadow-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            Submit Order
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleWhatsAppClick}
                                        disabled={!isFormValid}
                                        className="w-full px-6 py-4 bg-green-500 text-white font-bold rounded-xl shadow-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
                                    >
                                        <span className="flex items-center justify-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.459L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                                            WhatsApp Your Order
                                        </span>
                                    </button>
                                </div>
                            </form>
                            
                            {submissionStatus === 'success' && (
                                <p className="mt-6 text-center text-green-600 font-bold animate-fade-in">
                                    🎉 Thank you! We've received your order and will contact you on WhatsApp shortly.
                                </p>
                            )}
                            {submissionStatus === 'error' && (
                                <p className="mt-6 text-center text-red-600 font-bold animate-fade-in">
                                    ⚠️ There was an error placing your order. Please try again or WhatsApp us directly.
                                </p>
                            )}
                        </section>
                    )}
                </main>

                <footer className="text-center mt-12 pt-6 border-t border-gray-200 text-gray-500 text-sm">
                    <p>Questions? Contact us on WhatsApp: +91 9769500899</p>
                </footer>
            </div>

            {/* Large Image View Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center p-4 z-50 animate-fade-in"
                    onClick={handleCloseModal}
                >
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <img
                            src={selectedImage}
                            alt="Large product view"
                            className="max-w-full max-h-[90vh] rounded-xl shadow-2xl transform animate-scale-in"
                        />
                        <button
                            onClick={handleCloseModal}
                            className="absolute -top-4 -right-4 text-white text-4xl font-bold bg-gray-800 rounded-full w-10 h-10 flex items-center justify-center leading-none hover:bg-gray-700 transition-colors"
                            aria-label="Close"
                        >
                            &times;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default App;