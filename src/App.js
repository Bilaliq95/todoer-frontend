import Login from './components/Login';
import Home from './components/Home';
import CompletedTasks from './components/CompletedTasks';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import './App.css';
import { useState} from "react";
import LoadingScreen from "./components/LoadingScreen";


function App() {
  const [userData, setUserData] = useState({});
  const [taskData, setTaskData] = useState([]);
  const [IsLoggedIn, setIsLoggedIn] = useState(undefined);
  // null = checking, true = logged in, false = not logged in
  console.log(IsLoggedIn);
  return (
      <BrowserRouter>
        <Routes>
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
                    ? <Home userData={userData} setTaskData={setTaskData} taskData={taskData} />
                    : IsLoggedIn === false
                        ? <Navigate to="/login" />
                        : <LoadingScreen setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />
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
                        : <LoadingScreen setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />
              }
          />

          {/* Root route → Loading check */}
          <Route
              path="/"
              element={<LoadingScreen setIsLoggedIn={setIsLoggedIn} setUserData={setUserData} />}
          />
        </Routes>
      </BrowserRouter>
  )
}

export default App;
