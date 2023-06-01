import React, { useState } from 'react';
import { TextField, Link } from '@mui/material';
import { Wrapper, SubmitButton, LoginInputContainer, Title } from './loginRegisterStyles';
import { showNotification } from '../../utils/notifications';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  //A method that checks if email already exist in users collection
  const getEmailDoc = async () => {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.docs.length > 0) return ({ user: querySnapshot.docs[0].data(), userId: querySnapshot.docs[0].id });
    return null;
  }

  //A method that calls on login button click
  const handleLogin = async () => {
    const data = await getEmailDoc();
    if (data !== null) {
      if (data.user.password === password) {
        localStorage.setItem("userId", data.userId);
        navigate('/myShifts');
        window.location.reload();
      } else {
        showNotification("error", "The password is uncorrect")
      }
    } else {
      showNotification("error", "This mail is not registered");
    }
  }

  return (
    <>
      <Wrapper>
        <Title>Log In</Title>
        <p>Welcome! Login to your account</p>
        <LoginInputContainer>
          <TextField id="email" label="Email" variant="outlined" value={email} onChange={e => setEmail(e.target.value)} />
          <TextField id="password" type='password' label="Password" variant="outlined" value={password} onChange={e => setPassword(e.target.value)} />
        </LoginInputContainer>
        <SubmitButton variant="contained" onClick={handleLogin}>Login</SubmitButton>
        <p>Forgot your password? <Link href="/resetPassword">Reset password</Link></p>
        <p>Don't have an account? <Link href="/register">Create it</Link></p>
      </Wrapper>
    </>
  );
} 