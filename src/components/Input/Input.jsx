import React, { useState } from 'react';
import {TextField, Box, Tabs, Tab} from "@mui/material";
import PropTypes from "prop-types";
import {activate} from "../../Utility/LexicalAnalysis";


function CustomTabPanel(props) {
    const { value, index, setTokens,setDebug  } = props;

    const handleInputChange = (event) => {
        // Update the token and Debug whenever it changed
        const result = activate(event.target.value);
        setTokens(result[0]);
        setDebug(result[1]);
    };

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            {value === index && (
                <Box sx={{ }}>
                    <TextField
                        hiddenLabel
                        fullWidth
                        id="text"
                        multiline
                        minRows={14}
                        autoFocus={true}
                        onChange={handleInputChange}
                    />
                </Box>
            )}
        </div>
    );
}

CustomTabPanel.propTypes = {
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tabpanel-${index}`,
    };
}

export default function Input({setTokens,setDebug}) {
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (
        <Box sx={{ ml: 10, width: 700, mr:5 }}>
            <Box sx={{  }}>
                <Tabs value={value} onChange={handleChange} textColor="secondary"
                      indicatorColor="secondary" aria-label="tabs">
                    <Tab label="Text" {...a11yProps(0)} />
                    <Tab label="File" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0} setTokens={setTokens} setDebug={setDebug} />
            <CustomTabPanel value={value} index={1} />
        </Box>
    );
}

