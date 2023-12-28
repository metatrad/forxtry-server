import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoMdArrowRoundUp } from "react-icons/io";
import { IoMdArrowRoundDown } from "react-icons/io";
import { useFormik } from "formik";
import { tradeAction, tradebalAction } from "../redux/tradeSlice";
import { fetchAllPercAction } from "../redux/percSlice";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { GiTrade } from "react-icons/gi";
import { FaHistory } from "react-icons/fa";
import { Link } from "react-router-dom";
import { PiCurrencyCircleDollarFill } from "react-icons/pi";
import { MdAccessTime } from "react-icons/md";
import "../styles/trading.css";

//form validation
const formSchema = Yup.object({
  time: Yup.string(),
  investment: Yup.number().required("This field is required"),
  up: Yup.string(),
  down: Yup.string(),
  result: Yup.string(),
  payout: Yup.number(),
  calculatedResult: Yup.number(),
  tradeResult: Yup.string(),
});

const Tradebtns = () => {

  const percs = useSelector((state) => state?.perc?.percList?.[0]);

  const perc = percs?.perc;

  //get deposit created from store
  const state = useSelector((state) => state?.trading);
  const { appErr, loading, serverErr, tradeCreated, isTradeCreated } = state;

  //sbumitting form
  const dispatch = useDispatch();

  //formik form
  const formik = useFormik({
    initialValues: {
      time: "",
      investment: 0,
      result: "",
      calculatedResult: "",
      tradeResult: "",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const trade = await dispatch(tradeAction(values))

        // const successCondition = (trade) => trade.isTradeCreated === true;
        if(trade?.payload?.alert){
          if (countdown > 0 && !timer){
            setSeconds(countdown*60);
            setTimer(
              setInterval(() => {
                setSeconds((prevSeconds) => {
                  if (prevSeconds > 0) {
                    return prevSeconds - 1;
                  } else {
                    clearInterval(timer);
                    setTimer(null);
      
                    const tradeResult = Math.random() < perc ? "Win" : "Loss";
    
                    if (tradeResult === "Win"){
                      dispatch(tradebalAction(values))
                    }
                    
                    setResult(tradeResult);
      
                    formik.setFieldValue("tradeResult", tradeResult);
                    
                    setTimeout(() => {
                      setResult(null);
                    }, 100);
                    return 0;
                  }
                });
              }, 1000)
            );
          resetForm({ values: "" });
        }
        }

      } catch (error) {
        console.error("Dispatch failed:", error);
      }
        
    },
    validationSchema: formSchema,
  });

  useEffect(() => {
    if (tradeCreated)
      toast.success("Trade placed");
  }, [ dispatch, tradeCreated]);

  //trade

  //trade result
  const [result, setResult] = useState(null);

  useEffect(() => {
    dispatch(fetchAllPercAction());
  }, [dispatch]);

  const handleIChange = (event) => {
    const { name, value } = event.target;

    // Perform the calculation (double the input value)
    const calculatedResult = Math.floor(value ? parseFloat(value) * 1.3 : "");

    // Update the formik values and trigger re-render
    formik.setFieldValue(name, value);
    formik.setFieldValue("calculatedResult", calculatedResult);
  };

    //timer
    const [countdown, setCountdown] = useState(0);
    const [seconds, setSeconds] = useState(0);
    const [timer, setTimer] = useState(null);
  
    const handleInputChange = (event) => {
      const inputValue = parseInt(event.target.value, 10);
      setCountdown(Math.max(1, inputValue)); 
    };

    useEffect(() => {
      return () => {
        clearInterval(timer);
      };
    }, [timer]);

  useEffect(() => {
    if (result) {
      toast(`${result === "Win" ? "Trade won" : "Trade lost"}`, {
        type: result === "Win" ? "success" : "error",
      });
    }
  }, [result]); 

  return (
    <div className="trade-btns-cover-wrapper">
      <div className="place-trades">
        <div className="buttons">
          <form action="" onSubmit={formik.handleSubmit}>
          {appErr || serverErr ? <div className="show-error-top">{appErr}</div> : null}
            <h2><GiTrade />Place trade</h2>

            <div className="inputs-trade-wrapper">
              <div>
                <label htmlFor="time">Timer(minutes)</label>
                <h1 className="time-div">
                <MdAccessTime size={25}/>
                <input type="number" name="time" id="time" min="1" value={countdown} onChange={handleInputChange}/>
                </h1>
              </div>
              <div>
                <label htmlFor="investment">Stake</label>
                <h1 className="investment-div">
                  <PiCurrencyCircleDollarFill size={25}/>
                <input type="number" name="investment" id="investment" value={formik.values.investment} onChange={handleIChange} onBlur={formik.handleBlur("investment")}/>
                </h1>
              </div>
            </div>
            {formik.values.calculatedResult !== null && (
              <p className="payout-text-mb">
                Payout: <h6>${formik.values.calculatedResult}</h6>
              </p>
            )}

            <div className="trade-btns-wrapper">
              <button 
                className="trade-btn even"
              >
                Up <IoMdArrowRoundUp className="icon" />
              </button>
              {formik.values.calculatedResult !== null && (
                <p className="payout-text-dt">
                  Payout: <h6>${formik.values.calculatedResult}</h6>
                </p>
              )}
              <button
                className="trade-btn odd"
              >
                Down <IoMdArrowRoundDown className="icon" />
              </button>
            </div>
            <p className="time-left-mb">Trade ends in: <span>{Math.round(seconds/60)} minute(s), {seconds} seconds.</span></p>
          </form>
        </div>
      </div>
      <div className="time-history">
            <div>
              <p className="time-left-dk">Trade ends in: <span>{Math.round(seconds/60)} minute(s), {seconds} seconds.</span></p>
              <div className="view-trade-history">
                <FaHistory size={40} color="gray"/>
                <Link to="/transactions">View transaction history</Link> 
              </div>
            </div>
      </div>
    </div>
  );
};

export default Tradebtns;
