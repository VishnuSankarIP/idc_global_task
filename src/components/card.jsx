import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';

const UserCountCard = ({ userCount }) => {
    return (
        <Card 
            sx={{
                minWidth: 275,
                boxShadow: 3,
                backgroundColor: '#f5f5f5',
                borderRadius: 2,
            }}
        >
            <CardContent>
                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Box>
                        <Typography 
                            variant="h6" 
                            color="textSecondary" 
                            gutterBottom
                        >
                            Total Users
                        </Typography>
                        <Typography 
                            variant="h4" 
                            component="div"
                            color="primary"
                        >
                            {userCount}
                        </Typography>
                    </Box>
                    <PeopleIcon 
                        sx={{ 
                            fontSize: 50, 
                            color: 'primary.main' 
                        }} 
                    />
                </Box>
            </CardContent>
        </Card>
    );
};

export default UserCountCard;
