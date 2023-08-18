import React, {useState, useEffect} from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Table, Spinner } from 'reactstrap';

function Keszlet() {

  const [cookies] = useCookies(["accessToken"]);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const url = `${process.env.REACT_APP_API_URL}/keszlet`;
        const res = await axios.get(url, {
          headers: {
            Authorization: cookies.accessToken 
          }
        });
        if (res.statusText === "OK") {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setData(res.data);
          } else {
            setError("Űgy tűnik jelenleg nincs megjeleníthető adat.");
          }     
        }
      } catch(err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);


  const renderTableHeadingJSX = () => {
    const heading = <thead>
      <tr>
        <td>#</td>
        <td>Termék neve</td>
        <td>Utolsó vált. típusa</td>
        <td>Utolsó vált. dátuma</td>
        <td>Készleten</td>
      </tr>
    </thead>;
    return heading;
  }

  const renderTableData = () => {
    
    let rows = data.map((item, index) => 
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.name}</td>
        <td>{item.last_change_type}</td>
        <td>{item.last_change_date}</td>
        <td>{item.stock} db</td>
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
      <h1>Készlet</h1>

      <div className='flex-container'>
        {isLoading ? 
          (<Spinner>Loading...</Spinner>)
          :
          (<>
            <div className='content'>
              {data.length > 0 ? 
              (<Table dark hover striped className='table caption-top'>
                <caption>Jelenleg készleten lévő termék(ek)</caption>
                {renderTableHeadingJSX()}
                {renderTableData()}
              </Table>
              )  
              : 
              (<p>Nincs adatunk</p>)}
            </div>
          </>)
        }
      </div>

    </div>
  );
}

export default Keszlet;
