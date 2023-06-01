import React, { useEffect, useState } from "react";
import Navbar from "../navbar/Navbar";
import { Title, SearchContainer, SeachRow, SearchBy, PopupBackground } from "./style";
import { shiftsCollectionRef } from "../../firebase";
import { getDocs, query, where } from 'firebase/firestore';
import { TableContainer, TableHead, TableRow, Paper, TableCell, TableBody, Table } from "@mui/material";
import { getFormattedDay, getShiftProfit, isFromDate, isToDate } from "../../utils/dates";
import { Edit as EditIcon } from '@mui/icons-material';
import { IconButton, Select, MenuItem } from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import ShiftPopup from "../addShift/ShiftPopup";
import ClearIcon from '@mui/icons-material/Clear';

export default function MyShifts() {
    const [shifts, setShifts] = useState([]);
    const [filteredShifts, setFilteredShifts] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [filteredPlace, setFilteredPlace] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedShift, setSelectedShift] = useState(null);

    const tableColumns = [
        "Date", "Begging time", "End time", "Price per hour", "Place", "Total profit", ""
    ];

    useEffect(() => {
        getPersonalShifts();
        setFetching(false);
    }, []);

    useEffect(() => {
        let tempShifts = shifts;
        if (filteredPlace === "" && fromDate === null && toDate === null) setFilteredShifts(shifts); //nothing to filter
        if (filteredPlace !== "") { //filter worlplace
            tempShifts = tempShifts.filter((shift) => shift.workplace === filteredPlace);
        }
        if (new Date(fromDate).getFullYear() !== 1970) { //filter from date
            tempShifts = tempShifts.filter((shift) => isFromDate(new Date(shift.date), new Date(fromDate)));
        }
        if (new Date(toDate).getFullYear() !== 1970) {
            tempShifts = tempShifts.filter((shift) => isToDate(new Date(shift.date), new Date(toDate)));
        }
        setFilteredShifts(tempShifts);

    }, [fromDate, toDate, filteredPlace]);

    const getPersonalShifts = async () => {
        const res = await getDocs(query(shiftsCollectionRef, where("userId", "==", localStorage.getItem("userId"))));
        if (!res.empty) setShifts(res.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        if (!res.empty) setFilteredShifts(res.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    }

    const handleEdit = (shift) => {
        setShowPopup(!showPopup);
        setSelectedShift(shift);
    }

    const handleFilter = (event) => {
        setFilteredPlace(event.target.value);
    }
    const handleClear = (type) => {
        if (type === "fromDate") setFromDate(null);
        else setToDate(null);
    };

    return (
        <>
            <Navbar selected={"My Shifts"} />
            <Title>My Shifts</Title>
            {fetching ? "Loading..." :
                <>
                    <SearchBy>Search by</SearchBy>
                    <SearchContainer>
                        <SeachRow>
                            Place:
                            <Select
                                value={filteredPlace}
                                onChange={handleFilter}
                                displayEmpty
                                style={{ height: "2.5rem", marginLeft: "1rem" }}
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                <MenuItem value=""><em>All</em></MenuItem>
                                <MenuItem value="Cashier">Cashier</MenuItem>
                                <MenuItem value="Dishes">Dishes</MenuItem>
                                <MenuItem value="Cook">Cook</MenuItem>
                            </Select>

                        </SeachRow>
                        <SeachRow>
                            Dates : From
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker format='DD-MM-YYYY' value={fromDate} onChange={date => setFromDate(date)} slotProps={{ textField: { size: 'small' } }} sx={{ marginLeft: "1rem", marginRight: "1rem" }} />
                            </LocalizationProvider>
                            <IconButton onClick={() => handleClear("fromDate")} sx={{ position: "relative", right: "16px" }} size="small">
                                <ClearIcon />
                            </IconButton>
                            To
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker format='DD-MM-YYYY' value={toDate} onChange={date => setToDate(date)} slotProps={{ textField: { size: 'small' } }} sx={{ marginLeft: "1rem" }} />
                            </LocalizationProvider>
                            <IconButton onClick={() => handleClear("toDate")} size="small">
                                <ClearIcon />
                            </IconButton>
                        </SeachRow>
                    </SearchContainer>
                    <TableContainer sx={{ maxWidth: '90%', margin: 'auto' }} component={Paper}>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow sx={{
                                    "& th": {
                                        color: "white",
                                        backgroundColor: "var(--blue);",
                                        fontWeight: "bold"
                                    }
                                }}>
                                    {tableColumns.map(column =>
                                        <TableCell align="center">{column}</TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredShifts.map((row) => (
                                    <TableRow key={row.name}>
                                        <TableCell align="center" component="th" scope="row">{getFormattedDay(row.date)}</TableCell>
                                        <TableCell align="center" component="th" scope="row">{row.startTime}</TableCell>
                                        <TableCell align="center">{row.endTime}</TableCell>
                                        <TableCell align="center">{row.hourlyWage}</TableCell>
                                        <TableCell align="center">{row.workplace}</TableCell>
                                        <TableCell align="center">{getShiftProfit(row.startTime, row.endTime, row.hourlyWage)}</TableCell>
                                        <TableCell align="center"> <IconButton onClick={() => handleEdit(row)}><EditIcon /></IconButton> </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {showPopup &&
                        <PopupBackground>
                            <ShiftPopup title={"Edit Shift"} data={selectedShift} setShowPopup={setShowPopup} />
                        </PopupBackground>}
                </>
            }
        </>
    )
}