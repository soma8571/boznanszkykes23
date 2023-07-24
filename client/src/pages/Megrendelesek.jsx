import React, {useState, useEffect} from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Spinner, Table } from 'reactstrap';

function Megrendelesek() {
  
  const [cookies] = useCookies(["accessToken"]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const url = "http://localhost/boznanszkykes23/server/megrendelesek";
        const res = await axios.get(url, {
          headers: {
            Authorization: cookies.accessToken 
          }
        });
        if (res.statusText === "OK") {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setData(res.data);
            console.log(res.data);
          } else {
            //console.log("Hiba az adatok lekérése során.");
            setError("Űgy tűnik jelenleg nincs megjeleníthető adat.");
          }
          setIsLoading(false);
        }
      } catch(err) {
          //console.log(err);
          setIsLoading(false);
          setError(err);
      }
    }

    fetchData();
    
  }, []);

  const renderTableHeadingJSX = () => {
    const heading = <thead>
      <tr>
        <td>#</td>
        <td>Kiszáll. azon.</td>
        <td>Rend. dátuma</td>
        <td>Státusz</td>
        <td>Utolsó áll. vált.</td>
      </tr>
    </thead>;
    return heading;
  }

  const renderTableData = () => {
    
    let rows = data.map((item, index) => 
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.id_deliveries}</td>
        <td>{item.date}</td>
        <td>{item.status}</td>
        <td>{item.modify_date}</td>
      </tr>
    );
    //console.log(rows);
    return <tbody>{rows}</tbody>;
  }

  if (error !== "") {
    return (
      <p className='errormsg'>
        {error}
      </p>
    );
  }

  return (
    <div>
      <h1>Megrendelések</h1>
      
      <div className='flex-container'>
        {isLoading ? 
          (<Spinner>Loading...</Spinner>)
          :
          (<>
            <div className='content'>
              {data.length > 0 ? 
              (<Table dark className='table caption-top'>
                {renderTableHeadingJSX()}
                {renderTableData()}
              </Table>
              )  
              : 
              (<p>Nincs adatunk</p>)}
            </div>

            <div className='sidebar'>
              Sidebar
            </div>
          </>)
        }
      </div>

    </div>
  );
}

export default Megrendelesek;
