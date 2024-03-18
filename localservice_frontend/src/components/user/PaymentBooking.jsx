import React, { useEffect, useState } from 'react'
import { Button, TextField } from '@mui/material';
import './Payment.css'
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBContainer,
    // MDBIcon,
    // MDBInput,
    MDBRow,
} from "mdb-react-ui-kit";
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const PaymentBooking = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [cardNumberError, setCardNumberError] = useState(null);
    const id = useParams().id
    const [expiryMonth, setExpiryMonth] = useState('');
    const [expiryYear, setExpiryYear] = useState('');
    const [expiryDateError, setExpiryDateError] = useState(null);
    // const { handleSubmit } = useForm()
    const navigate = useNavigate()


    useEffect(() => {
        validateExpiryDate();
    }, [expiryMonth, expiryYear]);

    const handleCardNumberChange = (event) => {
        const newCardNumber = event.target.value.replace(/\D/g, '');


        if (newCardNumber.length > 16) {
            setCardNumberError('Card number cannot exceed 16 digits.');
            return;
        }


        const formattedCardNumber = newCardNumber
            .replace(/(.{4})/g, '$1 ')
            .trim();

        setCardNumber(formattedCardNumber);
        setCardNumberError(null);
    };

    const handleExpiryChange = (event) => {
        const newValue = event.target.value.replace(/\D/g, '');


        if (newValue.length === 6) {
            setExpiryMonth(newValue.slice(0, 2));
            setExpiryYear(newValue.slice(2));
        } else {

            if (newValue.length === 1 && parseInt(newValue) <= 1) {
                setExpiryMonth(newValue);
            } else if (newValue.length == 2 && parseInt(newValue) <= 12) {
                setExpiryMonth(newValue);
            } else {
                setExpiryDateError('Invalid credentials.');
            }
        }
    };

    const validateExpiryDate = () => {
        if (!expiryMonth || !expiryYear) {
            return;
        }

        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
            setExpiryDateError('Card has expired. Please enter a future expiry date.');
        } else {
            setExpiryDateError(null);
        }
    };

    const handleFormSubmit = async () => {


        if (!cardNumber || cardNumber.length !== 19) {
            setCardNumberError('Invalid card number. Please enter 16 digits.');
            return;
        }

        if (!expiryMonth || !expiryYear) {
            setExpiryDateError('Please enter a valid expiry date in MM/YYYY format.');
            return;
        }

        try {

            const res = await axios.put("http://localhost:4000/bookings/bookingstatus/" + id)
            console.log(res.data)
            if(res.status === 200){
                toast.success('🦄 Booking done successfully..', {
                    position: "top-center",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                    transition: Bounce,
                    });
            }
            navigate("/user/mybookings")
            // alert("Booking done...")

        } catch (error) {

            console.log(error)
        }

        console.log('Card number:', cardNumber);
        console.log('Expiry:', expiryMonth + '/' + expiryYear);

        setCardNumber('');
        setExpiryMonth('');
        setExpiryYear('');
    };



    return (

        // <form onSubmit= {handleSubmit(submitHandler)}>
        <MDBContainer fluid className="py-5 gradient-custom" style={{ height: "100vh" }}>
            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                // transition:Bounce,
/>
            <MDBRow className="d-flex justify-content-center py-5">
                <MDBCol md="7" lg="5" xl="4">
                    <MDBCard style={{ borderRadius: "15px", marginTop: "125px" }}>
                        <MDBCardBody className="p-4">
                            <MDBRow className="d-flex align-items-center">
                                <MDBCol size="9">
                                    <TextField

                                        label="Card Number"
                                        id="form1"
                                        type="text"
                                        placeholder="1234 5678 9012 3457"
                                        value={cardNumber}
                                        onChange={handleCardNumberChange}
                                        error={!!cardNumberError} // Set error state based on cardNumberError
                                        helperText={cardNumberError}

                                    />
                                </MDBCol>

                                <MDBCol size="3">
                                    <img
                                        src="https://img.icons8.com/color/48/000000/visa.png"
                                        alt="visa"
                                        width="64px"

                                    />
                                </MDBCol>

                                <MDBCol size="9">
                                    <TextField
                                        label="Cardholder's Name"
                                        id="form2"
                                        type="text"
                                        placeholder="Cardholder's Name"

                                    />
                                </MDBCol>

                                <MDBCol size="6">
                                    <TextField
                                        label="Expiration"
                                        id="form2"
                                        type="text"
                                        placeholder="MM/YYYY"
                                        onChange={handleExpiryChange}
                                        error={!!expiryDateError} // Set error state based on cardNumberError
                                        helperText={expiryDateError}

                                    />
                                </MDBCol>

                                <MDBCol size="3">
                                    <TextField
                                        label="CVV"
                                        id="form2"
                                        type="text"
                                        placeholder="&#9679;&#9679;&#9679;"

                                    />
                                </MDBCol>

                                <MDBCol size="3">
                                    <Button color="info" variant="contained" rounded size="lg" onClick={handleFormSubmit}>
                                        pay
                                    </Button>
                                </MDBCol>
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>

        // </form>
    )
}

export default PaymentBooking
