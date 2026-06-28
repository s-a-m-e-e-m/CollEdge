import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { getLoggedInUserLink } from "../utils/links";

export const AuthContext = createContext();

export const AuthProvider = ({ children } ) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await axios.get(getLoggedInUserLink, { withCredentials: true });
            setUser(res.data.user);
        } catch (error) {
            console.error("Error fetching user:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, setUser, loading, setLoading }}>
            {children}
        </AuthContext.Provider>
    )
}