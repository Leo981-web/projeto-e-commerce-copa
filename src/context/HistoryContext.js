import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HistoryContext = createContext();

export const HistoryProvider = ({ children }) => {
    const [history, setHistory] = useState([]);


    useEffect(() => {
        loadHistory();
    }, []);

    const loadHistory = async () => {
        const stored = await AsyncStorage.getItem('@my_orders_history');
        if (stored) setHistory(JSON.parse(stored));
    };

    const addOrder = async (order) => {
        const newHistory = [order, ...history];
        setHistory(newHistory);
        await AsyncStorage.setItem('@my_orders_history', JSON.stringify(newHistory));
    };

    return (
        <HistoryContext.Provider value={{ history, addOrder }}>
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = () => useContext(HistoryContext);