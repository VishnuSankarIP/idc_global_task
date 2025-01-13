import React, { useEffect, useState } from 'react';
import { useIndexedDB } from 'react-indexed-db-hook';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Modal, Tooltip, Box, Typography ,TextField} from '@mui/material';
import { Helmet } from 'react-helmet-async';
import Header from '../components/header'
import { Toaster, toast } from 'sonner';
import '../../styles/dashboard.css'


function UsersDashboard() {
    const { getAll, update, deleteRecord } = useIndexedDB('users');
    const [users, setUsers] = useState([]);
    const [loginHistoryModalOpen, setLoginHistoryModalOpen] = useState(false);
    const [updateUserModalOpen, setUpdateUserModalOpen] = useState(false);
    const [selectedLoginHistory, setSelectedLoginHistory] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formValues, setFormValues] = useState({});
    const [username, setUsername] = useState('');

    useEffect(() => {
        // Fetch all users from the local IndexedDB
        getAll().then((data) => {
            setUsers(data);
        });

        // Retrieve the username from localStorage
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername); 
        }

    }, [getAll]);
    
    
    const handleBlock = (user) => {
        const updatedUser = { ...user, status: 'blocked' };
        update(updatedUser).then(() => {
            toast.error(`${user.name} has been blocked.`);
            setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? { ...u, status: 'blocked' } : u))
            );
        });
    };

    const handleUnblock = (user) => {
        const updatedUser = { ...user, status: 'active' };
        update(updatedUser).then(() => {
            toast.info(`${user.name} has been unblocked.`);
            setUsers((prev) =>
                prev.map((u) => (u.id === user.id ? { ...u, status: 'active' } : u))
            );
        });
    };

    const handleDelete = (userId) => {
        deleteRecord(userId).then(() => {
            toast.error('User has been removed.');
            setUsers((prev) => prev.filter((u) => u.id !== userId));
        });
    };

    const viewLogins = (loginHistory) => {
        setSelectedLoginHistory(loginHistory || []);
        setLoginHistoryModalOpen(true);
    };

    const handleCloseLoginHistoryModal = () => {
        setLoginHistoryModalOpen(false);
        setSelectedLoginHistory([]);
    };

    const handleOpenUpdateModal = (user) => {
        setSelectedUser(user);
        setFormValues({ name: user.name, email: user.email, address: user.address });
        setUpdateUserModalOpen(true);
    };

    const handleCloseUpdateModal = () => {
        setUpdateUserModalOpen(false);
        setSelectedUser(null);
        setFormValues({});
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleUpdate = () => {
        if (selectedUser) {
            const updatedUser = { ...selectedUser, ...formValues };
            update(updatedUser).then(() => {
                toast.success(`${selectedUser.name} details updated successfully.`);
                setUsers((prev) =>
                    prev.map((u) => (u.id === selectedUser.id ? { ...u, ...formValues } : u))
                );
                handleCloseUpdateModal();
            });
        }
    };

    return (
        <>
            <Helmet>
                <title>Users Dashboard - User Management System</title>
                <meta name="description" content="View, manage, and update all users in the database." />
            </Helmet>
            <Header/>

            <h1 className='user-text'>Welcome,{username || 'Guest'}</h1>
            <TableContainer component={Paper} className='table-container'>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Block/Unblock</TableCell>
                            <TableCell>Login History</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.address}</TableCell>
                                <TableCell
                                    style={{
                                        color: user.status === 'active' ? 'green' : 'red',
                                    }}
                                >
                                    {user.status}
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Block User">
                                        <Button
                                            color="error"
                                            onClick={() => handleBlock(user)}
                                            disabled={user.status === 'blocked'}
                                        >
                                            Block
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Unblock User">
                                        <Button
                                            color="primary"
                                            onClick={() => handleUnblock(user)}
                                            disabled={user.status === 'active'}
                                        >
                                            Unblock
                                        </Button>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="View Previous Logins">
                                        <Button
                                            color="secondary"
                                            onClick={() => viewLogins(user.loginHistory)}
                                            style={{backgroundColor:'#e179ed'}}
                                        >
                                            View
                                        </Button>
                                    </Tooltip>
                                </TableCell>
                                <TableCell>
                                    <Tooltip title="Update User Details">
                                        <Button
                                            color="primary"
                                            onClick={() => handleOpenUpdateModal(user)}
                                        >
                                            <i class="fa-regular fa-pen-to-square"></i>
                                        </Button>
                                    </Tooltip>
                                    <Tooltip title="Remove User">
                                        <Button
                                            color="error"
                                            onClick={() => handleDelete(user.id)}
                                        >
                                            <i class="fa-solid fa-trash"></i>
                                        </Button>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Modal for Login History */}
            <Modal
                open={loginHistoryModalOpen}
                onClose={handleCloseLoginHistoryModal}
                aria-labelledby="login-history-modal-title"
                aria-describedby="login-history-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography id="login-history-modal-title" variant="h6" component="h2">
                        Login History
                    </Typography>
                   
                    <Typography id="login-history-modal-description" sx={{ mt: 2 }}>
            {selectedLoginHistory.length > 0 ? (
                <TableContainer component={Paper} sx={{ mt: 2 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Date</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {selectedLoginHistory.map((login, index) => {
                                const loginDate = new Date(login);
                                const date = loginDate.toLocaleDateString();
                                const time = loginDate.toLocaleTimeString();

                                return (
                                    <TableRow key={index}>
                                        <TableCell align="center">{date}</TableCell>
                                        <TableCell align="center">{time}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                'No logins recorded.'
            )}
        </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 2 }}
                        onClick={handleCloseLoginHistoryModal}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>

            {/* Modal for Update User Details */}
            <Modal
                open={updateUserModalOpen}
                onClose={handleCloseUpdateModal}
                aria-labelledby="update-user-modal-title"
                aria-describedby="update-user-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                    }}
                >
                    <Typography id="update-user-modal-title" variant="h6" component="h2">
                        Update User Details
                    </Typography>
                    <Typography id="update-user-modal-description" sx={{ mt: 2 }}>
                        <form noValidate autoComplete="off">
                            <TextField
                                fullWidth
                                label="Name"
                                name="name"
                                value={formValues.name}
                                onChange={handleFormChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={formValues.email}
                                onChange={handleFormChange}
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={formValues.address}
                                onChange={handleFormChange}
                                sx={{ mb: 2 }}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2 }}
                                onClick={handleUpdate}
                            >
                                Update
                            </Button>
                        </form>
                    </Typography>
                </Box>
            </Modal>
            <Toaster position="top-right" richColors />

        </>
    );
}

export default UsersDashboard;



