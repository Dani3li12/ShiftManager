import React, { useEffect, useState } from 'react';
import Navbar from '../navbar/Navbar';
import ProfileFields from '../userEnterance/ProfileFields';
import { Wrapper } from '../userEnterance/loginRegisterStyles';
import { Title } from './styles';
import { getDoc, doc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";
import { db } from '../../firebase';
import { showNotification } from '../../utils/notifications';

export default function EditProfile() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        getUserData();
    }, []);

    const getUserData = async () => {
        const userDocRef = doc(db, 'users', localStorage.getItem("userId"));
        const userDocSnap = await getDoc(userDocRef);
        setUser(userDocSnap.data());
    }

    const updateUser = async (data) => { //updates user data by email
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('email', '==', data.email));
        try {
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userRef = doc(db, 'users', userDoc.id);
                await updateDoc(userRef, data);
                showNotification("success", "User updated successfully");
                setTimeout(() => { window.location.reload() }, 2000);
            } else {
                showNotification("error", "Something went wrong. Try again later...");
            }
        } catch (error) {
            showNotification("error", "Something went wrong. Try again later...");
        }
    }

    return (
        <>
            <Navbar selected={"Edit Profile"} />
            {user !== null &&
                <Wrapper>
                    <Title>Edit Profile</Title>
                    <ProfileFields buttonLabel={"Save"} submitMethod={updateUser} data={user} />
                </Wrapper>
            }

        </>

    )
}