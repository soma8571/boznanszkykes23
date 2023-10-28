import React, { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import axios from "axios";
import {
  Spinner,
  Table,
  Input,
  FormGroup,
  Label
} from "reactstrap";
import MyModal from "../components/MyModal";
import { deliveryStatusFormatter } from "../utils/utils";

function Megrendelesek() {
  const [cookies] = useCookies(["accessToken"]);
  const [data, setData] = useState([]);
  const [deliveryData, setDeliveryData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

  const toggle = () => setModal(!modal);

  useEffect(() => {
    if (!modal) {
      fetchData();
    }
    
  }, [modal]);

  async function fetchData() {
    setIsLoading(true);
    try {
      const url = `${process.env.REACT_APP_API_URL}/megrendelesek`;
      const res = await axios.get(url, {
        headers: 
          { Authorization: `Bearer ${cookies.accessToken}` }
        }
      );
      if (Array.isArray(res.data) && res.data.length > 0) {
        setData(res.data);
        //console.log(res.data);
      } else {
        console.log(res.data);
        setError("Űgy tűnik jelenleg nincs megjeleníthető adat.");
      }
      setIsLoading(false);
    } catch (err) {
      //console.log(err);
      setIsLoading(false);
      setError(err);
    }
  }

  async function fetchDeliveryData(id) {
    try {
      const url = `${process.env.REACT_APP_API_URL}/megrendeles/${id}`;
      const res = await axios.get(url, {
        headers: {
           Authorization: `Bearer ${cookies.accessToken}` 
        },
      });
      if (Array.isArray(res.data) && res.data.length > 0) {
        setDeliveryData(res.data);
        //console.log(res.data);
      } else {
        console.log(res);
        setError("Űgy tűnik jelenleg nincs megjeleníthető adat.");
      }
    } catch (err) {
      setError(err);
    }
  }

  const renderTableHeadingJSX = () => {
    const heading = (
      <thead>
        <tr>
          <td>#</td>
          <td>Kiszáll. azon.</td>
          <td>Megrend. neve</td>
          <td>Rend. dátuma</td>
          <td>Státusz</td>
          <td>Utolsó áll. vált.</td>
        </tr>
      </thead>
    );
    return heading;
  };

  const handleRowClick = (deliveriesID) => {
    fetchDeliveryData(deliveriesID);
    /* Teszt egy már teljesült és több tételt is tartalmazó rendelésre */
    //fetchDeliveryData(50);
    setModal(true);
  };

  const renderTableData = () => {
    let filtered = [];
    if (!showCompleted) {
      filtered = data.filter(item => item.status !== "COMPLETED")
    } else {
      filtered = [...data];
    }
    let rows = filtered.map((item, index) => (
        <tr
          key={index}
          onClick={() => handleRowClick(item.id_deliveries)}
          className="clickable"
        >
          <td>{index + 1}</td>
          <td>{item.id_deliveries}</td>
          <td>{item.cname}</td>
          <td>{item.date}</td>
          <td>{deliveryStatusFormatter(item.status)}</td>
          <td>{item.modify_date}</td>
        </tr>
    ));
    return <tbody>{rows}</tbody>;
  };


  if (error !== "") {
    return <p className="errormsg">{error}</p>;
  }

  return (
    <div>
      <h1>Megrendelések</h1>

      <div className="flex-container">
        {isLoading ? (
          <Spinner>Loading...</Spinner>
        ) : (
          <>
            <div className="content">
              {data && data.length > 0 ? (
                <>
                  <FormGroup switch style={{ margin: "1.5rem 0" }}>
                    <Input
                      type="switch"
                      checked={showCompleted}
                      onChange={() => {setShowCompleted(!showCompleted)}}
                    />
                  <Label check>Mutasd az utolsó 20 teljesült rendelést is</Label>
                  </FormGroup>
                  <Table dark hover striped className="mytable">
                    {renderTableHeadingJSX()}
                    {renderTableData()}
                  </Table>
                </>
              ) : (
                <p>Nincs adatunk</p>
              )}
            </div>

            {/* <div className="sidebar">
            </div> */}
          </>
        )}
      </div>
      {modal && (
        <MyModal 
          isOpen={modal} 
          toggle={toggle} 
          orderData={deliveryData} 
        />
      )}
    </div>
  );
}

export default Megrendelesek;
