import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const MOCK_USERS = {
  buyer: {
    id: 'user-buyer-1',
    fullName: 'Tobi Adebayo',
    email: 'tobi@student.edu.ng',
    role: 'BUYER',
    campus: 'Obafemi Awolowo University (OAU)',
    hostel: 'Fajuyi Hall, Block 3, Room 14',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  vendor1: {
    id: 'user-vendor-1',
    fullName: 'Amina Bello (400L Food Sci)',
    email: 'amina@sweettooth.ng',
    role: 'VENDOR',
    campus: 'Obafemi Awolowo University (OAU)',
    storeId: 'store-1',
    storeName: 'Sweet Tooth Bakes',
    avatar: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&auto=format&fit=crop&q=80',
  },
  vendor2: {
    id: 'user-vendor-2',
    fullName: 'David Okafor (300L Elect/Elect)',
    email: 'david@techplug.ng',
    role: 'VENDOR',
    campus: 'Obafemi Awolowo University (OAU)',
    storeId: 'store-2',
    storeName: 'Campus Tech Plug',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('newmarket_user');
    return saved ? JSON.parse(saved) : MOCK_USERS.buyer;
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('newmarket_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('newmarket_user');
    }
  }, [user]);

  const login = (email, role = 'BUYER') => {
    let selectedUser;
    if (role === 'VENDOR') {
      selectedUser = MOCK_USERS.vendor1;
    } else {
      selectedUser = { ...MOCK_USERS.buyer, email };
    }
    setUser(selectedUser);
    return selectedUser;
  };

  const register = ({ fullName, email, role, storeName, campus }) => {
    const newUser = {
      id: `user-${Date.now()}`,
      fullName,
      email,
      role,
      campus: campus || 'Obafemi Awolowo University (OAU)',
      storeName: role === 'VENDOR' ? storeName : undefined,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fullName}`,
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  const switchMockUser = (userKey) => {
    if (MOCK_USERS[userKey]) {
      setUser(MOCK_USERS[userKey]);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login,
        register,
        logout,
        switchMockUser,
        authModalOpen,
        setAuthModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
