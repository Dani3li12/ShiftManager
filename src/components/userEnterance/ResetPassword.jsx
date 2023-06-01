import React, { useState } from 'react';
import { TextField } from '@mui/material';
import { Wrapper, SubmitButton, Title } from './loginRegisterStyles';
import { showNotification } from '../../utils/notifications';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

export default function ResetPassword() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [userId, setUserId] = useState(0);
    const navigate = useNavigate();


    const checkUserExists = async () => {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', email), where('password', '==', password));
        const querySnapshot = await getDocs(q);
        const userExists = !querySnapshot.empty;
        if (userExists) {
            querySnapshot.forEach((doc) => {
                setUserId(doc.id);
            });
        }
        return userExists;
    };

    const reset = async () => {
        const userRef = doc(db, 'users', userId);
        try {
            await updateDoc(userRef, { password: newPassword });
            showNotification("success", "Password updated successfully");
            setTimeout(() => { navigate('/login'); }, 2000);
        } catch (error) {
            showNotification("error", "Something went wrong. Try again later...");
        }
    }

    const handleReset = async () => {
        const exist = await checkUserExists();
        if (!exist) { //checks if the filled password matches the email's password in db
            showNotification("error", "The email or the password are incorrect. Try again...");
        } else if (password === newPassword) { //checks if passwords are different
            showNotification("error", "The new password should be different");
        } else if (newPassword.length < 6) { //checks password validation
            showNotification("error", "Password must be at least 6 characters long");
        } else { //reset
            reset();
        }
    }

    return (
        <Wrapper>
            <Title>Reset Password</Title>
            <p>Fill the fields</p>
            <TextField id="email" label="Email" variant="outlined" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
            <TextField id="password" type='password' label="Password" variant="outlined" value={password} onChange={e => setPassword(e.target.value)} fullWidth />
            <TextField id="newpassword" type='password' label="New Password" variant="outlined" value={newPassword} onChange={e => setNewPassword(e.target.value)} fullWidth />
            <SubmitButton variant="contained" onClick={handleReset}>Reset</SubmitButton>
        </Wrapper>
    )
}