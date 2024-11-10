import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
    const location = useLocation();
    const navigate = useNavigate();

    const initialUser = location.state?.user || { name: localStorage.getItem("userName") };
    const [user, setUser] = useState(initialUser);
    const [loading, setLoading] = useState(!user.name);

    useEffect(() => {
        if (!user.name) {
            axios.get('http://localhost:3001/auth/user', { withCredentials: true })
                .then(response => {
                    if (response.data.user) {
                        setUser(response.data.user);
                          
                    } else {
                        navigate("/login");
                    }
                })
                .catch(() => navigate("/login"))
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user, navigate]);

    if (loading) {
        return <center><h1>Loading...</h1></center>;
    }
    
    return (
        <center>
            <h1>Welcome Home {user && user.name} !!!</h1>
        </center>
    );
}

export default Home;
