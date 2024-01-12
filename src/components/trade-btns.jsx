import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoMdArrowRoundUp } from "react-icons/io";
import { IoMdArrowRoundDown } from "react-icons/io";
import { BsCurrencyDollar } from "react-icons/bs";
import { useFormik } from "formik";
import {tradeAction,tradebalAction,tradelostAction,} from "../redux/tradeSlice";
import { fetchAllPercAction } from "../redux/percSlice";
import { userProfileAction } from "../redux/userSlice";
import Place from "../images/placetrade.png";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { FaHistory } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import Audiop from "../audio/placed.mp3";
import Audiow from "../audio/won.mp3";
import Audiol from "../audio/lost.mp3";
import "../styles/trading.css";

React.StrictMode = React.Fragment;

//form validation
const formSchema = Yup.object({
  time: Yup.string().required("Enter duration of trade"),
  investment: Yup.number().required("This field is required"),
  calculatedResult: Yup.number(),
  tradeResult: Yup.string(),
});

const Tradebtns = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAllPercAction());
  }, [dispatch]);

  const percs = useSelector((state) => state?.perc?.percList?.[0]);

  //timer
  const [result, setResult] = useState(null);

  const [countdown, setCountdown] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [timer, setTimer] = useState(null);
  const [expirationTime, setExpirationTime] = useState(null);

  const perc = percs?.perc;

  //get deposit created from store
  const bal = useSelector((state) => state?.trading.balance);

  const state = useSelector((state) => state?.user);
  const { userLoading, userAppErr, userServerErr, profile } = state;

  console.log(profile?.trade)

  const states = useSelector((state) => state?.trading);
  const {
    appErr,
    loading,
    tradeloading,
    serverErr,
    tradeCreated,
    isTradeCreated,
  } = states;

  //fetch trade
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(userProfileAction(+page));
  }, [dispatch, page, setPage]);

  const trades = profile?.trade || [];

  //sbumitting form
  //formik form
  const formik = useFormik({
    initialValues: {
      time: 0,
      investment: 0,
      calculatedResult: "",
      tradeResult: "Pending",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const trade = await dispatch(tradeAction(values));

        // const successCondition = (trade) => trade.isTradeCreated === true;
        if (trade?.payload?.alert) {
          new Audio(Audiop).play();
          if (countdown > 0 && !timer) {
            setSeconds(countdown*60);
            setTimer(
              setInterval(() => {
                setSeconds((prevSeconds) => {
                  if (prevSeconds > 0) {
                    return prevSeconds - 1;
                  } else {
                    setTimer(null);
                    clearInterval(timer);

                    const tradeResults = Math.random() < perc ? "Win" : "Loss";

                    if (tradeResults === "Win") {
                      new Audio(Audiow).play();
                      dispatch(tradebalAction(values));
                    }
                    if (tradeResults === "Loss") {
                      new Audio(Audiol).play();
                      dispatch(tradelostAction(values));
                    }

                    setResult(tradeResults);

                    setTimeout(() => {
                      setResult(null);
                    }, 100);

                    return 0;
                  }
                });
              }, 1000)
            );
            toast.success("Trade placed");
            resetForm({ values: "" });
          }
        }
      } catch (error) {
        console.error("Dispatch failed:", error);
      }
    },
    validationSchema: formSchema,
  });


  const handleIChange = (event) => {
    const { name, value } = event.target;

    // Perform the calculation (double the input value)
    const calculatedResult = Math.floor(value ? parseFloat(value) * 1.3 : "");

    // Update the formik values and trigger re-render
    formik.setFieldValue(name, value);
    formik.setFieldValue("calculatedResult", calculatedResult);
  };

  const handleInputTChange = (event) => {
    const inputValue = parseInt(event.target.value, 10);

    formik.setFieldValue("time", inputValue);
    setCountdown(Math.max(1, inputValue));
  };

  useEffect(() => {
    return () => {
      clearInterval(timer);
    };
  }, [timer]);

  useEffect(() => {
    setTimer(null);
    if (result) {
      toast(`${result === "Win" ? "Trade won" : "Trade lost"}`, {
        type: result === "Win" ? "success" : "error",
      });
    }
  }, [result]);

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="trade-btns-cover-wrapper">
      <div className="place-trades">
        <div className="buttons">
          <form action="" onSubmit={formik.handleSubmit}>
            {appErr || serverErr ? (
              <div className="show-error-top">{appErr}</div>
            ) : null}
            <h2 className="place-trade-top-text">
              <img src={Place} alt="" /> Place trade{" "}
              <span>{formatTime(Math.round(seconds))}</span>
            </h2>

            <div className="inputs-trade-wrapper">
              <div>
                <label htmlFor="time">Time</label>
                <h1 className="time-div">
                  <MdAccessTime size={20} />
                  <input
                    type="number"
                    name="time"
                    id="time"
                    min="1"
                    value={formik.values.time}
                    onChange={handleInputTChange}
                  />
                </h1>
                <p className="trade-under-text">MINUTES</p>
              </div>
              <div>
                <label htmlFor="investment">Stake</label>
                <h1 className="investment-div">
                  <BsCurrencyDollar size={20} />
                  <input
                    type="number"
                    name="investment"
                    id="investment"
                    min="10"
                    value={formik.values.investment}
                    onChange={handleIChange}
                    onBlur={formik.handleBlur("investment")}
                  />
                </h1>
                <p className="trade-under-text">AMOUNT</p>
              </div>
            </div>
            {formik.values.calculatedResult !== null && (
              <p className="payout-text-mb">
                Payout: <h6>${formik.values.calculatedResult}</h6>
              </p>
            )}

            <div className="trade-btns-wrapper">
              <button type="submit" className="trade-btn even">
                {tradeloading ? "Placing.." : "Up"}
                <IoMdArrowRoundUp className="icon" />
              </button>
              {formik.values.calculatedResult !== null && (
                <p className="payout-text-dt">
                  Your payout: <h6>${formik.values.calculatedResult}</h6>
                </p>
              )}
              <button type="submit" className="trade-btn odd">
                {tradeloading ? "Placing.." : "Down"}{" "}
                <IoMdArrowRoundDown className="icon" />
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="time-history">
        <div className="time-history-cover">
          <p className="time-left-dk">Trade ends:</p>
          <div className="view-trade-history">
            <FaHistory size={40} color="gray" />
            <span> {formatTime(Math.round(seconds))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tradebtns;
