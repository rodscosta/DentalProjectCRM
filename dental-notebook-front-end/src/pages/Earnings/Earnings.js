import React, { useState } from "react";
import axios from "axios";
import moment from "moment";
import TwoCoinsEarnings from "../../assets/TwoCoinsEarnings.svg";
import "../Earnings/earnings.css";

const Earnings = () => {
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [lastMonthEarnings, setLastMonthEarnings] = useState(0);
  const [earningsByDate, setEarningsBydate] = useState([]);

  React.useEffect(() => {
    fetchTotalEarnings();
    fetchLastMonthEarnings();
    fetchEarningsByDate();
  }, []);

  function fetchTotalEarnings() {
    axios
      .get("/earnings")
      .then(function (response) {
        setTotalEarnings(response.data.total_earnings);
      })

      .catch(function (error) {
        console.log(error);
      });
  }

  function fetchLastMonthEarnings() {
    axios
      .get("/earnings/last-month")
      .then(function (response) {
        setLastMonthEarnings(response.data.total_earnings);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function fetchEarningsByDate() {
    axios
      .get("/earnings/earnings-by-date")
      .then(function (response) {
        setEarningsBydate(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className="max_container">
      <div className="earnings_container">
        <img src={TwoCoinsEarnings} className="coin_light" />
        <h1 className="earnings">Earnings</h1>
      </div>
      <div className="total_container">
        <div className="total_earnings">
          <h1 className="earning-h1">Total Earnings</h1>
          <p className="earning-p">{totalEarnings}$</p>
        </div>
        <div className="total_earnings">
          <h1 className="earning-h1">Month Earnings</h1>
          <p className="earning-p">{lastMonthEarnings}$</p>
        </div>
      </div>
      <div className="Date_container">
        <h1 className="earning-h1">Earnings By Date</h1>
        <div className="earningsList_container">
          {earningsByDate.length >= 1 &&
            earningsByDate.map(function (earn, index) {
              if (index === 0) {
                return (
                  <div key={index}>
                    <h1 className="date-h1">
                      {moment(earn.appointment_date).format("MMM Do YYYY")}
                    </h1>
                    <div className="treatment-p">
                      <p className="treatments_name">{earn.name}</p>
                      <p className="treatments_price">
                        {earn.treatments_earnings}$
                      </p>
                    </div>
                  </div>
                );
              } else if (
                moment(earn.appointment_date).format("MMM Do YY") !==
                moment(earningsByDate[index - 1].appointment_date).format(
                  "MMM Do YY"
                )
              ) {
                return (
                  <div key={index}>
                    <h1 className="date-h1">
                      {moment(earn.appointment_date).format("MMM Do YYYY")}
                    </h1>
                    <div className="treatment-p">
                      <p className="treatments_name">{earn.name}</p>
                      <p className="treatments_price">
                        {earn.treatments_earnings}$
                      </p>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={index}>
                    <div className="treatment-p">
                      <p className="treatments_name">{earn.name}</p>
                      <p className="treatments_price">
                        {earn.treatments_earnings}$
                      </p>
                    </div>
                  </div>
                );
              }
            })}
        </div>
      </div>
    </div>
  );
};

export default Earnings;
