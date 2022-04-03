import {TextField, Typography} from "@mui/material";
import {MathJax, MathJaxContext} from "better-react-mathjax";
import {LoadingButton} from "@mui/lab";
import React from "react";
import client from "../axios";

interface props {
    config: any
    open: Function
}


function Integrator(props: props) {
    const [expr, setExpr] = React.useState("");
    const [startIntegral, setStartIntegral] = React.useState(0)
    const [endIntegral, setEndIntegral] = React.useState(0)
    const [integralValue, setIntegralValue] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const input = React.useRef(null)

    const calculateIntegral = async () => {
        setLoading(true)
        try {
            const resp = await client.post("integral", {
                "expression": expr,
                "start": startIntegral,
                "end": endIntegral
            })
            setLoading(false)
            if (!resp.data["error"]) {
                setIntegralValue(resp.data["answer"])
                return
            }

            //@ts-ignore
            input.current.focus()
            //@ts-ignore
            input.current.selectionStart = resp.data["index"] + 1
            //@ts-ignore
            input.current.selectionEnd = resp.data["index"] + 2
            props.open()
        } catch (e) {
            console.log(e)
            props.open()
            setLoading(false)
            return
        }
    }

    return (
        <div className="space-y-3">
            <TextField variant="outlined" value={expr} label="Expression"
                       onChange={(e) => setExpr(e.target.value)} fullWidth inputRef={input}/>
            <div className="flex flex-row">
                <TextField variant="outlined" value={startIntegral} label="Start"
                           onChange={(e) => setStartIntegral(parseFloat(e.target.value))} type="number"/>
                <TextField variant="outlined" value={endIntegral} label="End"
                           onChange={(e) => setEndIntegral(parseFloat(e.target.value))} type="number"/>
            </div>
            <MathJaxContext config={props.config}>

                <MathJax>{`$\\int_{${startIntegral}}^${endIntegral} ${expr} dx$`}</MathJax>
            </MathJaxContext>
            <LoadingButton variant="contained" loading={loading}
                           onClick={() => calculateIntegral()}>Calculate</LoadingButton>
            {
                integralValue !== "" &&
                <Typography variant="h6">
                    f(x)={integralValue}
                </Typography>
            }
        </div>
    )
}

export default Integrator
