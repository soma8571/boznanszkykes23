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
  const [category, setCategory] = useState([
    "penknife", 
    "dagger", 
    "kitchen_knife"
  ]);
  const [cookie] = useCookies(["accessToken"]);
  const [onlyShowAvailables, setOnlyShowAvailables] = useState(false);

  async function fetchProductData() {
    setIsLoading(true);
    try {
        const url = `${process.env.REACT_APP_API_URL}/index.php`;
        const response = await axios.get(url, 
            { headers: { Authorization: `Bearer ${cookie.accessToken}` }});
        //console.log(response.data);  
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
  }, [category, onlyShowAvailables]);

  const handleChange = (e) => {
    const {value} = e.target;
    let filtered = [];
    if (value.length > 2) {
      if (onlyShowAvailables) {
        filtered = products.filter(item => 
          item.name.toLowerCase().includes(value) && 
          (item.available === 1 || item.available === "1")
        );
      } else {
        filtered = products.filter(item => 
          item.name.toLowerCase().includes(value)
        );
      }
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
    let catFiltered = [];
    if (onlyShowAvailables) {
      catFiltered = products.filter(item => 
        category.includes(item.type) && 
          (item.available === 1 || item.available === "1")
      );
    } else {
      catFiltered = products.filter(item => 
        category.includes(item.type));
    }
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

  const handleAvailableChange = (e) => {
    setOnlyShowAvailables(prev => !prev);
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
            <div className="availables-filter">
              <input 
                type="checkbox" 
                name="available-switch" 
                id="av-switch"
                checked={onlyShowAvailables}
                onChange={e=>handleAvailableChange(e)} 
              />
              <label htmlFor="av-switch">Csak az elérhetőek mutatása</label>
            </div>
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
    if (Number(available) === 1) 
      return <div className="available">Elérhető</div>;
    return <div className="non-available">Nem elérhető</div>;
  }

  function renderThumbnail() {
    if (thumbnailUrl !== "") {
        return <img src={thumbnailUrl} alt={product.name} />
    } else {
        return "Nincs elérhető kép";
    }
  }

  function renderSaleInfo(perc, deadline, untilInStock) {
    const saleInfo = 
      <div className="sale-info">
        <div className="sale-perc">{perc}% kedvezmény</div>
        <div className="sale-deadline">{deadline} -ig</div>
        <div className="sale-until-in-stock">
          Készlet erejéig: {untilInStock === 1 ? "Igen" : "Nem"}
        </div>
        
      </div>
    return saleInfo;
  }

  function renderStockInfo(stock) {
    if ((Number(stock)) > 0) {
      let stockInfo = <div className="in-stock">Készleten: {stock} db</div>;
      return stockInfo;
    }
    return <div className="no-stock">Nincs készleten</div>;
    
  }

  return (
    <tr>
        <td>{index+1}</td>
        <td>{renderThumbnail()}</td>
        <td><Link to={`/termek/${product.id_knives}`} className="product-name-link">{product.name}</Link> <br />
            {formatterIsAvailable(product.available)}
            {product.sale_percentage && 
              renderSaleInfo(product.sale_percentage, product.deadline, product.until_in_stock)}
            {renderStockInfo(product.stock)}
        </td>
        <td>{knifeTypeFormatter(product.type)}</td>
        <td>{knifeTypeFormatter(product.subcategory_name)}</td>
        <td>{priceFormatter(product.price)}</td>
    </tr>
  );
}

export default ProductList;
