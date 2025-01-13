import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Helmet } from 'react-helmet-async';
import { useIndexedDB } from 'react-indexed-db-hook';
import { Grid,IconButton, InputAdornment } from '@mui/material';
import '../../styles/login.css'
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Toaster, toast } from 'sonner';


function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { getAll, update } = useIndexedDB('users');
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

        // Validate email
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Invalid email format.';
        }

        // Validate password
        if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return; // Stop execution if validation fails
        }

        getAll().then((users) => {
            const user = users.find(
                (u) => u.email === formData.email && u.password === formData.password
            );

            if (user) {
                if (user.status === 'blocked') {
                    toast.error('This account is currently blocked. Please contact support.');
                    return;
                }
                // Append current timestamp to loginHistory
                const updatedUser = {
                    ...user,
                    loginHistory: [...(user.loginHistory || []), new Date().toISOString()],
                };

                update(updatedUser).then(() => {
                    toast.success('Login successful!');
                 
                    localStorage.setItem('username', user.name);

                    setTimeout(() => {
                        navigate('/dashboard'); 
                    }, 2000);
                    
                });
            } else {
                toast.error('Invalid email or password.');
            }
        });
    };

    return (
        <>
            <main>
                <Helmet>
                    <title>Login - User Management System</title>
                    <meta
                        name="description"
                        content="Login to access your account and manage user information securely."
                    />
                </Helmet>

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
                        <div className='banner-div'>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>

                        <div className='user-div'>
                            <h1 className='login-text'>Login</h1>
                            <p className='para'>Don't have an account? <Link to='/'>Register </Link></p>
                            <form onSubmit={handleSubmit}>
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
                                <button type="submit" variant="contained" className='login-btn'>
                                    Login
                                </button>
                            </form>
                        </div>
                    </Grid>
                    </Grid >
                    <Toaster position="top-right" richColors />

            </main>
        </>
    );
}

export default Login;
