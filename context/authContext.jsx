import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadLoginState = async () => {
            try {
                const storedStatus = await AsyncStorage.getItem('isLoggedIn');
                if (storedStatus === 'true') setIsLoggedIn(true);
            } 
            catch (error) {
                console.error('Error loading login state:', error);
            } 
            finally {
                setLoading(false);
            }
        };
        loadLoginState();
    }, []);

    useEffect(() => {
        AsyncStorage.setItem('isLoggedIn', isLoggedIn ? 'true' : 'false');
    }, [isLoggedIn]);

    const login = () => setIsLoggedIn(true);
    const logout = () => setIsLoggedIn(false);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
