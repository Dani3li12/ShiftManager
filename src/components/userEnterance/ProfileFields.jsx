import React, { useEffect, useRef } from 'react';
import { TextField, Grid } from '@mui/material';
import { calculateAge, getFormattedDayYYYYMMDD } from "../../utils/dates";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/de';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { SubmitButton } from './loginRegisterStyles';
import { db } from "../../firebase";
import { showNotification } from '../../utils/notifications';
import { collection, getDocs, query, where } from "firebase/firestore";

export default function ProfileFields({ submitMethod, buttonLabel, data }) {
    const Form = useRef();

    useEffect(() => {
        const form = Form.current;
        if (data) {
            form["firstname"].value = data.firstName;
            form["lastname"].value = data.lastName;
            form["email"].value = data.email;
            form["birthdate"].value = getFormattedDayYYYYMMDD(data.birthDate);
        }
    }, []);

    const handleSubmit = async () => {
        if (checkFormValidation()) {
            if ((!data && isEmailExist())) {
                showNotification("error", "This email exist, try another");
            } else {
                const form = Form.current;
                const userData = {
                    "firstname": form["firstname"].value,
                    "lastname": form["lastname"].value,
                    "password": form["password"].value,
                    "email": form["email"].value,
                    "birthdate": form["birthdate"].value
                }
                submitMethod(userData);
            }
        } else {
            showNotification("error", "Something went wrong. Try again");
        }
    }

    /**
     * A method that checks if email already exist in users collection
     * @param {*} email The checked email
     * @returns A boolean value
     */
    const isEmailExist = async () => {
        const form = Form.current;
        const q = query(collection(db, "users"), where("email", "==", form["email"].value));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) return false;
        return true;
    }

    const errMsgList = {
        "firstname": "Firstname field must include at least 2 characters",
        "lastname": "Lastname field must include at least 2 characters",
        "email": "Entered email does not match email format",
        "password": "Password must be at least 6 characters long",
        "password_confirm": "Password not match",
        "age": "Sorry but your age must be between 6-130",
        "birthdate_fill": "Please enter your birth date"
    };

    const checkFormValidation = () => {
        const form = Form.current;
        if (form["firstname"].value.length < 2) {
            showNotification("error", errMsgList["firstname"]);
        } else if (form["lastname"].value.length < 2) {
            showNotification("error", errMsgList["lastname"]);
        } else if (!isEmailFormat(form["email"].value)) {
            showNotification("error", errMsgList["email"]);
        } else if (form["password"].value.length < 6) {
            showNotification("error", errMsgList["password"]);
        } else if (form["password"].value !== form["password_confirm"].value) {
            showNotification("error", errMsgList["password_confirm"]);
        } else {
            if (form["birthdate"].value === "") {
                showNotification("error", errMsgList["birthdate_fill"]);
            } else if (calculateAge(form["birthdate"].value) < 6 || calculateAge(form["birthdate"].value) > 130) {
                showNotification("error", errMsgList["age"]);
            }
            else {
                return true;
            }
        }
        return false;
    }

    const isEmailFormat = (str) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(str);
    }

    return (
        <form ref={Form}>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <TextField id="firstname" label="First Name" variant="outlined" name={"firstname"} />
                </Grid>
                <Grid item xs={6}>
                    <TextField id="lastname" label="Last Name" variant="outlined" name={"lastname"} />
                </Grid>
                <Grid item xs={12}>
                    <TextField id="email" disabled={data !== undefined} label="Email" variant="outlined" style={{ width: "100%" }} name={"email"} />
                </Grid>
                <Grid item xs={6}>
                    <TextField id="password" label="Password" type='password' variant="outlined" name={"password"} />
                </Grid>
                <Grid item xs={6}>
                    <TextField id="password_confirm" type='password' label="Password Confirmation" variant="outlined" name={"password_confirm"} />
                </Grid>
                <Grid item xs={12}>
                    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                        <TextField type="date" sx={{ width: "100%" }} name={'birthdate'} />
                    </LocalizationProvider>
                </Grid>
                <SubmitButton variant="contained" onClick={handleSubmit}>{buttonLabel}</SubmitButton>
            </Grid>
        </form>


    )
}