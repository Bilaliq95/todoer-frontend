import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const LoadingScreen = ({ setIsLoggedIn, setUserData }) => {
    const navigate = useNavigate();

    const checkTokens = useCallback((retried = false) => {

        console.log("Check Tokens Is Called");
        fetch('http://localhost:3002/users/validate', {
            method: 'POST',
            credentials: 'include',
        })
            .then(async (res) => {
                if (res.ok) {
                    const data = await res.json(); // { user: {...} }
                    setUserData(data.user);
                    setIsLoggedIn(true);
                    navigate('/home', { replace: true });
                    return;
                }

                if (res.status === 401) {
                    const r = await fetch('http://localhost:3002/users/refresh', {
                        method: 'POST',
                        credentials: 'include',
                    });
                    if (r.ok && !retried) {
                        return checkTokens(true); // retry once after refresh
                    }
                }

                setIsLoggedIn(false);
                navigate('/login', { replace: true });
            })
            .catch(() => {
                setIsLoggedIn(false);
                navigate('/login', { replace: true });
            });
    }, [navigate, setIsLoggedIn, setUserData]);

    useEffect(() => {
        checkTokens();
    }, [checkTokens]);

    return <div>Loading...</div>;
};

export default LoadingScreen;
