import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MultiVendorCartDrawer } from './components/MultiVendorCartDrawer';
import { OrderTimelineModal } from './components/OrderTimelineModal';
import { StoreRegistrationModal } from './components/StoreRegistrationModal';
import { AddProductModal } from './components/AddProductModal';

import { StorefrontHome } from './pages/StorefrontHome';
import { StoreDetailPage } from './pages/StoreDetailPage';
import { BuyerOrdersPage } from './pages/BuyerOrdersPage';
import { VendorDashboardPage } from './pages/VendorDashboardPage';

import { api } from './services/api';

const MainApp = () => {
  const { user } = useAuth();
  const { activeTrackingOrder, setActiveTrackingOrder } = useCart();

  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeView, setActiveView] = useState('home'); // 'home' | 'store-detail' | 'my-orders' | 'vendor-dashboard'
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCampus, setSelectedCampus] = useState('Obafemi Awolowo University (OAU)');
  const [searchQuery, setSearchQuery] = useState('');

  const [isRegisterStoreOpen, setIsRegisterStoreOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Fetch real stores and products from backend API on mount
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [fetchedStores, fetchedProducts] = await Promise.all([
          api.getStores(),
          api.getProducts(),
        ]);
        if (fetchedStores && fetchedStores.length > 0) setStores(fetchedStores);
        if (fetchedProducts && fetchedProducts.length > 0) setProducts(fetchedProducts);
      } catch (err) {
        console.error('Error fetching backend data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectStore = (storeOrId) => {
    if (typeof storeOrId === 'string') {
      const found = stores.find((s) => s.id === storeOrId);
      if (found) setSelectedStore(found);
    } else {
      setSelectedStore(storeOrId);
    }
    setActiveView('store-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStoreCreated = async (newStore) => {
    // Save to backend API
    const backendSaved = await api.createStore(newStore);
    const finalStore = backendSaved || newStore;
    setStores((prev) => [finalStore, ...prev]);
    setSelectedStore(finalStore);
    setActiveView('vendor-dashboard');
  };

  const handleProductAdded = async (newProduct) => {
    // Save to backend API
    const backendSaved = await api.createProduct(newProduct);
    const finalProduct = backendSaved || newProduct;
    setProducts((prev) => [finalProduct, ...prev]);
  };

  const currentVendorStore = stores.find((s) => s.vendorId === user?.id || s.id === user?.storeId) || stores[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between selection:bg-[#395082] selection:text-white">
      
      {/* Navigation Header */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenRegisterStore={() => setIsRegisterStoreOpen(true)}
        selectedCampus={selectedCampus}
        setSelectedCampus={setSelectedCampus}
      />

      {/* Main View Container */}
      <main className="container mx-auto px-4 py-6 sm:py-8 flex-1">
        {activeView === 'home' && (
          <StorefrontHome
            stores={stores}
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectStore={handleSelectStore}
            searchQuery={searchQuery}
            onRegisterStoreClick={() => setIsRegisterStoreOpen(true)}
            selectedCampus={selectedCampus}
          />
        )}

        {activeView === 'store-detail' && (
          <StoreDetailPage
            store={selectedStore || stores[0]}
            products={products}
            onBack={() => setActiveView('home')}
            onAddProductClick={() => setIsAddProductOpen(true)}
            isOwner={user?.role === 'VENDOR' && (user?.storeId === selectedStore?.id || user?.id === selectedStore?.vendorId)}
          />
        )}

        {activeView === 'my-orders' && (
          <BuyerOrdersPage
            onOpenOrderTracker={(order) => setActiveTrackingOrder(order)}
          />
        )}

        {activeView === 'vendor-dashboard' && (
          <VendorDashboardPage
            store={currentVendorStore}
            products={products}
            onAddProductClick={() => setIsAddProductOpen(true)}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Slide-over Drawers & Modals */}
      <MultiVendorCartDrawer />

      {/* Real-time Order State Machine Tracking Modal */}
      <OrderTimelineModal
        order={activeTrackingOrder}
        onClose={() => setActiveTrackingOrder(null)}
      />

      {/* Vendor Store Onboarding Modal */}
      <StoreRegistrationModal
        isOpen={isRegisterStoreOpen}
        onClose={() => setIsRegisterStoreOpen(false)}
        onStoreCreated={handleStoreCreated}
      />

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        store={currentVendorStore}
        onProductAdded={handleProductAdded}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}
