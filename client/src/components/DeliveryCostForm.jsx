import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Button } from "reactstrap";
import axios from "axios";

function DeliveryCostForm( { setNewDeliveryCost }) {

    const [cookie] = useCookies(["accessToken"]);  
    const [deliveryCost, setDeliveryCost] = useState({
        priceFrom: "",
        priceTo: "",
        cashOnDeliveryPrice: "",
        forwardPayingPrice: "",
    });
    const [inputValue, setInputValue] = useState('');

  async function postDeliveryCost() {
    const url = `${process.env.REACT_APP_API_URL}/kiszallitas`;
    try {
        const {data} = await axios.post(url, 
            { deliveryCost },
            { headers: { Authorization: cookie.accessToken }}
        );
        console.log(data);
        setNewDeliveryCost(data);
    } catch(err) {
        console.log(err);
    }

}

  function handleChange(e) {
    const {value} = e.target;
    /* const formattedValue = Number(value.replaceAll(" ", "").replaceAll(',', '')).toLocaleString("hu-HU");
    console.log(formattedValue); */
    setDeliveryCost({ ...deliveryCost, [e.target.name]: value });
    //setInputValue(formattedValue);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(deliveryCost);
    postDeliveryCost();
    document.querySelector("#deliveryCostForm").reset();
  };

  return (
    <div>
      <h2>Új kiszállítási költség megadása</h2>
      <form onSubmit={handleSubmit} className="appealForm" id="deliveryCostForm">
        <label htmlFor="price_from">Rendelési összegtől:</label>
        <input
          type="text"
          name="priceFrom"
          id="price_from"
          onChange={handleChange}
          required
        />
        <label htmlFor="price_to">Rendelési összegig:</label>
        <input
          type="text"
          name="priceTo"
          id="price_to"
          onChange={handleChange}
          maxLength={8}
          required
        />
        <label htmlFor="codp">Ár utánvétes fizetés esetén:</label>
        <input
          type="number"
          name="cashOnDeliveryPrice"
          id="codp"
          onChange={handleChange}
          maxLength={5}
          required
        />
        <label htmlFor="fpp">Ár előre utalás esetén:</label>
        <input
          type="number"
          name="forwardPayingPrice"
          id="fpp"
          onChange={handleChange}
          maxLength={5}
          required
        />
        <Button style={{ margin: "1rem auto", width: "150px" }}>Mentés</Button>
      </form>
    </div>
  );
}

export default DeliveryCostForm;
