import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';
import { setAuth, clearAuth, getUser } from '../utils/auth';
import { debugAuth } from '../utils/debug-auth';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true };
    case 'LOGIN_FAILURE':
      return { ...state, loading: false, error: action.payload, isAuthenticated: false };
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false, loading: false };
    case 'SET_USER':
      return { ...state, loading: false, user: action.payload, isAuthenticated: true };
    case 'INIT_COMPLETE':
      return { ...state, loading: false };
    default:
      return state;
  }
};

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = () => {
      console.log('🚀 AuthContext: Initializing authentication...');
      debugAuth(); // Debug current state
      
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      console.log('🔍 Initializing auth...');
      console.log('📝 Token exists:', !!token);
      console.log('👤 User exists:', !!user);
      
      if (token && user) {
        try {
          // Parse user data from localStorage
          const userData = JSON.parse(user);
          console.log('✅ User data from localStorage:', userData);
          
          // Set user immediately without backend validation
          dispatch({ type: 'SET_USER', payload: userData });
          
          // Optionally validate token in background without affecting UI
          authAPI.getProfile()
            .then(response => {
              console.log('✅ Backend validation successful');
              dispatch({ type: 'SET_USER', payload: response.data });
              localStorage.setItem('user', JSON.stringify(response.data));
            })
            .catch(error => {
              console.error('⚠️ Backend validation failed:', error);
              // Only logout if it's a 401 error
              if (error.response?.status === 401) {
                console.log('🔐 Token invalid, logging out');
                clearAuth();
                dispatch({ type: 'LOGOUT' });
              } else {
                console.log('🌐 Network error, keeping user logged in');
              }
            });
        } catch (error) {
          console.error('❌ Error parsing user data:', error);
          clearAuth();
          dispatch({ type: 'LOGOUT' });
        }
      } else {
        console.log('❌ No auth data found');
        dispatch({ type: 'LOGOUT' });
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authAPI.login(credentials);
      const { token, user } = response.data;
      setAuth(token, user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      setAuth(token, user);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'LOGIN_FAILURE', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    clearAuth();
    dispatch({ type: 'LOGOUT' });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
