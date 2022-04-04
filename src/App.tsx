import React from 'react';
import './App.css';
import {
    Box,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Paper,
    Tab,
    Typography,
    Button, Slide
} from '@mui/material';
import {TabContext, TabList, TabPanel} from "@mui/lab"
import Calculator from "./components/Calculator";
import Solver from "./components/Solver";
import Integrator from "./components/Integrator";
import {TransitionProps} from "@mui/material/transitions";

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
        children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function App() {
    const [value, setValue] = React.useState('1');
    const [open, setOpen] = React.useState(false);
    const [error, setError] = React.useState("")
    const handleOpen = (text: string) => {
        setOpen(true)
        setError(text)
    }
    const handleClose = () => {
        setOpen(false)
        setError("")
    };
    

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };


    return (
        <Grid container alignItems="center" direction="column" justifyContent="center" className={"w-screen h-screen"}>
            <Paper color="green" className={"p-10 text-center space-y-2 rounded-2xl"}>
                <Typography variant="h5">
                    Powerful Math Calculator
                </Typography>
                <Box sx={{width: '100%', typography: 'body1'}}>
                    <TabContext value={value}>
                        <Box alignItems="center" justifyContent="center" sx={{borderBottom: 1, borderColor: 'divider'}}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab label="Calculator" value="1"/>
                                <Tab label="Solver" value="2"/>
                                <Tab label="Integral" value="3"/>
                            </TabList>
                        </Box>
                        <TabPanel value="1" className={"space-y-3"}>
                            <Calculator open={handleOpen}/>
                        </TabPanel>
                        <TabPanel value="2" className="space-y-3">
                            <Solver open={handleOpen}/>
                        </TabPanel>
                        <TabPanel value="3" className="space-y-3">
                            <Integrator open={handleOpen}/>
                        </TabPanel>
                    </TabContext>
                </Box>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle>{"Unexpected error!"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Something went wrong. Please try again or check you expression(I moved cursor for you)
                            <p>Detailed error: {error ?? "🥳"}</p>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Ok</Button>
                    </DialogActions>
                </Dialog>
            </Paper>
        </Grid>
    );
}

export default App;
