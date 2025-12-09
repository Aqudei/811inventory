// contexts/PaymentContext.js
import { createContext, useContext, useState } from 'react';

const PaymentContext = createContext();

export const usePayment = () => useContext(PaymentContext);

export const PaymentProvider = ({ children }) => {
    const [paymentMode, setPaymentMode] = useState("");
    const [price, setPrice] = useState(0)

    return (
        <PaymentContext.Provider value={{ paymentMode, setPaymentMode }}>
            {children}
        </PaymentContext.Provider>
    );
};
