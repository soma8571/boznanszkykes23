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
          headers: { Authorization: `Bearer ${cookies.accessToken}` }
        });
        if (Array.isArray(res.data) && res.data.length > 0) {
          setData(res.data);
        } else {
          setError("Űgy tűnik jelenleg nincs készleten lévő termék.");
        }     
      } catch(err) {
        //console.log(err);
        let errorMsg = err.message ?? "Hiba történt az adatok lekérése során.";
        setError(errorMsg);
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

  return (
    <div>
      <h1>Készlet</h1>
      <div className='flex-container'>
        {isLoading ? 
          (<Spinner>Loading...</Spinner>)
          :
          (
            <div className='content'>
              {error !== "" ? 
                (<p className='errormsg'>{error}</p>)
                :
                (
                <Table dark hover striped className='table caption-top'>
                  <caption>Jelenleg készleten lévő termék(ek)</caption>
                  {renderTableHeadingJSX()}
                  {renderTableData()}
                </Table>
                )
              }
            </div>
          )
        }
      </div>
    </div>
  );
}

export default Keszlet;
