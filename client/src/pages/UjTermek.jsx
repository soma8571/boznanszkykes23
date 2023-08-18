import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import {Input, Spinner, Button, Table} from "reactstrap";
import { knifeDataFormatter, knifeTypes } from '../utils/utils';
import ShowMsgModal from "../components/ShowMsgModal";

function UjTermek() {

  const [newProductData, setNewProductData] = useState([]);
  const [productSubCats, setProductSubCats] = useState([]);
  const [cookie] = useCookies(["accessToken"]);
  const [isLoading, setIsLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");
  const [modal, setModal] = useState(false);
  
  const toggle = () => {
    setModal(!modal);
  }

  useEffect(() => {
    if (!modal) {
      setResponseMsg("");
    }
  }, [modal]);

  useEffect(() => {
    if (responseMsg !== "")
      toggle();
  }, [responseMsg]);

  useEffect(() => {
    fetchTermekAlkategoriak();
  }, []);

  useEffect(() => {
    if (productSubCats.length > 0) {
      fetchTermekSablon();
    }
  }, [productSubCats]);

  useEffect(() => {
    if (responseMsg.includes("sikeresen")) {
      createEmptyTemplate(newProductData);
    }
  }, [responseMsg]);

  async function fetchTermekAlkategoriak() {
    setIsLoading(true);
    try {
        const url = `${process.env.REACT_APP_API_URL}/termekalkategoriak`;
        const {data} = await axios.get(url, 
        { headers: 
            {Authorization: cookie.accessToken} 
        });
        setProductSubCats(data);
        //console.log(data);
    } catch (err) {
        console.log(err);
    } finally {
        setIsLoading(false);
    }
  }

  async function fetchTermekSablon() {
      setIsLoading(true);
      try {
          const url = `${process.env.REACT_APP_API_URL}/termeksablon/`;
          const {data} = await axios.get(url, 
          { headers: 
              {Authorization: cookie.accessToken} 
          });
          //console.log(data);
          const emptyObject = createEmptyTemplate(data[0]);
          setNewProductData(emptyObject);
      } catch (err) {
          console.log(err);
      } finally {
          setIsLoading(false);
      }
  }

  async function saveNewProduct() {
    try {
      const url = `${process.env.REACT_APP_API_URL}/uj-termek/`;
      const {data} = await axios.post(url,
        { newProductData },  
        { headers: 
            {Authorization: cookie.accessToken} 
        });
      setResponseMsg(data.msg);
      //console.log(data);
    } catch (err) {
        console.log(err);
    }
  }

  const createEmptyTemplate = (obj) => {
    delete obj.id_knives;
    for (let k in obj) {
      obj[k] = "";  
    }
    return obj;
  }

  const renderSubCatOptions = () => {
    const options = productSubCats.map(item => 
        <option 
            value={item.idknives_subcategories}
            key={item.idknives_subcategories}
        >
        {item.subcategory_name}
        </option>);
    options.push(<option key="empty" value={null}></option>);
    return options;
  }

  const renderTypeOptions = () => {
    const options = knifeTypes.map(item => 
        <option 
            value={item.name}
            key={item.name}
        >
        {item.nev}
        </option>);
    options.splice(0, 0, <option key="empty" value=""></option>);
    return options;
  }

  const renderProductData2 = () => {
    const rows = [];
    const onlyNumber = ["full_length", "blade_length", "hardness", "price"];
    for (let kulcs in newProductData) {
        let row = "";
        if (kulcs === "id_knives") continue;
        else if (kulcs === "type_subcategory") {
            if (newProductData["type"] !== "penknife") continue;
            else {
                row = (<tr key={kulcs}>
                    <td>{knifeDataFormatter(kulcs)}</td>
                    <td><Input 
                            name={kulcs}
                            type='select' 
                            onChange={e => handleChange(e)}
                            style={{ backgroundColor: "#cedc00" }}
                            defaultValue={newProductData[kulcs]}
                            required
                        >
                            {renderSubCatOptions()}
                        </Input>
                    </td></tr>);
            }
        }
        else if (kulcs === "type") {
            row = (<tr key={kulcs}>
                <td>{knifeDataFormatter(kulcs)}</td>
                <td><Input 
                        name={kulcs}
                        type='select' 
                        onChange={e => handleChange(e)}
                        style={{ backgroundColor: "#cedc00" }}
                        defaultValue={newProductData[kulcs]}
                        required
                    >
                        {renderTypeOptions()}
                    </Input>
                </td></tr>);
        }
        else if (kulcs === "description") {
            row = (<tr key={kulcs}>
                <td>{knifeDataFormatter(kulcs)}</td>
                <td><Input 
                        name={kulcs}
                        type='textarea' 
                        value={newProductData[kulcs]}
                        onChange={e => handleChange(e)}
                        style={{ backgroundColor: "#cedc00", minHeight: "200px", minWidth: "300px"}}
                        maxLength={500}
                    >
                    </Input>
                </td></tr>);
        } 
        else if (kulcs === "available" || kulcs === "buyable" || kulcs === "hide_if_sold_out") {
            row = (<tr key={kulcs}>
                <td>{knifeDataFormatter(kulcs)}</td>
                <td><Input 
                        name={kulcs}
                        type='select' 
                        onChange={e => handleChange(e)}
                        style={{ backgroundColor: "#cedc00" }}
                        defaultValue={newProductData[kulcs]}
                        required
                    >
                        <option value=""></option>
                        <option value="0">Nem</option>
                        <option value="1">Igen</option>    
                    </Input>
                </td></tr>);
        } else {
          if (onlyNumber.includes(kulcs)) {
            row = (<tr key={kulcs}>
              <td>{knifeDataFormatter(kulcs)}</td>
              <td><Input 
                      name={kulcs}
                      type='number' 
                      value={newProductData[kulcs]}
                      onChange={e => handleChange(e)}
                      style={{ backgroundColor: "#cedc00" }}
                      required
                  >
                  </Input>
              </td></tr>);
          } else {
            row = (<tr key={kulcs}>
              <td>{knifeDataFormatter(kulcs)}</td>
              <td><Input 
                      name={kulcs}
                      type='text' 
                      value={newProductData[kulcs]}
                      onChange={e => handleChange(e)}
                      style={{ backgroundColor: "#cedc00" }}
                      required
                  >
                  </Input>
              </td></tr>);
          } 
        }
        rows.push(row);
    }
    return <tbody>{rows}</tbody>;
  }

  const handleChange = (e) => {
    setResponseMsg("");
    const {name, value} = e.target;
    setNewProductData({...newProductData, [name]: value});
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    saveNewProduct();
  }

  return (
    <div>
      <h1>Új termék létrehozása</h1>
      <div className='flex-container'>
            <div className='content'>
            {isLoading ? 
                (<Spinner>Loading...</Spinner>)
                :
                (newProductData && productSubCats ? 
                    (
                    <form onSubmit={e => handleSubmit(e)}>
                        <Table dark>
                            {renderProductData2()}
                        </Table>
                        <Button style={{ margin: "1rem auto" }}>Mentés</Button>
                    </form>
                    )
                    :
                    (<p>Nincs megjeleníthető adat.</p>)
                )
            }
            </div>
            {modal && (
              <ShowMsgModal 
                message={responseMsg} 
                isOpen={modal} 
                toggle={toggle} />)
            }
        </div>
    </div>
  )
}

export default UjTermek;
