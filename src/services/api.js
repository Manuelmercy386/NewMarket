// Frontend API service to communicate with the Express backend tier
const API_BASE = '/api/v1';

export const api = {
  // Stores
  async getStores() {
    try {
      const res = await fetch(`${API_BASE}/stores`);
      if (!res.ok) throw new Error('Failed to fetch stores');
      const data = await res.json();
      localStorage.setItem('nm_cached_stores', JSON.stringify(data));
      return data;
    } catch (err) {
      console.warn('API error, using local cache:', err);
      const cached = localStorage.getItem('nm_cached_stores');
      return cached ? JSON.parse(cached) : null;
    }
  },

  async createStore(storeData, token) {
    try {
      const res = await fetch(`${API_BASE}/stores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(storeData),
      });
      if (!res.ok) throw new Error('Failed to create store');
      return await res.json();
    } catch (err) {
      console.error('Error creating store on backend:', err);
      return storeData;
    }
  },

  // Products
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'all') query.append('category', params.category);
      if (params.store_id) query.append('store_id', params.store_id);
      if (params.search) query.append('search', params.search);

      const res = await fetch(`${API_BASE}/products?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      localStorage.setItem('nm_cached_products', JSON.stringify(data));
      return data;
    } catch (err) {
      console.warn('API error, using local cache:', err);
      const cached = localStorage.getItem('nm_cached_products');
      return cached ? JSON.parse(cached) : null;
    }
  },

  async createProduct(productData, token) {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(productData),
      });
      if (!res.ok) throw new Error('Failed to create product');
      return await res.json();
    } catch (err) {
      console.error('Error creating product on backend:', err);
      return productData;
    }
  },

  // Orders & Multi-Vendor Checkout
  async checkout(orderPayload, token) {
    try {
      const res = await fetch(`${API_BASE}/orders/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(orderPayload),
      });
      if (!res.ok) throw new Error('Failed to process checkout');
      const data = await res.json();
      return data.order;
    } catch (err) {
      console.error('Checkout API error:', err);
      return null;
    }
  },

  async getMyOrders(token) {
    try {
      const res = await fetch(`${API_BASE}/orders/my-orders`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      localStorage.setItem('nm_cached_orders', JSON.stringify(data));
      return data;
    } catch (err) {
      console.warn('API error fetching orders, using cache:', err);
      const cached = localStorage.getItem('nm_cached_orders');
      return cached ? JSON.parse(cached) : null;
    }
  },

  async updateOrderStatus(itemId, status, token) {
    try {
      const res = await fetch(`${API_BASE}/vendor/orders/${itemId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });
      return await res.json();
    } catch (err) {
      console.error('Error updating order status:', err);
      return null;
    }
  },
};
