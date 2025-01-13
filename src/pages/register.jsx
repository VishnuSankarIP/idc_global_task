import React, { useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Helmet } from 'react-helmet-async';
import { Toaster, toast } from 'sonner';
import { Container, Grid, IconButton, InputAdornment } from '@mui/material';
import '../../styles/register.css'
import { Visibility, VisibilityOff } from "@mui/icons-material";

function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', address: '', password: '' });
    const [errors, setErrors] = useState({});
    const { add } = useIndexedDB('users');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        const newErrors = {};

        // Validate name
        if (!/^[a-zA-Z]+$/.test(formData.name)) {
            newErrors.name = 'Name must contain only letters and no spaces or special characters.';
        }

        // Validate Gmail
        if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
            newErrors.email = 'Invalid Gmail address.';
        }

        // Validate address
        if (!formData.address.trim()) {
            newErrors.address = 'Address cannot be empty.';
        }
        // Validate password
        if (
            !/^(?=.*[A-Z])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/.test(formData.password)
        ) {
            newErrors.password =
                'Password must be at least 6 characters long, contain at least one uppercase letter, and one special character.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            add({ ...formData, status: 'active', loginHistory: [] }).then(() => {

                toast.success('User Registered Successfully!');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            });
        }
    };

    return (
        <>
            <main>
                <Helmet>
                    <title>Register User - User Management System</title>
                    <meta
                        name="description"
                        content="Register a new user to the database with secure credentials."
                    />
                </Helmet>


                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <div className='banner-div'>
                        </div>
                    </Grid>

                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>

                        <div className='user-div'>
                            <h1 className='register-text'>Create an account</h1>
                            <p className='para'>Already have an account?<Link to={'/login'}>Login</Link></p>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    id="outlined-name"
                                    label="Name"
                                    variant="outlined"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                                <TextField
                                    id="outlined-email"
                                    label="Email"
                                    variant="outlined"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    fullWidth
                                    margin="normal"
                                    required
                                />
                                <TextField
                                    id="outlined-address"
                                    label="Address"
                                    variant="outlined"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    error={!!errors.address}
                                    helperText={errors.address}
                                    fullWidth
                                    margin="normal"
                                    required
                                />

                                <TextField
                                    id="outlined-password"
                                    label="Password"
                                    variant="outlined"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    fullWidth
                                    margin="normal"
                                    required
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={handleClickShowPassword}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                                <div className="div mt-2">
                                    <button type="submit" className='register-btn' >
                                        Create Account
                                    </button>
                                </div>

                            </form>
                        </div>
                    </Grid>
                </Grid>
                <Toaster position="top-right" richColors />

            </main>
        </>
    );
}

export default Register;
