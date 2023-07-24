import React, {useEffect, useState} from 'react'
import { useCookies } from "react-cookie";
import { Spinner, Button, Table } from 'reactstrap';
import axios from 'axios';
import { priceFormatter, knifeTypeFormatter } from '../utils/utils';

function Main() {

  const [data, setData] = useState([]);
  const [cookies] = useCookies(["accessToken"]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    
    async function fetchData() {
      setIsLoading(true);
      try {
        const url = "http://localhost/boznanszkykes23/server/index.php";
        const res = await axios.get(url, 
          { headers: 
            {Authorization: cookies.accessToken} 
          });

        if (res.statusText === "OK") {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setData(res.data);
            //console.log(res.data);
          } else {
             //console.log("Hiba az adatok lekérése során.");
             setError("Űgy tűnik jelenleg nincs megjeleníthető adat.");
          }          
        }
        setIsLoading(false);
      } catch(err) {
          console.log(err);
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
        <td>Termék név</td>
        <td>Típus</td>
        <td>Alkategória</td>
        <td>Termék ára</td>
      </tr>
    </thead>;
    return heading;
  }

  const renderTableData = () => {
    
    let rows = data.map((item, index) => 
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.name}</td>
        <td>{knifeTypeFormatter(item.type)}</td>
        <td>{item.subcategory_name}</td>
        <td>{priceFormatter(item.price)}</td>
      </tr>
    );
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
      <h1>Termékek</h1>

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
  )
}

export default Main;
