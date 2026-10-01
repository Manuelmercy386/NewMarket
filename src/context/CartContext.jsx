import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('newmarket_cart');
    return saved ? JSON.parse(saved) : [
      {
        id: 'prod-1',
        storeId: 'store-1',
        storeName: 'Sweet Tooth Bakes',
        name: 'Red Velvet Gourmet Cupcakes (6-Pack)',
        price: 4500,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1587668178277-295251f930f2?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'prod-3',
        storeId: 'store-2',
        storeName: 'Campus Tech Plug',
        name: 'ANC Noise-Canceling Wireless Earbuds',
        price: 18500,
        quantity: 1,
        imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80',
      }
    ];
  });

  const [orders, setOrders] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('newmarket_cart', JSON.stringify(cart));
  }, [cart]);

  // Load orders from backend API
  useEffect(() => {
    async function loadOrders() {
      const data = await api.getMyOrders();
      if (data && data.length > 0) {
        setOrders(data);
      }
    }
    loadOrders();
  }, []);

  const addToCart = (product, quantity = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: product.id,
            storeId: product.storeId,
            storeName: product.storeName,
            name: product.name,
            price: product.price,
            quantity,
            imageUrl: product.imageUrl,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Group cart items by store/vendor for transparent split visualization
  const itemsByStore = cart.reduce((acc, item) => {
    if (!acc[item.storeId]) {
      acc[item.storeId] = {
        storeId: item.storeId,
        storeName: item.storeName,
        items: [],
        subtotal: 0,
      };
    }
    acc[item.storeId].items.push(item);
    acc[item.storeId].subtotal += item.price * item.quantity;
    return acc;
  }, {});

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const campusServiceFee = subtotal > 0 ? 500 : 0; // ₦500 hostel delivery and escrow fee
  const grandTotal = subtotal + campusServiceFee;

  // Process checkout: post to backend API endpoint
  const processCheckout = async (buyerDetails) => {
    if (cart.length === 0) return null;

    const payload = {
      cartItems: cart,
      totalAmount: grandTotal,
      buyerName: buyerDetails?.fullName,
      buyerEmail: buyerDetails?.email,
      buyerHostel: buyerDetails?.hostel,
      campus: buyerDetails?.campus,
    };

    // Send order to backend API
    const backendOrder = await api.checkout(payload);

    let finalOrder = backendOrder;
    if (!finalOrder) {
      // Local fallback if backend is offline
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      finalOrder = {
        id: orderId,
        buyerId: buyerDetails?.id || 'user-buyer-1',
        buyerName: buyerDetails?.fullName || 'Tobi Adebayo',
        buyerEmail: buyerDetails?.email || 'tobi@student.edu.ng',
        buyerHostel: buyerDetails?.hostel || 'Fajuyi Hall, Block 3, Room 14',
        campus: buyerDetails?.campus || 'Obafemi Awolowo University (OAU)',
        totalAmount: grandTotal,
        paymentStatus: 'ESCROW_PAID',
        createdAt: new Date().toISOString(),
        items: cart.map((item, index) => ({
          id: `item-${Date.now()}-${index}`,
          storeId: item.storeId,
          storeName: item.storeName,
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          unitPrice: item.price,
          status: 'ESCROW_PAID',
        })),
      };
    }

    setOrders((prev) => [finalOrder, ...prev]);
    clearCart();
    setActiveTrackingOrder(finalOrder);
    return finalOrder;
  };

  // Vendor status update: sync with backend API
  const updateOrderItemStatus = async (orderId, itemId, newStatus) => {
    // Optimistic UI update
    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          const updatedItems = order.items.map((item) => {
            if (item.id === itemId) {
              return { ...item, status: newStatus };
            }
            return item;
          });
          return { ...order, items: updatedItems };
        }
        return order;
      })
    );

    // Call backend API
    await api.updateOrderStatus(itemId, newStatus);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemsByStore,
        subtotal,
        campusServiceFee,
        grandTotal,
        isCartOpen,
        setIsCartOpen,
        orders,
        processCheckout,
        updateOrderItemStatus,
        activeTrackingOrder,
        setActiveTrackingOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
