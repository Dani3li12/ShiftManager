import React, { useEffect, useRef, useState } from 'react';
import { Title, Label, Card, Item, ItemsRow, ButtonsContainer } from './style';
import Textarea from '@mui/joy/Textarea';
import { TextField, MenuItem, Select, FormControl, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Navbar from '../navbar/Navbar';
import { showNotification } from '../../utils/notifications';
import { getDocs, query, where, addDoc, updateDoc, doc } from 'firebase/firestore';
import { shiftsCollectionRef } from '../../firebase';
import { db } from '../../firebase';


export default function ShiftPopup({ title, data, setShowPopup }) {
    const Form = useRef();
    const [workplace, setWorkplace] = useState("");

    useEffect(() => {
        const form = Form.current;
        if (data) {
            form["date"].value = data.date;
            form["startTime"].value = data.startTime;
            form["endTime"].value = data.endTime;
            form["wage"].value = data.hourlyWage;
            form["shiftName"].value = data.name;
            form["comments"].value = data.comments;
            setWorkplace(data.workplace);
        }
    }, []);

    const checkShiftNameExist = async () => {
        const data1 = await getDocs(query(shiftsCollectionRef, where("name", "==", Form.current["shiftName"].value)));
        if (data1.empty) return false;
        else return true;
    }

    const addShift = async () => {
        try {
            const form = Form.current;
            await addDoc(shiftsCollectionRef, {
                date: form["date"].value,
                startTime: form["startTime"].value,
                endTime: form["endTime"].value,
                hourlyWage: form["wage"].value,
                comments: form["comments"].value,
                name: form["shiftName"].value,
                workplace: workplace,
                userId: localStorage.getItem("userId")
            });
            showNotification("success", "The shift added successfully");
            setTimeout(() => { window.location.reload() }, 2000);
        } catch (err) {
            showNotification("error", "Couldn't save the shift. Try again later...");
        }
    }
    const updateShift = async () => {
        const querySnapshot = await getDocs(shiftsCollectionRef);
        const documentRef = await querySnapshot.docs.find(doc => doc.data().name === Form.current["shiftName"].value);
        const form = Form.current;
        const updatedData = {
            date: form["date"].value,
            startTime: form["startTime"].value,
            endTime: form["endTime"].value,
            hourlyWage: form["wage"].value,
            comments: form["comments"].value,
            name: form["shiftName"].value,
            workplace: workplace,
        };
        if (documentRef) {
            await updateDoc(doc(db, "shifts", documentRef.id), updatedData);
            showNotification("success", "The shift updated successfully");
            setTimeout(() => { window.location.reload() }, 2000);
            setShowPopup(false);
        } else {
            showNotification("error", "Couldn't update the shift. Try again later...");
        }
    }

    const handleSubmit = async () => {
        const form = Form.current;
        const nameExist = await checkShiftNameExist();
        if (form["date"].value === "") {
            showNotification("error", "Field the date");
            return;
        } else if (form["startTime"].value === "") {
            showNotification("error", "Field the start time");
            return;
        } else if (form["endTime"].value === "") {
            showNotification("error", "Field the end time");
            return;
        }
        else if (form["wage"].value === "" || form["wage"].value < 0) {
            showNotification("error", "Field the wage");
            return;
        } else if (workplace === "") {
            showNotification("error", "Field the workplace");
            return;
        } else if (form["shiftName"].value === "") {
            showNotification("error", "Field the shift name");
            return;
        } else if (title === "Add a shift" && nameExist) {
            showNotification("error", "This name already exist, choose a new name");
            return;
        } else {
            if (title === "Add a shift") addShift();
            else if (title === "Edit Shift") updateShift();
        }
    }

    const handleCancel = () => {
        setShowPopup(false);
    }
    const handleWorkplace = (event) => {
        setWorkplace(event.target.value);
    };

    return (
        <>
            <Navbar selected={data ? "My Shifts" : "Add A Shift"} />
            <Card>
                <Title>{title}</Title>
                <form ref={Form}>
                    <ItemsRow>
                        <Item>
                            <Label>Select the date</Label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <TextField type="date" sx={{ width: "100%" }} name={'date'} />
                            </LocalizationProvider>
                        </Item>
                        <Item>
                            <Label>Start time</Label>
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <TextField type="time" name={'startTime'} />
                            </LocalizationProvider>
                        </Item>
                        <Item>
                            <Label>End time</Label>
                            <LocalizationProvider dateAdapter={AdapterDayjs} >
                                <TextField type="time" name={'endTime'} />
                            </LocalizationProvider>
                        </Item>
                    </ItemsRow>
                    <ItemsRow>

                        <Item>
                            <Label>Hourly wage</Label>
                            <TextField id="outlined-basic-wage" variant="outlined" type='number' name={'wage'} />
                        </Item>
                        <Item>
                            <Label>Workplace</Label>
                            <FormControl>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={workplace}
                                    onChange={handleWorkplace}
                                >
                                    <MenuItem value="Cashier">Cashier</MenuItem>
                                    <MenuItem value="Dishes">Dishes</MenuItem>
                                    <MenuItem value="Cook">Cook</MenuItem>
                                </Select>
                            </FormControl>
                        </Item>
                        <Item>
                            <Label>Shift name</Label>
                            <TextField type='text' id="outlined-basic-name" variant="outlined" name={'shiftName'} />
                        </Item>
                    </ItemsRow>
                    <Label>Comments</Label>
                    <Textarea type="text" minRows={2} name={'comments'} sx={{ width: "100%" }} />
                </form>
                <ButtonsContainer>
                    {data !== undefined && <Button variant="text" sx={{ color: "var(--blue)", margin: "auto", marginTop: "1.5rem" }} onClick={handleCancel}>Cancel</Button>}
                    <Button variant="contained" sx={{ background: "var(--blue)", margin: "auto", marginTop: "1.5rem" }} onClick={handleSubmit}>Submit</Button>
                </ButtonsContainer>
            </Card>
        </>
    )
}