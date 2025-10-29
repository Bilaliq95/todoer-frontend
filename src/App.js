import Login from './components/Login';
import Home from './components/Home';
import CompletedTasks from './components/CompletedTasks';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import './App.css';
import {useCallback, useEffect, useState} from "react";
import LoadingScreen from "./components/LoadingScreen";
import Register from "./components/Register";




function App() {
  const [userData, setUserData] = useState({});
  const [taskData, setTaskData] = useState([]);
  const [IsLoggedIn, setIsLoggedIn] = useState(undefined);
  // undefined = checking, true = logged in, false = not logged in


    const checkTokens = useCallback((retried = false) => {


        fetch('https://user-service-br5f.onrender.com/users/validate', {
            method: 'POST',
            credentials: 'include',
        })
            .then(async (res) => {
                if (res.ok) {
                    const data = await res.json(); // { user: {...} }
                    //This is setting user data state and that state is being used
                    setUserData(data.user);
                    setIsLoggedIn(true);
                    return;
                }

                if (res.status === 401) {
                    const r = await fetch('https://user-service-br5f.onrender.com/users/refresh', {
                        method: 'POST',
                        credentials: 'include',
                    });
                    if (r.ok && !retried) {
                        return checkTokens(true); // retry once after refresh
                    }
                }

                setIsLoggedIn(false);
            })
            .catch(() => {
                setIsLoggedIn(false);
            });
    }, [ setIsLoggedIn, setUserData]);

    useEffect(() => {
        checkTokens();
    }, [checkTokens]);

  return (
      <BrowserRouter>
        <Routes>
            {/* Register route */}
            <Route
                path="/register"
                element={
                    IsLoggedIn === true
                        ? <Navigate to="/home" />
                        : <Register />
                }
            />
          {/* Login route */}
          <Route
              path="/login"
              element={
                IsLoggedIn === true
                    ? <Navigate to="/home" />
                    : <Login setUserData={setUserData} setTaskData={setTaskData} setIsLoggedIn={setIsLoggedIn} />
              }
          />

          {/* Home (protected) */}
          <Route
              path="/home"
              element={
                IsLoggedIn === true
                    ? <Home  setIsLoggedIn={setIsLoggedIn} userData={userData} setTaskData={setTaskData} taskData={taskData} />
                    : IsLoggedIn === false
                        ? <Navigate to="/login" />
                        : <LoadingScreen  setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />
              }
          />

          {/* Completed Tasks (protected) */}
          <Route
              path="/completed-tasks"
              element={
                IsLoggedIn === true
                    ? <CompletedTasks taskData={taskData} setTaskData={setTaskData} />
                    : IsLoggedIn === false
                        ? <Navigate to="/login" />
                        : <LoadingScreen  setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />
              }
          />

          {/* Root route → Loading check */}
          <Route
              path="/"
              element={<LoadingScreen  setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />}
          />
        </Routes>
      </BrowserRouter>
  )
}

export default App;
