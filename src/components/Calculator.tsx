import React from 'react'
import {MathJax, MathJaxContext} from "better-react-mathjax";
import {LoadingButton} from "@mui/lab"
import {TextField, Typography} from "@mui/material";
import client from '../axios';


interface props {
    config: any
    open: Function
}

function Calculator(props: props) {
    const [expr, setExpr] = React.useState("");
    const [loading, setLoading] = React.useState(false)
    const [result, setResult] = React.useState("")
    const input = React.useRef(null)
    const calculate = async () => {
        setLoading(true)
        try {
            const resp = await client.post("calculate", {"expression": expr})
            setLoading(false)
            console.log(resp.data)
            if (!resp.data["error"]) {
                setResult(resp.data["answer"])
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
            <MathJaxContext config={props.config}>
                <MathJax>{`$${expr}$`}</MathJax>
            </MathJaxContext>
            <LoadingButton variant="contained" loading={loading} onClick={() => calculate()}>Calculate</LoadingButton>
            {
                result !== "" &&
                <Typography variant="h6">
                    f(x)={result}
                </Typography>
            }
        </div>
    )
}

export default Calculator
