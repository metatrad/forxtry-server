import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { IoMdArrowRoundUp } from "react-icons/io";
import { IoMdArrowRoundDown } from "react-icons/io";
import { PiDiamondsFourDuotone } from "react-icons/pi";
import { TbTriangleSquareCircle } from "react-icons/tb";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { useFormik } from "formik";
import { tradeAction } from '../redux/tradeSlice';
import { fetchAllPercAction } from '../redux/percSlice';
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import 'react-toastify/dist/ReactToastify.css';
import { GiTrade } from "react-icons/gi";
import { debounce } from 'lodash';
import '../styles/trading.css'

let tvScriptLoadingPromise;

//form validation
const formSchema = Yup.object({
  time: Yup.string().required("This field is required"),
  investment: Yup.number().required("This field is required"),
  up: Yup.string(),
  down: Yup.string(),
  result: Yup.string(),
  payout: Yup.number(),
});

export default function TradingViewWidget() {

  //timer
  const [countdown, setCountdown] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState(null);

  const handleInputChange = (event) => {
    setCountdown(parseInt(event.target.value, 10));
  };

  const startCountdown = () => {
  };

  useEffect(() => {
    return () => {
      clearInterval(timer);
    };
  }, [timer]);


  //sbumitting form
    //dispatch
    const dispatch = useDispatch();

    //formik form
    const formik = useFormik({
      initialValues: {
        time: "",
        investment: "",
        up: "",
        down: "",
        result: "",
        payout: "",
      },
      onSubmit: (values, {resetForm}) =>{
        dispatch(tradeAction(values))
        resetForm({values: ''})
      },
      validationSchema: formSchema,
    })

    //get deposit created from store
    const state = useSelector(state => state?.trading)
    console.log(state)
    const {appErr, loading, serverErr, tradeCreated, isTradeCreated} = state;

    useEffect(()=>{
      if(isTradeCreated)
      toast("Trade placed", {
        className: "toast-message-trading",
      });
    }, [isTradeCreated, dispatch]);

    //trade

    //trade result
  const [prediction, setPrediction] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(()=>{
      dispatch(fetchAllPercAction())
  },[dispatch])

  const percs = useSelector(state => state?.perc?.percList?.[0])
  console.log(percs)

  const perc = percs?.perc

  console.log(perc)

  const handlePrediction = (selectedPrediction) => {
    if (countdown > 0 && !timer) {
      setSeconds(countdown);
      setTimer(
        setInterval(() => {
          setSeconds((prevSeconds) => {
            if (prevSeconds > 0) {
              return prevSeconds - 1;
            } else {
              clearInterval(timer);
              setTimer(null);
  
              // Simulated trading logic
              const randomOutcome = Math.random() < perc ? 'Up' : 'Down';
              const tradeResult = randomOutcome === selectedPrediction ? 'Win' : 'Loss';
              setResult(tradeResult);
              return 0;
            }
          });
        }, 1000)
      );
    }
  
    setPrediction(selectedPrediction);
  };
  useEffect(() => {
    if (result) {
      // Display toast based on the trade result
      toast(`${result === 'Win' ? 'Trade won' : 'Trade lost'}`, {
        type: result === 'Win' ? 'success' : 'error',
      });
    }
  }, [result]);

  const handleIChange = (event) => {
    const { name, value } = event.target;

    // Perform the calculation (double the input value)
    const calculatedResult = value ? parseFloat(value) * 1.30 : '';

    // Update the formik values and trigger re-render
    formik.setFieldValue(name, value);
    formik.setFieldValue('calculatedResult', calculatedResult);
  };
    
  const onLoadScriptRef = useRef();

  useEffect(
    () => {
      onLoadScriptRef.current = createWidget;

      if (!tvScriptLoadingPromise) {
        tvScriptLoadingPromise = new Promise((resolve) => {
          const script = document.createElement('script');
          script.id = 'tradingview-widget-loading-script';
          script.src = 'https://app.requestly.io/delay/1200000/s3.tradingview.com/tv.js';
          script.type = 'text/javascript';
          script.onload = resolve;

          document.head.appendChild(script);
        });
      }

      tvScriptLoadingPromise.then(() => onLoadScriptRef.current && onLoadScriptRef.current());

      return () => onLoadScriptRef.current = null;

      function createWidget() {
        if (document.getElementById('tradingview_ee15e') && 'TradingView' in window) {
          new window.TradingView.widget({
            autosize: true,
            symbol: "NASDAQ:AAPL",
            timezone: "Etc/UTC",
            theme: "dark",
            style: "1",
            locale: "en",
            gridColor: "rgba(240, 243, 250, 0.07)",
            allow_symbol_change: true,
            popup_width: "1000",
            popup_height: "650",
            container_id: "tradingview_ee15e"
          });
        }
      }
    },
    []
  );

  return (
    <div className='tradingview-widget-container' style={{ height: "88.5vh", width: "100%" }}>
      <div id='tradingview_ee15e' style={{ height: "calc(100%)", width: "100%" }} />

      <div className="place-trades">
        <div className="buttons">
 
          <form action="" onSubmit={formik.handleSubmit}>
            <h1><GiTrade/>Place trade</h1>

            <div className="inputs-trade-wrapper">
            <div>
            <label htmlFor="time">Timer</label>
            <input type="number" name='time' id='time' value={countdown} onChange={handleInputChange}/>
            </div>
            <div>
            <label htmlFor="investment">Investment</label>
            <input type="number" name='investment' id='investment' value={formik.values.investment} onChange={handleIChange} onBlur = {formik.handleBlur("investment")}/>
            </div>
            </div>

            <div><p>Time remaining: {seconds} seconds</p></div>

            {formik.values.calculatedResult !== null && (<p className='payout-text-mb'>Payout: <h6>{formik.values.calculatedResult}</h6></p>)}

            <div className="trade-btns-wrapper">
            <button onClick={() => handlePrediction('Up')} className='trade-btn even'>Up <IoMdArrowRoundUp className='icon'/></button>
            {formik.values.calculatedResult !== null && (<p className='payout-text-dt'>Payout: <h6>{formik.values.calculatedResult}</h6></p>)}
            <button onClick={() => handlePrediction('Down')} className='trade-btn odd'>Down <IoMdArrowRoundDown className='icon'/></button>
            </div>
            {prediction && (
             <p>Your prediction: <strong>{prediction}</strong></p>
             )}
             {result && (<p>Result: <strong>{result}</strong></p>
             )}
          </form> 

        </div>
      </div>
    </div>
  );
}




