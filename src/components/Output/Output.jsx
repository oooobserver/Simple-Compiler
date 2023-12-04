import * as React from 'react';
import {
    Box, Tabs, Tab, TableContainer, TableHead, Table, TableCell, TableRow, Paper, TableBody, Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import './Output.css'
import {Analyze} from "../../Utility/SyntacAnalysis";
import {generate} from "../../Utility/semantic_analysis";
import {advanced} from "../../Utility/advanced";


// the result of lexical analysis is table
function BasicTable({Tokens}){
    let ID = 0;
    return (
        <TableContainer component={Paper} sx={{ width: 300, mr:7  }} >
            <Table  sx = {{minWidth: 300, maxHeight: 140 }}  aria-label="table">
                <TableHead>
                    <TableRow>
                        <TableCell> ID </TableCell>
                        <TableCell align="right">Type</TableCell>
                        <TableCell align="right">Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Tokens.map((token) => (
                        <TableRow
                            key={token.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {ID++}
                            </TableCell>
                            <TableCell align="right">{token[0]}</TableCell>
                            <TableCell align="right">{token[1]}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function DebugTable({Debug}){
    return (
        <TableContainer component={Paper} sx={{ width: 200  }} >
            <Table  sx = {{minWidth: 200}} aria-label="table">
                <TableHead>
                    <TableRow>
                        <TableCell align={"center"}> Debug </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Debug.map((d) => (
                        <TableRow
                            key={d.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell style={{ color:d[0]===0?'black':d[0]===1?'blue':'red' }} component="th" scope="row">
                                {d[1]}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function SyntaxTable({Message}){
        let ID = 0;
        return (
            <TableContainer component={Paper}  >
                <Table    aria-label="table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{color: "black"}} > ID </TableCell>
                            <TableCell style={{color: "black"}} align="right" >Procedure</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Message.map((m) => (
                            <TableRow
                                key={ID}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {ID++}
                                </TableCell>
                                <TableCell align="right" style={{ color:m[1]===0?'black':m[1]===1?'blue':'red' }} component="th" scope="row">
                                    {m[0]}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
}

function Semantic_table({TAC}){
    let ID = 0;
    return (
        <TableContainer component={Paper} sx={{ width: 300,height: 693, mr:0  }} >
            <Table    aria-label="table">
                <TableHead>
                    <TableRow>
                        <TableCell style={{color: "black"}} > ID </TableCell>
                        <TableCell style={{color: "black"}} align="right" >TAC</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {TAC.map((t) => (
                        <TableRow
                            key={ID}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {ID++}
                            </TableCell>
                            <TableCell align="right" style={{ color:'black'}} component="th" scope="row">
                                {t}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function Symbol_table({symbol_table}){
    let ID = 0;
    return (
        <TableContainer component={Paper} sx={{ width: 370,height: 693 ,mr:5  }} >
            <Table  sx = {{maxWidth: 370, maxHeight: 140 }}  aria-label="table">
                <TableHead>
                    <TableRow>
                        <TableCell> ID </TableCell>
                        <TableCell align="right">Type</TableCell>
                        <TableCell align="right">name</TableCell>
                        <TableCell  align="right">Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {symbol_table.map((s) => (
                        <TableRow
                            key={ID}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {ID++}
                            </TableCell>
                            <TableCell align="right">{s[0]}</TableCell>
                            <TableCell align="right">{s[1]}</TableCell>
                            <TableCell align="right">{String(s[2])}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function Warning_table({warning}){
    return (
        <TableContainer component={Paper} sx={{ width: 370, mt:5  }} >
            <Table  sx = {{minWidth: 370}} aria-label="table">
                <TableHead>
                    <TableRow>
                        <TableCell align={"center"}> Warning </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {warning.map((w) => (
                        <TableRow
                            key={w.length}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell style={{ color:'red'}} component="th" scope="row">
                                {w}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function Advanced_table({Advanced}){
    let ID = 0;
    return (
        <TableContainer component={Paper} sx={{ width: 300,height: 693, mr:0  }} >
            <Table    aria-label="table">
                <TableHead>
                    <TableRow>
                        <TableCell style={{color: "black"}} > ID </TableCell>
                        <TableCell style={{color: "black"}} align="right" >TAC</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Advanced.map((a) => (
                        <TableRow
                            key={ID}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {ID++}
                            </TableCell>
                            <TableCell align="right" style={{ color:'black'}} component="th" scope="row">
                                {a}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

function CustomTabPanel(props) {
    const { value, index, Tokens,Debug,Message,TAC,symbol_table, warning, Advanced } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tab_panel-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            {index === 0 ?(
                <div className={"tables"}>
                    <BasicTable Tokens={Tokens}/>
                    <DebugTable Debug={Debug}/>
                </div>
            ): index === 1?(
                <div className={"tables"}>
                    {
                        Message.length === 0?null
                        :<SyntaxTable Message={Message}/>
                    }
                </div>
            ): index === 2?(
                <div className={"tables"}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <Symbol_table symbol_table={symbol_table} />
                        <Warning_table warning={warning}/>
                    </div>
                    {
                        TAC.length === 0?null
                            :<Semantic_table TAC={TAC}   />
                    }
                </div>
            ): index === 3?(
                <div className={"tables"}>
                    <Advanced_table Advanced={Advanced}/>
                </div>
            ): null
            }
        </div>
    );
}

// defining PropTypes
CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `tab-${index}`,
        'aria-controls': `tab_panel-${index}`,
    };
}

export default function Output({Tokens,Debug}) {
    const [value, setValue] = React.useState(0);
    const [Message, setMessage] = React.useState([]);
    const [TAC, setTAC] = React.useState([]);
    const [symbol_table, setsymbol_table] = React.useState([]);
    const [warning, setwarning] = React.useState([]);
    const [Advanced,setAdvanced] = React.useState([]);


    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 1){
            setMessage([]);
            const newMessage = Analyze(Tokens);
            setMessage(newMessage);
        }else if (newValue === 2){
            const newres = generate(Tokens);
            setTAC(newres[0]);
            setsymbol_table(newres[1]);
            setwarning(newres[2]);
        }else if (newValue === 3){
            setAdvanced([]);
            const newres = generate(Tokens);
            const newa = advanced(newres[0]);
            setAdvanced(newa);
        }
    };



    return (
        <Box sx={{ mr:10, width: 700, ml:5 }}>
            <Box sx={{  }}>
                <Tabs value={value} onChange={handleChange} textColor="secondary"
                      indicatorColor="secondary" aria-label="tabs">
                    <Tab label="Lexical" {...a11yProps(0)} />
                    <Tab label="Syntax " {...a11yProps(1)} />
                    <Tab label="Sementic " {...a11yProps(2)} />
                    <Tab label="Advanced " {...a11yProps(3)} />
                </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0} Tokens={Tokens} Debug={Debug} />
            <CustomTabPanel value={value} index={1} Message={Message}/>
            <CustomTabPanel value={value} index={2} TAC={TAC} symbol_table={symbol_table} warning={warning}/>
            <CustomTabPanel value={value} index={3} Advanced={Advanced}/>
        </Box>
    );
}