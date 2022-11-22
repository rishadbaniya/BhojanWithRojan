import { useLongPress } from "use-long-press"
import {useState} from 'react';

const NumberPad = ({state, updateState}) => {
    const onNumberPadButtonClick = (v) => {
        if(v.type === "NUMBER"){
            updateState(state + v.value);
        }else if(v.type === "COMMAND"){
            if(v.value === "Clear"){
                updateState("");
            }else if(v.value === "Backspace"){
                updateState(state.substring(0, state.length - 1));
            }
        }
    }
    return <div className="number_pad">
        <div className="number_pad_numbers">
            <NumberPadButton value={1} onClick={onNumberPadButtonClick}/>
            <NumberPadButton value={2} onClick={onNumberPadButtonClick}/>
            <NumberPadButton value={3} onClick={onNumberPadButtonClick}/>
        </div>
        <div className="number_pad_numbers">
            <NumberPadButton value={4} onClick={onNumberPadButtonClick}/>
            <NumberPadButton value={5} onClick={onNumberPadButtonClick}/>
            <NumberPadButton value={6} onClick={onNumberPadButtonClick}/>
        </div>
        <div className="number_pad_numbers">
            <NumberPadButton value={7} onClick={onNumberPadButtonClick}/>
            <NumberPadButton value={8} onClick={onNumberPadButtonClick}/>
            <NumberPadButton value={9} onClick={onNumberPadButtonClick}/>
        </div>
        <div className="number_pad_numbers">
            <NumberPadButton value={"⌫"} onClick={onNumberPadButtonClick}/>
            <NumberPadButton value={0} onClick={onNumberPadButtonClick}/>
            <NumberPadButton value={"AC"} onClick={onNumberPadButtonClick}/>
        </div>
    </div>
}

const NUMPAD_BUTTON_STYLE = {
    INACTIVE : {
      "background" : "linear-gradient(145deg, #f0f0f0, #cacaca)",
      "boxShadow" : "5px 5px 10px #797979, -5px -5px 10px #ffffff"
    },
  
    ACTIVE : {
      "background" : "#e0e0e0",
      "boxShadow" : "inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff",
     }
  }

const NumberPadButton = ({onClick, value}) =>{
    const [currentStyle, updateStyle] = useState(NUMPAD_BUTTON_STYLE.INACTIVE);
    const bind = useLongPress(()=>{},{
        onStart : () =>{
            updateStyle(NUMPAD_BUTTON_STYLE.ACTIVE);
            if(value === "AC"){
                onClick({
                    type : "COMMAND",
                    value : "Clear"
                });
            }else if(value === "⌫"){
                onClick({
                    type : "COMMAND",
                    value : "Backspace"
                });
            }else{
                onClick({
                    type : "NUMBER",
                    value : value 
                });
            }

        },
        onFinish : () =>{
            updateStyle(NUMPAD_BUTTON_STYLE.INACTIVE);
        },
        filterEvents: event => true, // All events can potentially trigger long press
        threshold: 0,
        captureEvent: true,
        cancelOnMovement: false,
        detect: 'both',
    }); 

    return <div style={currentStyle} {...bind()} className="number_pad_button">{value}</div>
}

export {NumberPad, NumberPadButton};