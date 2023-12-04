import * as React from 'react';
import {
    AppBar, Box, Toolbar, Typography, IconButton
} from '@mui/material';

import SmartToyIcon from '@mui/icons-material/SmartToy';


export default function TopBar() {
    return (
    <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <SmartToyIcon />
                </IconButton>
                <Typography align="left" variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Compiler
                </Typography>
            </Toolbar>
        </AppBar>
    </Box>
    );
}