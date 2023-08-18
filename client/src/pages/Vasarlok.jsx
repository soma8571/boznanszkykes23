import React, {useState, useEffect} from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Spinner, Table } from 'reactstrap';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { customerDataFormatter, priceFormatter } from '../utils/utils';

function Vasarlok() {
  
  const [cookies] = useCookies(["accessToken"]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [customer, setCustomer] = useState();
  const [customerData, setCustomerData] = useState();
  const [customerOrders, setCustomerOrders] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const url = `${process.env.REACT_APP_API_URL}/vasarlok`;
        const res = await axios.get(url, {
          headers: {
            Authorization: cookies.accessToken 
          }
        });
        if (res.statusText === "OK") {
          if (Array.isArray(res.data) && res.data.length > 0) {
            const temp = [...res.data];
            const x = temp.map(item => ( {key: item.id, label: item.name + " "+item.email}));
            setData(x);
          } else {
            setError("Űgy tűnik jelenleg nincs megjeleníthető adat.");
          }
          setIsLoading(false);
        }
      } catch(err) {
          setIsLoading(false);
          setError(err);
      }
    }

    fetchData();
    
  }, []);

  async function getCustomerData(customer_id) {
    setIsLoading(true);
    try {
      const url = `${process.env.REACT_APP_API_URL}/vasarlo/${customer_id}`;
      const res = await axios.get(url, {
        headers: {
          Authorization: cookies.accessToken 
        }
      });
      if (res.statusText === "OK") {
        if (Array.isArray(res.data) && res.data.length > 0) {
          /*
          Egy tömböt kapunk, melynek 0. elemének 0. eleme a vásárlói alapadatokat tartalmazó objektum
          */
          setCustomerData({...res.data[0][0]});
          //A tömb 1. eleme pedig egy másik tömb, ami az adott vásárló korábbi rendeléseit tartalmazza, amennyiben volt(ak)
          if (res.data[1].length > 0) {
            setCustomerOrders(res.data[1]);
          }
        } else {
          setError("Űgy tűnik jelenleg nincs megjeleníthető adat.");
        }
        setIsLoading(false);
      }
    } catch(err) {
        setIsLoading(false);
        setError(err);
    }
  }

  //Vásárlói alapadatok megjelenítése 
  const renderCustomerData = () => {
    let rows = [];
    for (let k in customerData) {
      let row = <tr key={k}>
        <td>{customerDataFormatter(k)}</td>
        <td>{customerData[k] === null ? "Postaival megegyező" : customerData[k]}</td>
      </tr>;
      rows.push(row);
    }
    return <tbody>{rows}</tbody>;
  }

  //Vásárlói rendelések megjelenítése
  const renderCustomerOrders = () => {
    let rows = [];
    let cells = [];
    let rowNum = 0;
    let cellNum = 0;

    for (let order of customerOrders) {
      for (let k in order) {
        let cell;
        if (k === "quantity") {
          cell = <td key={cellNum}>{order[k]} db</td>;
        } else if (k === "price") {
          cell = <td key={cellNum}>{priceFormatter(order[k])}</td>;
        } else {
          cell = <td key={cellNum}>{order[k]}</td>;
        }
        cellNum++;
        cells.push(cell);
      }
      let row = <tr key={rowNum}>{cells}</tr>;
      cells = [];
      rowNum++;
      rows.push(row);
    }
    return <tbody>{rows}</tbody>;
  }

  if (error !== "") {
    return (
      <p className='errormsg'>
        {error}
      </p>
    );
  }

  //Az Autocomplete-ből történő választás kezelése
  function handleSelect(e, selectedOption) {
    if (selectedOption) {
      setCustomer(selectedOption);
      getCustomerData(selectedOption.key);
      return;
    }
    setCustomer(null);
    setCustomerData(null);
    setCustomerOrders([]);
  }

  return (
    <div>
      <h1>Vásárlók</h1>
      
      <div className='flex-container'>
        {isLoading ? 
          (<Spinner>Loading...</Spinner>)
          :
          (<>
            <div className='content'>
              <Autocomplete
                disablePortal
                id="customer-select"
                options={data}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Vásárlók" />}
                value={customer}
                onChange={handleSelect}
                style={{backgroundColor: "#cedc00", color: "white"}}
              />

              <div style={{ marginTop: "2rem"}}>
                {customerData?.email &&
                  (<Table dark className='table caption-top'>
                  <caption>Vásárlói adatok:</caption>
                  {renderCustomerData()}
                </Table>)
                }
              </div>
              
              {customer && (
              <div style={{ marginTop: "2rem"}}>
                {customerOrders.length > 0 && customerData ?
                  (<Table dark className='table caption-top'>
                  <caption>A vásárló rendelései:</caption>
                  {renderCustomerOrders()}
                </Table>)
                :
                (<p>A vásárlóhoz még nem kapcsolódik rendelés.</p>)
                }
              </div>
              )}

            </div>
          </>)
        }
      </div>

    </div>
  );
}

export default Vasarlok;
