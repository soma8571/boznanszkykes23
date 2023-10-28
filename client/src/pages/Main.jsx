import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import { useCookies } from "react-cookie";
import { Spinner, Input, Button, ButtonGroup, Table } from 'reactstrap';
import axios from 'axios';
import { priceFormatter, knifeTypeFormatter } from '../utils/utils';

function Main() {

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [cookies] = useCookies(["accessToken"]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState(["penknife", "dagger", "kitchen_knife"]);
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    
    async function fetchData() {
      setIsLoading(true);
      try {
        const url = `${process.env.REACT_APP_API_URL}/index.php`;
        const res = await axios.get(url, 
          { headers: 
            {Authorization: `Bearer ${cookies.accessToken}`}
          });

        if (res.statusText === "OK") {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setData(res.data);
            setFilteredData(res.data);
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

  useEffect(() => {
    catFilter();
  }, [category]);

  /* useEffect(() => {
    console.log(filteredData);
  }, [filteredData]); */

  const renderTableHeadingJSX = () => {
    const heading = <thead>
      <tr>
        <td>#</td>
        <td>Kép</td>
        <td>Termék név</td>
        <td>Típus</td>
        <td>Alkategória</td>
        <td>Termék ára</td>
      </tr>
    </thead>;
    return heading;
  }

 /*  useEffect(()=>{
    downloadProductThumbnail(9);
  }, []); */

  async function downloadProductThumbnail(productId) {
    try {
      const url = `${process.env.REACT_APP_API_URL}/termekProfilTn/${productId}`;
      const {data} = await axios.get(url, 
        {responseType: "arraybuffer"});
      if (data.byteLength > 0) {
          const blob = new Blob([data], { type: 'image/jpeg' });
          return URL.createObjectURL(blob);
      } else return false; 
    } catch (err) {
      console.log(err);
    }
  }

  async function renderThumbnail(path, alt, productId) {
    if (!path) return "Nincs kép";
    //const baseUrl = "https://www.boznanszkykes.hu/uploads/";
    let src = await downloadProductThumbnail(productId);
    const thumbnail =(<img 
      src={src} 
      key={path} 
      alt={alt} 
      loading='lazy'
    />);
    return thumbnail;
  }

  const renderIsAvailable = (availbale) => {
    if (availbale === 1) return "Elérhető";
    else return "Nem elérhető";
  }

  async function renderTableData() {
    
    let rows = await Promise.all(filteredData.map(async (item, index) => {
      const thumbnailSrc = await downloadProductThumbnail(item.id_knives);
      return (
        <tr key={index} style={{ verticalAlign: "middle" }}>
        {/* <td>{index + 1}</td>
        {thumbnailSrc ? (<td><img src={thumbnailSrc} alt={item.name} loading='lazy'/></td>) : (<td>Nincs kép</td>)} */}
        
        <td><Link to={`/termek/${item.id_knives}`}>{item.name}</Link>
          <br /> {renderIsAvailable(item.available)}
        </td>
        <td>{knifeTypeFormatter(item.type)}</td>
        <td>{item.subcategory_name}</td>
        <td>{priceFormatter(item.price)}</td>
      </tr>
      );
    }));
    return <tbody>{rows}</tbody>;
  }

  if (error !== "") {
    return (
      <p className='errormsg'>
        {error}
      </p>
    );
  }

  const handleChange = (e) => {
    const {value} = e.target;
    if (value.length > 2) {
      const filtered = data.filter(item => item.name.toLowerCase().includes(value));
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }

  const handleCatChange = (cat) => {
    let index = category.indexOf(cat);
    if (index < 0) {
      //nincs benne
      category.push(cat);
    } else {
      category.splice(index, 1);
    }
    setCategory([...category]);
  }

  const catFilter = () => {
    const catFiltered = data.filter(item => category.includes(item.type));
    //console.log(catFiltered);
    setFilteredData(catFiltered);
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
                 
                (<><Input
                  className="mb-3"
                  placeholder="Keresett termék"
                  onChange={handleChange}
                  style={{ backgroundColor: "#cedc00" }}
                />
                {filteredData.length > 0 ?
                  (<Table dark striped hover className='table caption-top'>
                    {renderTableHeadingJSX()}
                    {renderTableData()}
                  </Table>
                  )  
                  : 
                  (<p>Nincs megjeleníthető találat.</p>)}
                
                </>)
                :
                (<p>Nincs megjeleníthető adat.</p>)
              }
            </div>

            <div className='sidebar'>
            <h3>Termék kategória szűrő</h3>
            <ButtonGroup vertical>
              <Button
                color='light'
                outline
                onClick={() => handleCatChange("penknife")}
                active={category.includes("penknife")}
              >
                Bicska
              </Button>
              <Button
                color='light'
                outline
                onClick={() => handleCatChange("kitchen_knife")}
                active={category.includes("kitchen_knife")}
              >
                Konyhakés
              </Button>
              <Button
                color='light'
                outline
                onClick={() => handleCatChange("dagger")}
                active={category.includes("dagger")}
              >
                Tőr
              </Button>
            </ButtonGroup>
            </div>
          </>)
        }
      </div>
    </div>
  )
}

export default Main;
