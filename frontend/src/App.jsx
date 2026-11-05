import { Routes, Route, Navigate } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateNote from "./pages/CreateNote";
import EditNote from "./pages/EditNote";
import ViewNote from "./pages/ViewNote";
import Navbar from "./components/Navbar";

function App() {
    return (
      <>
       <Navbar />
        <Routes>
            <Route path="/" element={<Navigate to="/login" />} />

            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create" element={<CreateNote />} />
            <Route path="/note/:id" element={<ViewNote />} />
            <Route path="/edit/:id" element={<EditNote />} />
        </Routes>
      </>  
    );
}

export default App;