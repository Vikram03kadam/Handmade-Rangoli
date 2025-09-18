
import React, { useState, useMemo } from 'react';

import PeacockDesignSmall from './assets/PeacockDesign.jpeg';
import BigSwastikFlower from './assets/BigSwastikFlower.jpeg';
import SmallStarFlower from './assets/SmallStarFlower.jpeg';
import LargeRedYellow8PetalFlower from './assets/LargeRed&Yellow8PetalFlower1.jpeg';
import WelcomeDoorMat from './assets/WelcomeDoorMat.jpeg';
import PecockDesignLarge from './assets/GrandPeacockLArge.jpeg';
// import ssm from "./assets/ssm.jpeg"/;
import PeacockSmall from './assets/PeacockSmall.jpeg';
import FlowerStairMatsSet from './assets/FlowerStairMatsSet.jpeg';
import './index.css' // Tailwind CSS styles (ensure Tailwind is set up in your project  




// Main component for the Rangoli Order Form Application
const App = () => { 
  // Static product data
  const initialProducts = [
    { id: '1', name: 'Small Star Flower', price: 150, imageUrl: SmallStarFlower, description: 'A beautiful flower with Swastick .' },
    { id: '2', name: 'Big Swastik Flower', price: 300, imageUrl: BigSwastikFlower, description: 'A vibrant flower with beautiful orange and white petals.' },

    { id: '3', name: 'Large Red & Yellow 8-Petal Flower', price: 300, imageUrl: LargeRedYellow8PetalFlower, description: 'A large, bold flower that makes a statement.' },
    { id: '4', name: 'Welcome ("सुस्वागतम्") Door Mat', price: 400, imageUrl: WelcomeDoorMat , description: 'A traditional "Welcome" mat for your doorstep.' },
    { id: '5', name: 'Peacock Design (large)', price: 650, imageUrl: PeacockDesignSmall, description: 'An elegant peacock design, perfect for smaller spaces.' },
    { id: '6', name: 'Grand Peacock Rangoli (large)', price: 650, imageUrl: PecockDesignLarge, description: 'A grand and detailed peacock rangoli to impress your guests.' },
    { id: '7', name: 'Peacock (Small)', price: 550, imageUrl: PeacockSmall, description: 'A unique mandala design with a peacock at its center.' },
    { id: '8', name: 'Flower Stair Mats (Set)', price: 700, imageUrl: FlowerStairMatsSet, description: 'A set of multiple flower mats for decorating your stairs.' },
  ];

  // State for the list of products
  const [products] = useState(initialProducts);
  
  // State for the form data
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    address: '',
    orders: {}, // Stores product quantities by product ID
  });
  // State for the image modal
const [showImageModal, setShowImageModal] = useState(false);
const [selectedImage, setSelectedImage] = useState('');

// New state for the success modal
const [showSuccessModal, setShowSuccessModal] = useState(false);

  // State to track the form submission status ('success', 'error', or null)
  const [submissionStatus, setSubmissionStatus] = useState(null);
  
  // State for the image modal
const [showModal, setShowModal] = useState(false);
// Removed duplicate declaration of selectedImage state

  // Handles changes in product quantity
  // Handles changes in product quantity (fixed version)
const handleQuantityChange = (productId, quantity) => {
  // Convert string → integer, remove leading zeros, ensure minimum 0
  const normalized = Math.max(0, parseInt(quantity || "0", 10));

  setFormData(prevData => ({
    ...prevData,
    orders: {
      ...prevData.orders,
      // If greater than 0, keep it, else remove
      [productId]: normalized > 0 ? normalized : undefined,
    },
  }));
};


  // Handles changes in text inputs (name, whatsapp, address)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  // Calculate total price memoized for performance
  const totalPrice = useMemo(() => {
    return Object.entries(formData.orders).reduce((total, [id, quantity]) => {
      if (!quantity) return total;
      const product = products.find(p => p.id === id);
      return total + (product.price * quantity);
    }, 0);
  }, [formData.orders, products]);


  // Handles form submission to Formspree
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
      // IMPORTANT: Replace with your unique Formspree URL
      const response = await fetch("https://formspree.io/f/xblavqrv", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSubmissionStatus('success');
        // Reset the form after successful submission
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

  // Handles the "WhatsApp Your Order" button click
  // Handles the "WhatsApp Your Order" button click
const handleWhatsAppClick = () => {
  const orderedItems = Object.entries(formData.orders)
    .filter(([, quantity]) => quantity)
    .map(([id, quantity]) => {
      const product = products.find(p => p.id === id);
      return `* ${product.name} - Qty: ${quantity} (₹${product.price})*`;
    }).join('\n');

  const message = `Hello, my name is ${formData.name} and I would like to place an order.\n\nHere is my order summary:\n${orderedItems || 'No items selected'}\n\n*Total Price: ₹${totalPrice}*\n\n*Address:*\n${formData.address}\n`;

  // ✅ Your WhatsApp number (no +, no spaces)
  const whatsappNumber = "919769500899";

  // ✅ Detect mobile vs desktop
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  const whatsappUrl = isMobile
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    : `https://web.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(message)}`;

  window.location.href = whatsappUrl; // ✅ works everywhere
};


  

  // Shows the modal with the clicked image
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowModal(true);
  };

  // Closes the image modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage('');
  };

  // Check if the form is valid for enabling the WhatsApp button
  const isFormValid = formData.name && formData.whatsapp && formData.address && Object.values(formData.orders).some(qty => qty > 0);
  const hasItemsInCart = Object.values(formData.orders).some(qty => qty > 0);

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-3xl w-full bg-white shadow-2xl rounded-2xl p-6 sm:p-10 my-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-pink-700 leading-tight tracking-wide sm:text-5xl">
            <span role="img" aria-label="sparkles" className="mr-2">✨</span>
              Om Sai 
            <span role="img" aria-label="sparkles" className="ml-2">✨</span>
          </h1>
          <h4 className="text-4xl font-extrabold text-pink-700 leading-tight tracking-wide sm:text-5xl">
            <span role="img" aria-label="sparkles" className="mr-2">✨</span>
              Handmade Rangoli Mats 
            <span role="img" aria-label="sparkles" className="ml-2">✨</span>
          </h4>
          <p className="mt-2 text-lg text-purple-600 font-medium">
            Celebrate with our stunning, reusable Rangoli mats. Perfect for every festive occasion! 🏡
          </p>
          <p className="mt-2 text-lg text-purple-600 font-small">
            Sanjana Kodag's Creations | Contact: +91 9769500899
          </p>
        </header>

        <main className="flex flex-col gap-12">
          {/* Product Listing Section */}
          <section className="product-list-section">
            <h2 className="text-2xl font-bold text-pink-600 mb-4 border-b-2 border-pink-200 pb-2">Our Collection</h2>
            <div className="divide-y divide-gray-200">
              {products.map(product => (
                <div key={product.id} className="flex items-center gap-4 py-4">
                  <div
                    onClick={() => handleImageClick(product.imageUrl)}
                    className="cursor-pointer hover:scale-105 transition-transform duration-300"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-24 h-24 rounded-lg object-cover shadow-md flex-shrink-0"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div className="flex-1 mb-1 sm:mb-0">
                        <span className="text-lg font-semibold text-gray-800 break-words">{product.name}</span>
                        <p className="text-gray-500 text-sm mt-1 truncate">{product.description}</p>
                      </div>
                      <span className="font-bold text-lg text-purple-600 sm:ml-4 flex-shrink-0">₹{product.price}</span>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <label htmlFor={`qty-${product.id}`} className="text-sm font-medium text-gray-700">Quantity:</label>
                      <input
                        id={`qty-${product.id}`}
                        type="number"
                        min="0"
                        value={formData.orders[product.id] || 0}
                        onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
                        className="w-16 px-2 py-1 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Order Form Section - ONLY SHOWS if items are selected */}
          {hasItemsInCart && (
            <section className="order-form-section">
              <h2 className="text-2xl font-bold text-pink-600 mb-4 border-b-2 border-pink-200 pb-2">Place Your Order</h2>
              
              {/* Order Summary */}
              <div className="bg-purple-50 p-4 rounded-lg mb-6 border border-purple-200">
                 <h3 className="text-lg font-semibold text-purple-800 mb-2">Your Order Summary</h3>
                 <div className="space-y-1 text-sm text-gray-700">
                    {Object.entries(formData.orders).map(([id, quantity]) => {
                      if (!quantity) return null;
                      const product = products.find(p => p.id === id);
                      return (
                        <div key={id} className="flex justify-between">
                          <span>{product.name} x {quantity}</span>
                          <span>₹{product.price * quantity}</span>
                        </div>
                      )
                    })}
                 </div>
                 <div className="border-t border-purple-200 mt-3 pt-3 flex justify-between items-center">
                    <span className="text-lg font-bold text-purple-900">Total Price</span>
                    <span className="text-2xl font-bold text-purple-900">₹{totalPrice}</span>
                 </div>
              </div>
              
              <form onSubmit={handleSubmit} className="order-form space-y-4">
                <input type="text" name="name" placeholder="Your Full Name" value={formData.name} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <input type="tel" name="whatsapp" placeholder="Your WhatsApp Number" value={formData.whatsapp} onChange={handleInputChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <textarea name="address" placeholder="Full Delivery Address (including Pincode)" value={formData.address} onChange={handleInputChange} required rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                <button type="submit" className="w-full px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all duration-300">
                  Submit Order via Email
                </button>
                <button
                  type="button"
                  onClick={handleWhatsAppClick}
                  disabled={!isFormValid}
                  className="w-full bg-green-500 text-white p-2 rounded-lg font-semibold hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.459L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                    WhatsApp Your Order
                  </span>
                </button>
              </form>

              {/* Submission Status Messages */}
              {submissionStatus === 'success' && (
                <p className="mt-4 text-center text-green-600 font-bold">
                  🎉 Thank you for your order! We will contact you on WhatsApp shortly to confirm.
                </p>
              )}
              {submissionStatus === 'error' && (
                <p className="mt-4 text-center text-red-600 font-bold">
                  ⚠️ There was an error placing your order. Please try again or WhatsApp us directly.
                </p>
              )}
            </section>
          )}
        </main>
        
        <footer className="text-center mt-8 pt-4 border-t border-gray-200 text-gray-500 text-sm">
          <p>Questions? Contact us on WhatsApp: [Om Sai Homemade Mats] | +91 9769500899</p>
        </footer>
      </div>

      {/* Image Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 animate-fade-in"
          onClick={handleCloseModal}
        >
          <div className="relative" onClick={e => e.stopPropagation()}>
            <img src={selectedImage} alt="Large product view" className="max-w-full max-h-[80vh] rounded-lg shadow-lg" />
            <button
              onClick={handleCloseModal}
              className="absolute -top-4 -right-4 text-white text-5xl font-bold bg-gray-800 rounded-full w-12 h-12 flex items-center justify-center leading-none hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              &times;
            </button>
          </div>
        </div>
      )}
      {/* ⭐ Order Success Modal */}
      {showSuccessModal && (
        <div 
          className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-md flex items-center justify-center p-6 z-50 transition-opacity duration-300"
        >
          <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-2xl max-w-lg w-full text-center border-4 border-purple-500 transform scale-95 animate-scale-in">
            <div className="text-6xl text-purple-600 mb-6 animate-bounce">
              🎉
            </div>
            <h2 className="text-3xl font-extrabold text-pink-700 mb-4">
              Order Confirmed!
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Thank you for your order. We have received your request and will contact you shortly on WhatsApp to confirm the details and arrange delivery.
            </p>
            <button
              onClick={handleCloseSuccessModal}
              className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
