const API_BASE = '/api/v1';

async function request(path, options = {}) {
  const token = Object.hasOwn(options, 'token') ? options.token : localStorage.getItem('newmarket_token');
  const headers = new Headers(options.headers || {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `Request failed (${response.status})`);
  }
  return data;
}

export const api = {
  register(credentials) {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(credentials),
      token: null,
    });
  },

  login(credentials) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
      token: null,
    });
  },

  getCurrentUser() {
    return request('/auth/me');
  },

  getStores() {
    return request('/stores');
  },

  createStore(storeData) {
    return request('/stores', {
      method: 'POST',
      body: JSON.stringify(storeData),
    });
  },

  getProducts(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'all') query.set('category', params.category);
    if (params.store_id) query.set('store_id', params.store_id);
    if (params.search) query.set('search', params.search);
    const suffix = query.size ? `?${query.toString()}` : '';
    return request(`/products${suffix}`);
  },

  createProduct(productData) {
    return request('/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    return request('/uploads', {
      method: 'POST',
      body: formData,
    });
  },

  checkout(orderPayload) {
    return request('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    });
  },

  verifyPayment(reference) {
    return request(`/payments/verify/${encodeURIComponent(reference)}`);
  },

  getMyOrders() {
    return request('/orders/my-orders');
  },

  getVendorOrders() {
    return request('/vendor/orders');
  },

  updateOrderStatus(itemId, status) {
    return request(`/vendor/orders/${encodeURIComponent(itemId)}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  getAdminOverview() {
    return request('/admin/overview');
  },
};
