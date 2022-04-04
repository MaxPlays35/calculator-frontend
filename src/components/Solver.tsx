import React from "react";
import {TextField} from "@mui/material";
import {MathJax, MathJaxContext} from "better-react-mathjax";
import {LoadingButton} from "@mui/lab";
import client from "../axios";

interface props {
    config: any
    open: Function
}


function Solver(props: props) {
    const [expr, setExpr] = React.useState("");
    const [start, setStart] = React.useState("")
    const [end, setEnd] = React.useState("")
    const [root, setRoot] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const input = React.useRef(null)

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
                <TextField variant="outlined" value={start} label="Start"
                           onChange={(e) => setStart(e.target.value)} type="number"/>
                <TextField variant="outlined" value={end} label="End"
                           onChange={(e) => setEnd(e.target.value)} type="number"/>
            </div>
            <MathJaxContext config={props.config}>
                <MathJax>{`$${expr}$`}</MathJax>
            </MathJaxContext>
            <LoadingButton variant="contained" loading={loading} onClick={() => solve()}>Solve</LoadingButton>
            {
                root !== "" &&
                <MathJaxContext config={props.config}>
                    <MathJax>{`$x\\approx${root}$`}</MathJax>
                </MathJaxContext>
                // <Typography variant="h6">
                //     x={root}
                // </Typography>
            }
        </div>
    )
}

export default Solver
