import React, { useEffect, useState } from 'react';
import { Container, NavbarButtons, NavbarButton, RightSide } from './styles';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';

export default function Navbar({ selected }) {
    const [name, setName] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getUserData();
    }, []);

    const buttons = [
        {
            href: "/myShifts",
            name: "My Shifts"
        },
        {
            href: "/addShift",
            name: "Add A Shift"
        },
        {
            href: "/editProfile",
            name: "Edit Profile"
        },
    ]

    const getUserData = async () => {
        const userRef = doc(db, "users", localStorage.getItem("userId"));
        const res = await getDoc(userRef);
        const user = res.data();
        setName(user.firstName + " " + user.lastName);
    }

    const handleLogout = () => {
        localStorage.removeItem("userId");
        navigate('/login');
    }


    return (
        <Container>
            <NavbarButtons>
                <div>
                    {buttons.map(button =>
                        <NavbarButton variant='text' href={button.href} isSelected={selected === button.name}>{button.name}</NavbarButton>
                    )}
                </div>
                <RightSide>
                    <p>Welcome, {name}</p>
                    <NavbarButton variant='contained' onClick={handleLogout} style={{ background: "#cdcdcd17" }}>Logout</NavbarButton>
                </RightSide>
            </NavbarButtons>
        </Container>
    )
}