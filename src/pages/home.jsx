import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import { GoGraph } from "react-icons/go";
import { TbBrandSpeedtest } from "react-icons/tb";
import { IoDocumentTextSharp } from "react-icons/io5";
import { MdOutlineCandlestickChart } from "react-icons/md";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";
import { BsFillQuestionCircleFill } from "react-icons/bs";
import { LuGraduationCap } from "react-icons/lu";
import { FaChartLine } from "react-icons/fa6";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Broker from "../images/homeimg.png";
import Cryptos from '../images/crypto.png'
import "../styles/home.css";

const Home = () => {
  const [showQuestions1, setShowQuestions1] = useState(false);
  const handleShowQuestions1 = () => {
    setShowQuestions1((prev) => !prev);
  };
  const [showQuestions2, setShowQuestions2] = useState(false);
  const handleShowQuestions2 = () => {
    setShowQuestions2((prev) => !prev);
  };
  const [showQuestions3, setShowQuestions3] = useState(false);
  const handleShowQuestions3 = () => {
    setShowQuestions3((prev) => !prev);
  };
  const [showQuestions4, setShowQuestions4] = useState(false);
  const handleShowQuestions4 = () => {
    setShowQuestions4((prev) => !prev);
  };
  const [showQuestions5, setShowQuestions5] = useState(false);
  const handleShowQuestions5 = () => {
    setShowQuestions5((prev) => !prev);
  };
  const [showQuestions6, setShowQuestions6] = useState(false);
  const handleShowQuestions6 = () => {
    setShowQuestions6((prev) => !prev);
  };

  return (
    <div>
      <Navbar />
      <div className="home">
        <div className="innovative">
          <div className="innovative-img">
            <div className="img-wrapper">
              {/* <div className="glow"></div> */}
              <img src={Broker}/>
              <div className="orb-wrap">
                {/* <div className="orbit-container">
                <div className="orb"></div>
              </div> */}
                {/* <div className="orbit-container-two">
                <div className="orb-two"></div>
              </div> */}
              </div>
            </div>
          </div>
          <div className="innovative-right">
            <h2>
              <span>Trading</span> made smoother with forxtry.
            </h2>
            <p>Get a $10,000 demo account to practice with when you register</p>
            <div className="crypt">
              <p>
                Invest in crypto currencies and assets towards continuous income
              </p>

              <img src={Cryptos}/>

            </div>
            <Link to="/demo">
              <button className="register-btn">Try free demo</button>
            </Link>
          </div>
        </div>

        <div className="info-icons">
          <div className="infos">
            <div className="infos-1 info">
              <h2><span><GoGraph/></span> Convenient trading interface</h2>
              <p>
                We created the most simple and comfortable interface that does
                not distract from the main thing
              </p>
            </div>
            <div className="infos-3 info">
              <h2><span><MdOutlineCandlestickChart/></span> Trading indicators</h2>
              <p>
                We have gathered the most useful trading indicators. Use them to
                boost your account balance
              </p>
            </div>
            <div className="infos-4 info">
              <h2><span><TbBrandSpeedtest/></span> Perfect speed</h2>
              <p>
                Our platform runs on the most modern technology and delivers
                incredible speed
              </p>
            </div>
          </div>

          <div className="button">
            <Link to="/signup">
              <button>
                Try playing on demo account
                <p>
                  <BsArrowRightShort size={24} />
                </p>
              </button>
            </Link>
          </div>
        </div>

        <div className="steps">
          <h1>Start trading</h1>
          <h2>3 steps</h2>
          <div className="steps-links">
            <div className="steps-sign-up">
              <h4>Sign up</h4>
              <p>Open an account for free in just a few minutes to start trading</p>
            </div>
            <div className="steps-practice">
              <h4>Practice</h4>
              <p>
                Get your skills better with a demo account and training
                materials
              </p>
            </div>
            <div className="steps-deposit">
              <h4>Deposit, trade and withdraw</h4>
              <p>
                Over 410 instruments and a minimum deposit of $10 for optimal
                trading
              </p>
            </div>
          </div>
        </div>

        <div className="faq">
          <h1>Frequently asked questions</h1>

          <div className="cover">
            <div className="questions">
              <div className="questions-cover">
                <div className="main-questions" onClick={handleShowQuestions1}>
                  <h2>
                    <IoDocumentTextSharp color="#2f80ed" size={18} />
                    How to learn?
                  </h2>
                  <h6>
                    {showQuestions1 ? (
                      <IoIosArrowUp size={20} />
                    ) : (
                      <IoIosArrowDown size={20} />
                    )}
                  </h6>
                </div>
                {showQuestions1 && (
                  <div className="show">
                    <p>
                      Sign up and train on a demo account. It is exactly the
                      same as real trading, but for free.
                    </p>
                  </div>
                )}
              </div>

              <div className="questions-cover">
                <div className="main-questions" onClick={handleShowQuestions2}>
                  <h2>
                    <IoDocumentTextSharp color="#2f80ed" size={18} />
                    Can I trade with phone?
                  </h2>
                  <h6>
                    {showQuestions2 ? (
                      <IoIosArrowUp size={20} />
                    ) : (
                      <IoIosArrowDown size={20} />
                    )}
                  </h6>
                </div>
                {showQuestions2 && (
                  <div className="show">
                    <p>
                      Our platform runs on the most modern technology and opens
                      in the browser of any computer or mobile phone
                    </p>
                  </div>
                )}
              </div>

              <div className="questions-cover">
                <div className="main-questions" onClick={handleShowQuestions3}>
                  <h2>
                    <IoDocumentTextSharp color="#2f80ed" size={18} />
                    How long does it take to withdraw funds?
                  </h2>
                  <h6>
                    {showQuestions3 ? (
                      <IoIosArrowUp size={20} />
                    ) : (
                      <IoIosArrowDown size={20} />
                    )}
                  </h6>
                </div>
                {showQuestions3 && (
                  <div className="show">
                    <p>
                      On average, the withdrawal procedure takes from one to
                      five days from the date of receipt of the corresponding
                      request of the Client and depends only on the volume of
                      simultaneously processed requests. The company always
                      tries to make payments directly on the day the request is
                      received from the Client.
                    </p>
                  </div>
                )}
              </div>

              <div className="questions-cover">
                <div className="main-questions" onClick={handleShowQuestions4}>
                  <h2>
                    <IoDocumentTextSharp color="#2f80ed" size={18} />
                    What is the minimum deposit amount?
                  </h2>
                  <h6>
                    {showQuestions4 ? (
                      <IoIosArrowUp size={20} />
                    ) : (
                      <IoIosArrowDown size={20} />
                    )}
                  </h6>
                </div>
                {showQuestions4 && (
                  <div className="show">
                    <p>
                      The advantage of the Company’s trading platform is that
                      you don’t have to deposit large amounts to your account.
                      You can start trading by investing a small amount of
                      money. The minimum deposit is 10 US dollars.
                    </p>
                  </div>
                )}
              </div>

              <div className="questions-cover">
                <div className="main-questions" onClick={handleShowQuestions5}>
                  <h2>
                    <IoDocumentTextSharp color="#2f80ed" size={19} />
                    What is a trading platform and why is it needed?
                  </h2>
                  <h6>
                    {showQuestions5 ? (
                      <IoIosArrowUp size={20} />
                    ) : (
                      <IoIosArrowDown size={20} />
                    )}
                  </h6>
                </div>
                {showQuestions5 && (
                  <div className="show">
                    <p>
                      Trading platform - a software complex that allows the
                      Client to conduct trades (operations) using different
                      financial instruments. It has also accesses to various
                      information such as the value of quotations, real-time
                      market positions, actions of the Company, etc.
                    </p>
                  </div>
                )}
              </div>

              <div className="questions-cover">
                <div className="main-questions" onClick={handleShowQuestions6}>
                  <h2>
                    <IoDocumentTextSharp color="#2f80ed" size={29} />
                    Is there any fee for depositing or withdrawing funds from
                    the account?
                  </h2>
                  <h6>
                    {showQuestions6 ? (
                      <IoIosArrowUp size={20} />
                    ) : (
                      <IoIosArrowDown size={20} />
                    )}
                  </h6>
                </div>
                {showQuestions6 && (
                  <div className="show">
                    <p>
                      No. The company does not charge any fee for either the
                      deposit or for the withdrawal operations. <br /> However,
                      it is worth considering that payment systems can charge
                      their fee and use the internal currency conversion rate.
                    </p>
                  </div>
                )}
              </div>
            </div>
            <Link to="/faq">
              <div className="all-questions">
                <BsFillQuestionCircleFill color="#fff" size={20}/>
                Go to all questions
              </div>
            </Link>
          </div>
        </div>

        <div className="bottom">
          <div className="image"></div>
          <div className="bottom-text-cover">
          <h1>
            Forxtry: Innovation Platform <br /> Digital Asset Trading
          </h1>
          <div className="buttons">
            <Link to="/signup">
              <button className="real">
                <FaChartLine size={20} /> Open real account
              </button>
            </Link>
            <Link to="/signup">
              <button className="demo">
                <LuGraduationCap size={30} color="#3690f2" />
                Demo account
              </button>
            </Link>
          </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
