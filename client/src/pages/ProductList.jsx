import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link } from 'react-router-dom';
import { Table, Input, ButtonGroup, Button, Spinner } from "reactstrap";
import { knifeTypeFormatter, priceFormatter } from "../utils/utils";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState(["penknife", "dagger", "kitchen_knife"]);
  const [cookie] = useCookies(["accessToken"]);

  async function fetchProductData() {
    setIsLoading(true);
    try {
        const url = `${process.env.REACT_APP_API_URL}/index.php`;
        const response = await axios.get(url, 
            { headers: { Authorization: `Bearer ${cookie.accessToken}` }});
        setProducts(response.data);
        setFilteredData(response.data);
    } catch (error) {
        console.error("Error fetching product data:", error);
    } finally {
        setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    catFilter();
  }, [category]);

  const handleChange = (e) => {
    const {value} = e.target;
    if (value.length > 2) {
      const filtered = products.filter(item => item.name.toLowerCase().includes(value));
      setFilteredData(filtered);
    } else {
      setFilteredData(products);
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
    const catFiltered = products.filter(item => category.includes(item.type));
    //console.log(catFiltered);
    setFilteredData(catFiltered);
  }

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

  return (
    <div>
        <h1>Termékek</h1>

        <div className='flex-container'>
        {isLoading ? 
            (<Spinner>Loading...</Spinner>)
            :
            (<>
            <div className='content'>
                {products.length > 0 ?
                
                (<><Input
                    className="mb-3"
                    placeholder="Keresett termék"
                    onChange={handleChange}
                    style={{ backgroundColor: "#cedc00" }}
                />
                {filteredData.length > 0 ?
                    (<Table dark striped hover className='table caption-top'>
                        {renderTableHeadingJSX()}
                        <tbody>
                        {filteredData.map((product, ind) => (
                            <ProductCard key={product.id_knives} product={product} index={ind} />
                        ))}
                        </tbody>
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
  );
}

function ProductCard({ product, index }) {
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  async function fetchThumbnail() {
    try {
        const url = `${process.env.REACT_APP_API_URL}/termekProfilTn/${product.id_knives}`;
        const response = await axios.get(url,
        {
          responseType: "arraybuffer",
        }
      );
      if (response.data.byteLength > 0) {
        const blob = new Blob([response.data], { type: "image/jpeg" });
        setThumbnailUrl(URL.createObjectURL(blob));
      }
    } catch (error) {
      console.error("Error fetching thumbnail:", error);
    }
  }

  useEffect(() => {
    fetchThumbnail();
  }, [product.id_knives]);

  const formatterIsAvailable = (available) => {
    if (Number(available) === 1) return "Elérhető";
    else return "Nem elérhető";
  }

  function renderThumbnail() {
    if (thumbnailUrl !== "") {
        return <img src={thumbnailUrl} alt={product.name} />
    } else {
        return "Nincs elérhető kép";
    }
  }

  return (
    <tr>
        <td>{index+1}</td>
        <td>{renderThumbnail()}</td>
        <td><Link to={`/termek/${product.id_knives}`}>{product.name}</Link> <br />
            {formatterIsAvailable(product.available)}
        </td>
        <td>{knifeTypeFormatter(product.type)}</td>
        <td>{knifeTypeFormatter(product.subcategory_name)}</td>
        <td>{priceFormatter(product.price)}</td>
    </tr>
  );
}

export default ProductList;
