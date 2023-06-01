import React from 'react';
import Login from './components/userEnterance/Login';
import Register from './components/userEnterance/Register';
import ResetPassword from './components/userEnterance/ResetPassword';
import { Routes, Route } from 'react-router-dom';
import EditProfile from './components/editProfile/EditProfile';
import ShiftPopup from "./components/addShift/ShiftPopup";
import MyShifts from './components/myShifts/MyShifts';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const isAuthenticated = localStorage.getItem('userId') !== null;

  return (
    <>
      <Routes>
        {isAuthenticated && (
          <>
            <Route path="/myShifts" element={<MyShifts />} />
            <Route path="/editProfile" element={<EditProfile />} />
            <Route path="/addShift" element={<ShiftPopup title={"Add a shift"} />} />
            <Route path="*" element={<MyShifts />} replace />
          </>
        )
        }
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
        <Route path="*" element={<Login />} replace />

      </Routes>
      <Toaster />
    </>
  );
}