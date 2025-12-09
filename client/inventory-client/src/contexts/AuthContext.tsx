import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";


// -------------- TYPES ---------------- //
export interface AuthContextType {
    isAuthenticated: boolean;
    accessToken: string | null;
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => void;
    loading: boolean;
}

interface AuthProviderProps {
    children: React.ReactNode;
}

// -------------- CONTEXT ---------------- //
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); // 👈 NEW

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            setAccessToken(token);
        }
        setLoading(false); // ✅ always call this
    }, []);

    const login = async (username: string, password: string) => {
        try {

            const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/token/`, {
                username,
                password,
            });
            const { access, refresh } = res.data;
            localStorage.setItem("access_token", access);
            localStorage.setItem("refresh_token", refresh);
            setAccessToken(access);
            return true;
        } catch (err) {
            console.error("Login failed", err);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        setAccessToken(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated: !!accessToken,
                accessToken,
                login,
                logout,
                loading, // 👈 expose it
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}
