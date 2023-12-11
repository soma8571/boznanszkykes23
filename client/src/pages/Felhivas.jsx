import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Spinner, Table, Button } from 'reactstrap';
import AppealForm from '../components/AppealForm';

function Felhivas() {
  const [appeals, setAppeals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(["accessToken"]);
  const [error, setError] = useState("");
  const [newAppeal, setNewAppeal] = useState("");
  const [deleteMsg, setDeleteMsg] = useState("");
  const [noStoredAppeals, setNoStoredAppeals] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const url = `${process.env.REACT_APP_API_URL}/felhivas`;
        const {data} = await axios.get(url, {
          headers: { Authorization: `Bearer ${cookies.accessToken}` } 
        });
        
        if (Array.isArray(data) && data.length > 0) {
          setAppeals(data);
          //console.log(data);
        } else {
          //setError("Nincs rögzített felhívás.");
          setNoStoredAppeals(true);
        }
        
      } catch(err) {
          //console.log(err);
          let errorMsg = err?.response?.data?.msg ?? 
                          "Nincs rögzített felhívás.";
          setError(errorMsg);
          setNoStoredAppeals(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    
  }, [newAppeal, deleteMsg]);

  async function deleteAppeal(appealID) {
    try {
      const url = `${process.env.REACT_APP_API_URL}/felhivas/${appealID}`;
      const {data} = await axios.delete(url, 
        { headers: { Authorization: `Bearer ${cookies.accessToken}` }}
      );
      setDeleteMsg(data);
    } catch(err) {
        setError(err);
    }
  }

  const renderTableHeadingJSX = () => {
    const heading = <thead>
      <tr>
        <td>Dátumtól</td>
        <td>Dátumig</td>
        <td>Cím</td>
        <td>Törzs</td>
        <td>Törlés</td>
      </tr>
    </thead>;
    return heading;
  }

  function confirmDeleteAppeal(e) {
    let sure = window.confirm("Biztosan törölni szeretnéd ezt a felhívást?");
    if (sure) {
       deleteAppeal(e.target.dataset.id);
    }
  }

  const bodyShorter = (body) => {
    if (body.length > 15)
      return body.slice(0, 15) + "...";
    else
      return body.slice(0, 15);
  }

  const renderTableDataJSX = () => {
    const rows = appeals.map((item, index) => 
      <tr key={index}>
        <td>{item.start_date}</td>
        <td>{item.end_date}</td>
        <td>{item.title}</td>
        <td>{bodyShorter(item.body)}</td>
        <td><Button className="btn btn-danger"
              data-id={item.id_appeals} 
              onClick={e => confirmDeleteAppeal(e)}>
            Törlés</Button>
        </td>
      </tr>
    );
    return <tbody>{rows}</tbody>;
  }

  return (
    <div>
      <h1>Felhívás</h1>
      <div className='flex-container-col'>
        <div className='content'>
        {noStoredAppeals ? 
          (<div style={{textAlign: "center", color: "gray" }}>
            Még nincs rögzített felhívás a rendszerben.
          </div>)
          :
          (
            <Table dark className='table caption-top'>
              <caption>Korábban létrehozott felhívások</caption>
              {renderTableHeadingJSX()}
              {renderTableDataJSX()}
            </Table>
          )
        }
        </div>
        
        <div className='content'>
         <AppealForm setNewAppeal={setNewAppeal} /> 
        </div>
      </div>
    </div>
  );
}

export default Felhivas;
