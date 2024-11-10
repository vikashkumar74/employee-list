import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Logout({ setIsLoggedIn }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        axios.post("http://localhost:3001/auth/logout", {}, { withCredentials: true })
            .then(response => {
                if (response.status === 200) {
                    setIsLoggedIn(false);
                    navigate("/login");
                }
            })
            .catch(error => {
                console.error("Error logging out:", error);
            });
    };
    return (
        <Button onClick={handleLogout}>
            Logout
        </Button>
    );
}

export default Logout;