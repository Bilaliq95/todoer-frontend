import { useNavigate } from 'react-router-dom';
const LogoutButton = (props) => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        const response = await fetch("https://user-service-br5f.onrender.com/users/logout", {
            method: "POST",
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            // optional: clear client-side state
            // e.g., props.setUser(null);

            // redirect
            props.setIsLoggedIn(false);//Send parent state here and check is Logged in for correct render
            navigate("/login");
        }
    };
return (
    <button
        onClick={handleLogout}
        className="w-full sm:w-auto p-3 my-5 sm:my-4 text-white rounded-full bg-slate-600"
    >
        Log Out
    </button>
)
}


export default LogoutButton;