import {TextField} from "@mui/material";
import {MathJax} from "better-react-mathjax";
import {LoadingButton} from "@mui/lab";
import React from "react";
import client from "../axios";

interface props {
    open: Function
}


function Integrator(props: props) {
    const [expr, setExpr] = React.useState("");
    const [startIntegral, setStartIntegral] = React.useState("")
    const [endIntegral, setEndIntegral] = React.useState("")
    const [integralValue, setIntegralValue] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const input = React.useRef(null)

    const handleInput1 = (e: React.ChangeEvent<any>) => {
        setExpr(e.target.value)
        setIntegralValue("")
    }

    const handleInput2 = (e: React.ChangeEvent<any>) => {
        setStartIntegral(e.target.value)
        setIntegralValue("")
    }

    const handleInput3 = (e: React.ChangeEvent<any>) => {
        setEndIntegral(e.target.value)
        setIntegralValue("")
    }

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
            input.current.selectionStart = resp.data["index"]
            //@ts-ignore
            input.current.selectionEnd = resp.data["index"] + 1
            props.open(resp.data["errorText"])
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
                       onChange={handleInput1} fullWidth inputRef={input}/>
            <div className="flex flex-row">
                <TextField variant="outlined" value={startIntegral} label="Start"
                           onChange={handleInput2} type="number"/>
                <TextField variant="outlined" value={endIntegral} label="End"
                           onChange={handleInput3} type="number"/>
            </div>
                <MathJax>{`$\\int_{${startIntegral}}^${endIntegral} ${expr} dx ${integralValue !== "" ? `\\approx${integralValue}` : ""} $ `}</MathJax>
            <LoadingButton variant="contained" loading={loading}
                           onClick={() => calculateIntegral()}>Calculate</LoadingButton>
        </div>
    )
}

export default Integrator
