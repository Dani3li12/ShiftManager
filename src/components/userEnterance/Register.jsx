import React from 'react';
import { Link } from '@mui/material';
import { Wrapper, Title } from './loginRegisterStyles';
import { db } from "../../firebase";
import { collection, addDoc } from "firebase/firestore";
import { showNotification } from "../../utils/notifications";
import ProfileFields from './ProfileFields';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const usersRef = collection(db, "users");
  const navigate = useNavigate();

  /**
   * A method that adda a user to the db
   * @param {*} data use's data
   */
  const createUser = async (data) => {
    try {
      const user = await addDoc(usersRef, {
        email: data.email,
        password: data.password,
        firstName: data.firstname,
        lastName: data.lastname,
        birthDate: data.bithdate
      });
      localStorage.setItem("userId", user.id);
      navigate('/myShifts');
      window.location.reload();
    } catch (err) {
      showNotification("error", "Registration failed, please try again...");
    }
  }




  return (
    <>
      <Wrapper>
        <Title>Create An Account</Title>
        <p>Welcome! Register for an account</p>
        <ProfileFields submitMethod={createUser} buttonLabel={"Submit"} />
        <p>Already have an account? <Link href="/login">Login</Link></p>
      </Wrapper>
    </>
  );
}