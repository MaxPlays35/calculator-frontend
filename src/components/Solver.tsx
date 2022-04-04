import React from "react";
import {TextField} from "@mui/material";
import {MathJax} from "better-react-mathjax";
import {LoadingButton} from "@mui/lab";
import client from "../axios";

interface props {
    open: Function
}


function Solver(props: props) {
    const [expr, setExpr] = React.useState("");
    const [start, setStart] = React.useState("")
    const [end, setEnd] = React.useState("")
    const [root, setRoot] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const input = React.useRef(null)

    const handleInput1 = (e: React.ChangeEvent<any>) => {
        setExpr(e.target.value)
        setRoot("")
    }

    const handleInput2 = (e: React.ChangeEvent<any>) => {
        setStart(e.target.value)
        setRoot("")
    }

    const handleInput3 = (e: React.ChangeEvent<any>) => {
        setEnd(e.target.value)
        setRoot("")
    }

    const solve = async () => {
        setLoading(true)
        try {
            let resp = await client.post("solve", {
                "expression": expr,
                "start": parseFloat(start),
                "end": parseFloat(end)
            })
            setLoading(false)
            if (!resp.data["error"]) {
                setRoot(resp.data["answer"])
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
                <TextField variant="outlined" value={start} label="Start"
                           onChange={handleInput2} type="number"/>
                <TextField variant="outlined" value={end} label="End"
                           onChange={handleInput3} type="number"/>
            </div>
            <MathJax>{`$${expr}$`}</MathJax>
            <LoadingButton variant="contained" loading={loading} onClick={() => solve()}>Solve</LoadingButton>
            {
                root !== "" &&
                    <MathJax>{`$x\\approx${root}$`}</MathJax>
                // <Typography variant="h6">
                //     x={root}
                // </Typography>
            }
        </div>
    )
}

export default Solver
