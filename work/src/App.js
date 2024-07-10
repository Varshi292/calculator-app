import logo from './logo.svg';
import './App.css';
import DigitButton from './DigitButton';
import {useReducer} from 'react';
import OperationButton from './OperationButton';

export const ACTIONS={
  ADD_DIGIT:'add-digit',
  DELETE_DIGIT:'delete-digit',
  CLEAR:'clear',
  EVALUATE:'evaluate',
  CHOOSE_OPERATION:'choose-operation'
}
function reducer(state,{type,payload}){
      switch(type){
        case ACTIONS.ADD_DIGIT:
          if(state.overwrite){
            return{
              ...state,
              currentoperand:payload.digit,
              overwrite:false
            }
          }
          if(payload.digit==="0" && state.currentoperand==="0"){
            return state;
          } 
          if(payload.digit==="." && state.currentoperand.includes(".")){
            return state;
          } 
          return{
            ...state,
            currentoperand:`${state.currentoperand || ""}${payload.digit}`,
          }
        case ACTIONS.CHOOSE_OPERATION:
          if(state.currentoperand==null && state.previousoperand==null){
            return state;
          }
          if(state.previousoperand==null){
            return{
              ...state,
              operation:payload.operation,
              previousoperand:state.currentoperand,
              currentoperand:null
              
            }
          }
          if(state.currentoperand==null){
            return{
              ...state,
              operation:payload.operation,
            }
          }
          return{
            ...state,
            previousoperand:evaluate(state),
            currentoperand:null,
            operation:payload.operation
          }
        case ACTIONS.CLEAR:
          return{}
        case ACTIONS.EVALUATE:
          if(state.operation==null || state.currentoperand==null || state.previousoperand==null){
            return state;
          }
          return{
            ...state,
            overwrite:true,
            previousoperand:null,
            operation:null,
            currentoperand:evaluate(state),
          }
        case ACTIONS.DELETE_DIGIT:
          if(state.overwrite){
            return{
              ...state,
              overwrite:false,
              currentoperand:null
            }
          }
          if(state.currentoperand==null) return state
          if(state.currentoperand.length===1){
            return{
              ...state,
              currentoperand:null,
            }
          }
          return{
            ...state,
            currentoperand: state.currentoperand.slice(0,-1)
          }


        default:
          return state;

      }
}
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us",{
  maximumFractionDigits:0,
})
function formatOperand(operand){
  if(operand == null) return
  const [integer,decimal] = operand.split(".");
  if(decimal==null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function evaluate({previousoperand,currentoperand,operation}){
     const prev= parseFloat(previousoperand);
     const current=parseFloat(currentoperand);
     if(isNaN(prev) || isNaN(current)) return ""
     let computation=""
     switch(operation){
      case "+": 
          computation=prev+current
          break
      case "-":
        computation=prev-current
        break
      case "*":
        computation=prev*current
          break
      case "÷":
        computation=prev/current
          break
     }
     return computation.toString()
}
function App() { 
  const [{ currentoperand , previousoperand , operation },dispatch]= useReducer(reducer,{});
  return ( 
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">{formatOperand(previousoperand)} {operation}</div>
        <div className="current-operand">{formatOperand(currentoperand)}</div>
    </div>
        <button className="span-two" onClick={()=>dispatch({type:ACTIONS.CLEAR})}>AC</button>
        <button onClick={()=>dispatch({type:ACTIONS.DELETE_DIGIT})}>DEL</button>
        <OperationButton dispatch={dispatch} operation="÷"/>
        <DigitButton dispatch={dispatch} digit="1"/>
        <DigitButton dispatch={dispatch} digit="2"/>
        <DigitButton dispatch={dispatch} digit="3"/>
        <OperationButton dispatch={dispatch} operation="*"/>
        <DigitButton dispatch={dispatch} digit="4"/>
        <DigitButton dispatch={dispatch} digit="5"/>
        <DigitButton dispatch={dispatch} digit="6"/>
        <OperationButton dispatch={dispatch} operation="+"/>
        <DigitButton dispatch={dispatch} digit="7"/>
        <DigitButton dispatch={dispatch} digit="8"/>
        <DigitButton dispatch={dispatch} digit="9"/>
        <OperationButton dispatch={dispatch} operation="-"/>
        <DigitButton dispatch={dispatch} digit="."/>
        <DigitButton dispatch={dispatch} digit="0"/>
        <button className="span-two" onClick={()=>dispatch({type:ACTIONS.EVALUATE})}>=</button>
      
    </div>
  
    
  );
}

export default App;
