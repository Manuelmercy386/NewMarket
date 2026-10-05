import React, { useEffect, useState } from 'react';
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
import { AuthPage } from './pages/AuthPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { PaymentCallbackPage } from './pages/PaymentCallbackPage';
import { api } from './services/api';

const MainApp = () => {
  const { user, setUser } = useAuth();
  const { activeTrackingOrder, setActiveTrackingOrder } = useCart();
  const [path, setPath] = useState(window.location.pathname);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [activeView, setActiveView] = useState('home');
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCampus, setSelectedCampus] = useState('Obafemi Awolowo University (OAU)');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRegisterStoreOpen, setIsRegisterStoreOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (destination) => {
    window.history.pushState({}, '', destination);
    setPath(window.location.pathname);
    if (destination === '/') setActiveView('home');
  };

  useEffect(() => {
    let active = true;
    Promise.all([api.getStores(), api.getProducts()])
      .then(([fetchedStores, fetchedProducts]) => {
        if (!active) return;
        setStores(fetchedStores);
        setProducts(fetchedProducts);
      })
      .catch((error) => {
        if (active) setLoadError(error.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (path === '/login' || path === '/signup') {
    return <AuthPage mode={path === '/signup' ? 'signup' : 'login'} onNavigate={navigate} />;
  }
  if (path === '/admin') return <AdminDashboardPage onNavigate={navigate} />;
  if (path === '/payment/callback') return <PaymentCallbackPage onNavigate={navigate} />;

  const openStoreRegistration = () => {
    if (!user) {
      navigate('/signup?role=VENDOR');
      return;
    }
    setIsRegisterStoreOpen(true);
  };

  const handleSelectStore = (storeOrId) => {
    const found = typeof storeOrId === 'string'
      ? stores.find((store) => store.id === storeOrId)
      : storeOrId;
    if (found) setSelectedStore(found);
    setActiveView('store-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStoreCreated = async (storeData) => {
    const result = await api.createStore(storeData);
    setStores((previous) => [result.store, ...previous]);
    setUser(result.user);
    setSelectedStore(result.store);
    setActiveView('vendor-dashboard');
  };

  const handleProductAdded = async (productData) => {
    const savedProduct = await api.createProduct(productData);
    setProducts((previous) => [savedProduct, ...previous]);
  };

  const currentVendorStore = stores.find((store) => store.vendorId === user?.id);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col justify-between selection:bg-[#395082] selection:text-white">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenRegisterStore={openStoreRegistration}
        onNavigate={navigate}
        hasVendorStore={Boolean(currentVendorStore)}
        selectedCampus={selectedCampus}
        setSelectedCampus={setSelectedCampus}
      />

      <main className="container mx-auto flex-1 px-4 py-6 sm:py-8">
        {loadError && (
          <p role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Marketplace data could not be loaded: {loadError}
          </p>
        )}
        {loading && <p className="mb-4 text-xs text-slate-500">Loading marketplace…</p>}
        {activeView === 'home' && (
          <StorefrontHome
            stores={stores}
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onSelectStore={handleSelectStore}
            searchQuery={searchQuery}
            onRegisterStoreClick={openStoreRegistration}
            selectedCampus={selectedCampus}
          />
        )}

        {activeView === 'store-detail' && (
          <StoreDetailPage
            store={selectedStore}
            products={products}
            onBack={() => setActiveView('home')}
            onAddProductClick={() => setIsAddProductOpen(true)}
            isOwner={user?.role === 'VENDOR' && user?.id === selectedStore?.vendorId}
          />
        )}

        {activeView === 'my-orders' && <BuyerOrdersPage onOpenOrderTracker={setActiveTrackingOrder} />}
        {activeView === 'vendor-dashboard' && (
          <VendorDashboardPage
            store={currentVendorStore}
            products={products}
            onAddProductClick={() => setIsAddProductOpen(true)}
            onRegisterStoreClick={openStoreRegistration}
          />
        )}
      </main>

      <Footer />
      <MultiVendorCartDrawer onNavigate={navigate} />
      <OrderTimelineModal order={activeTrackingOrder} onClose={() => setActiveTrackingOrder(null)} />
      <StoreRegistrationModal
        isOpen={isRegisterStoreOpen}
        onClose={() => setIsRegisterStoreOpen(false)}
        onStoreCreated={handleStoreCreated}
      />
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
