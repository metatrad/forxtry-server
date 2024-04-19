import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoMdArrowRoundUp } from "react-icons/io";
import { IoMdArrowRoundDown } from "react-icons/io";
import { useFormik } from "formik";
import { tradeAction } from "../redux/tradeSlice";
import { fetchAllPercAction } from "../redux/percSlice";
import { userProfileAction } from "../redux/userSlice";
import * as Yup from "yup";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import Audiop from "../audio/placed.mp3";
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

  const perc = percs?.perc;

  //get deposit created from store
  const bal = useSelector((state) => state?.trading.balance);

  const state = useSelector((state) => state?.user);
  const { userLoading, userAppErr, userServerErr, profile } = state;

  const states = useSelector((state) => state?.trading);
  const {
    appErr,
    loading,
    tradeloading,
    serverErr,
    tradeCreated,
    isTradeCreated,
  } = states;

  const [showGlow, setShowGlow] = useState(false);

  //fetch trade
  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch(userProfileAction(+page));
  }, [dispatch, page, setPage]);

  //formik form
  const formik = useFormik({
    initialValues: {
      time: 0,
      investment: "",
      calculatedResult: "",
      tradeResult: "Pending",
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        const trade = await dispatch(tradeAction(values));
        if (trade?.payload?.alert) {
          new Audio(Audiop).play();
          resetForm({ values: "" });
          setShowGlow(true);

          // Reset the glow after 2 seconds
          setTimeout(() => {
            setShowGlow(false);
          }, 2000);
        }
      } catch (error) {
        console.error("Dispatch failed:", error);
      }
    },
    validationSchema: formSchema,
  });

  const handleIChange = (event) => {
    const { name, value } = event.target;
    const calculatedResult = Math.floor(value ? parseFloat(value) * 1.1 : "");
    formik.setFieldValue(name, value);
    formik.setFieldValue("calculatedResult", calculatedResult);
  };

  return (
    <div className="trade-btns-cover-wrapper">
        {showGlow && <div className="glow"><div className="glow-t-in">Trade!</div></div>}
      <div className="place-trades">
        <div className="buttons">
          <form action="" onSubmit={formik.handleSubmit}>
            {appErr || serverErr ? (
              <div className="show-error-top">{appErr}</div>
            ) : null}
            <div className="inputs-trade-wrapper">
              <div className="time-cover">
                <h1 className="time-div">
                  <input
                    type="number"
                    name="time"
                    id="time"
                    min="1"
                    value={formik.values.time}
                    onChange={formik.handleChange("time")}
                  />
                </h1>
                <label htmlFor="time">Time</label>
              </div>
              <div className="investment-cover">
                <h1 className="investment-div">
                  <input
                    type="number"
                    name="investment"
                    placeholder="Stake"
                    id="investment"
                    min="10"
                    value={formik.values.investment}
                    onChange={handleIChange}
                    onBlur={formik.handleBlur("investment")}
                  />
                </h1>
                {formik.values.calculatedResult !== null && (
                  <p className="payout-text-dt">
                    Payout: <h6>${formik.values.calculatedResult}</h6>
                  </p>
                )}
              </div>
            </div>

            <div className="trade-btns-wrapper">
              <button type="submit" className="trade-btn even">
                <IoMdArrowRoundUp className="icon up-icon" />
                {tradeloading ? "Placing.." : "Up"}
                <p></p>
              </button>
              <button type="submit" className="trade-btn odd">
                <p></p>
                {tradeloading ? "Placing.." : "Down"}
                <IoMdArrowRoundDown className="icon down-icon" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Tradebtns;
