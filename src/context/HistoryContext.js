import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getOrders } from '../services/orderService';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
    const [history, setHistory] = useState([]);
    const [apiOrders, setApiOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadFromApi = useCallback(async () => {
        try {
            const orders = await getOrders('BRL');
            setApiOrders(orders);
            return orders;
        } catch {
            return null;
        }
    }, []);

    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        setLoading(true);
        const stored = await AsyncStorage.getItem('@my_orders_history');
        const localOrders = stored ? JSON.parse(stored) : [];
        setHistory(localOrders);

        const api = await loadFromApi();
        if (api && api.length > 0) {
            setHistory(api);
            await AsyncStorage.setItem('@my_orders_history', JSON.stringify(api));
        }
        setLoading(false);
    };

    const addOrder = async (order) => {
        const newHistory = [order, ...history.filter(h => h.id !== order.id)];
        setHistory(newHistory);
        await AsyncStorage.setItem('@my_orders_history', JSON.stringify(newHistory));
    };

    const refreshOrders = useCallback(async () => {
        const api = await loadFromApi();
        if (api && api.length > 0) {
            setHistory(api);
            await AsyncStorage.setItem('@my_orders_history', JSON.stringify(api));
        }
    }, [loadFromApi]);

    return (
        <HistoryContext.Provider value={{ history, addOrder, refreshOrders, loading }}>
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = () => useContext(HistoryContext);