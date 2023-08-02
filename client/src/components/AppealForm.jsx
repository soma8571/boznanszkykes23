import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Button } from "reactstrap";
import axios from "axios";

function AppealForm( {setNewAppeal} ) {

    const [cookie] = useCookies(["accessToken"]);  
    const [appeal, setAppeal] = useState({
        startDate: "",
        endDate: "",
        title: "",
        body: "",
    });

  async function postAppeal() {
    const url = `${process.env.REACT_APP_API_URL}/felhivas`;
    try {
        const {data} = await axios.post(url, 
            { appeal },
            { headers: { Authorization: cookie.accessToken }}
        );
        //console.log(data);
        setNewAppeal(data);
    } catch(err) {
        console.log(err);
    }

}

  function handleChange(e) {
    //console.log(e.target.name);
    setAppeal({ ...appeal, [e.target.name]: e.target.value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(appeal);
    postAppeal();
    document.querySelector("#appealForm").reset();
  };

  return (
    <div>
      <h2>Új felhívás megadása</h2>
      <form onSubmit={handleSubmit} className="appealForm" id="appealForm">
        <label htmlFor="start-date">Dátumtól</label>
        <input
          type="date"
          name="startDate"
          id="start-date"
          onChange={handleChange}
          required
        />
        <label htmlFor="end-date">Dátumig</label>
        <input
          type="date"
          name="endDate"
          id="end-date"
          onChange={handleChange}
          required
        />
        <label htmlFor="title">Cím</label>
        <input
          type="text"
          name="title"
          id="title"
          onChange={handleChange}
          maxLength={45}
          required
        />
        <label htmlFor="body">Szöveg</label>
        <textarea
          name="body"
          id="body"
          cols="30"
          rows="10"
          maxLength={500}
          onChange={handleChange}
        ></textarea>
        <Button style={{ margin: "1rem auto", width: "150px" }}>Mentés</Button>
      </form>
    </div>
  );
}

export default AppealForm;
