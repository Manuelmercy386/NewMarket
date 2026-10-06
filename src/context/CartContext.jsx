import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('newmarket_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState(null);
  const [ordersError, setOrdersError] = useState('');

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('newmarket_cart', JSON.stringify(cart));
  }, [cart]);

  // Load only the signed-in buyer's persisted orders.
  useEffect(() => {
    if (!user) {
      setOrders([]);
      setOrdersError('');
      return;
    }
    let active = true;
    setOrdersError('');
    api.getMyOrders()
      .then((data) => {
        if (active) setOrders(data);
      })
      .catch((error) => {
        if (active) setOrdersError(error.message);
        console.error('Unable to load orders:', error);
      });
    return () => {
      active = false;
    };
  }, [user]);

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
  const campusServiceFee = subtotal > 0 ? 500 : 0;
  const grandTotal = subtotal + campusServiceFee;

  // Process checkout: post to backend API endpoint
  const processCheckout = async (buyerDetails) => {
    if (cart.length === 0) throw new Error('Your cart is empty.');

    const payload = {
      cartItems: cart,
      totalAmount: grandTotal,
      buyerName: buyerDetails?.fullName,
      buyerEmail: buyerDetails?.email,
      buyerHostel: buyerDetails?.hostel,
      campus: buyerDetails?.campus,
    };

    setOrdersError('');
    return api.checkout(payload);
  };

  // Persist vendor updates before reflecting them in the UI.
  const updateOrderItemStatus = async (orderId, itemId, newStatus) => {
    const updatedItem = await api.updateOrderStatus(itemId, newStatus);
    setOrders((prevOrders) => prevOrders.map((order) => (
      order.id === orderId
        ? {
            ...order,
            items: order.items.map((item) => item.id === itemId ? updatedItem : item),
          }
        : order
    )));
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
        setOrders,
        ordersError,
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
