import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import {Input, Spinner, Button, Table} from "reactstrap";
import { knifeDataFormatter, knifeTypes } from '../utils/utils';
import ShowMsgModal from "../components/ShowMsgModal";
import SaleForm from '../components/SaleForm';
import ProductPictures from '../components/ProductPictures';

export default function TermekSzerk() {

    const params = useParams();
    const termekId = params.termekId;
    const [productData, setProductData] = useState({});
    const [productSubCats, setProductSubCats] = useState([]);
    const [cookie] = useCookies(["accessToken"]);
    const [isLoading, setIsLoading] = useState(false);
    const [responseMsg, setResponseMsg] = useState("");
    
    const [modal, setModal] = useState(false);
    const availableDesc = "'Nem' érték esetén egyáltalán nem jelenik meg a vásárló számára.";
    const hideIfSoldOutDesc = "'Igen' érték esetén a termék csak akkor jelenik meg, ha a készlete nagyobb, mint 0.";
  
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
            fetchTermekAdat();
        }
    }, [productSubCats]);

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

    async function fetchTermekAdat() {
        setIsLoading(true);
        try {
            const url = `${process.env.REACT_APP_API_URL}/termek/${termekId}`;
            const {data} = await axios.get(url, 
            { headers: 
                {Authorization: cookie.accessToken} 
            });
            //azért, hogy textarea-ba ne kerülhessen "null" érték, mivel ez egy utólagosan bevezetett mező és alapból null értékkel szerepel
            const temp = convertNullToEmptyStr(data[0]);
            //console.log(temp);
            setProductData(temp);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    async function saveTermekAdat() {
        try {
            const url = `${process.env.REACT_APP_API_URL}/termek/${termekId}`;
            const {data} = await axios.patch(url, 
                { productData },
                { headers: 
                    {Authorization: cookie.accessToken} 
                });
            //console.log(data);
            setResponseMsg(data.msg);
        } catch (err) { 
            console.log(err);
        }
    }

    const convertNullToEmptyStr = (obj) => {
        for (let k in obj) {
            if (obj[k] === null) {
                obj[k] = "";
            }
        }
        return obj;
    }

    const handleChange = (e) => {
        setResponseMsg("");
        const {name, value} = e.target;
        setProductData({...productData, [name]: value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log(productData);
        saveTermekAdat();
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
        return options;
    }

    const renderProductData2 = () => {
        const rows = [];
        for (let kulcs in productData) {
            let row = "";
            if (kulcs === "id_knives") continue;
            else if (kulcs === "type_subcategory") {
                if (productData["type"] !== "penknife") continue;
                else {
                    row = (<tr key={kulcs}>
                        <td>{knifeDataFormatter(kulcs)}</td>
                        <td><Input 
                                name={kulcs}
                                type='select' 
                                onChange={e => handleChange(e)}
                                style={{ backgroundColor: "#cedc00" }}
                                defaultValue={productData[kulcs]}
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
                            defaultValue={productData[kulcs]}
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
                            value={productData[kulcs]}
                            onChange={e => handleChange(e)}
                            style={{ backgroundColor: "#cedc00", minHeight: "200px", minWidth: "300px"}}
                            maxLength={500}
                        >
                        </Input>
                    </td></tr>);
            } 
            else if (kulcs === "available" || kulcs === "buyable" || kulcs === "hide_if_sold_out") {
                row = (<tr key={kulcs}>
                    <td>{knifeDataFormatter(kulcs)}
                        {kulcs === "available" && <div className="info-icon">
                            <span>i</span>
                            <div className="info-content">
                                {availableDesc}
                            </div>
                        </div>}
                        {kulcs === "hide_if_sold_out" && <div className="info-icon">
                            <span>i</span>
                            <div className="info-content">
                                {hideIfSoldOutDesc}
                            </div>
                        </div>}
                    </td>
                    <td><Input 
                            name={kulcs}
                            type='select' 
                            onChange={e => handleChange(e)}
                            style={{ backgroundColor: "#cedc00" }}
                            defaultValue={productData[kulcs]}
                        >
                            <option value=""></option>
                            <option value="0">Nem</option>
                            <option value="1">Igen</option>    
                        </Input>
                    </td></tr>);
            } else {
                row = (<tr key={kulcs}>
                    <td>{knifeDataFormatter(kulcs)}</td>
                    <td><Input 
                            name={kulcs}
                            type='text' 
                            value={productData[kulcs]}
                            onChange={e => handleChange(e)}
                            style={{ backgroundColor: "#cedc00" }}
                        >
                        </Input>
                    </td></tr>);
            }
            rows.push(row);
        }
        return <tbody>{rows}</tbody>;
    }

    

    

  return (
    <div>
        <h1>Termék adatok szerkesztése</h1>
        <div className='flex-container'>
            <div className='content'>
                {isLoading ? 
                    (<Spinner>Loading...</Spinner>)
                    :
                    (productData && productSubCats ? 
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

            <div className='content'>
                
                <ProductPictures termekId={termekId} />

                <div style={{ margin: "1.5rem 0" }}>
                    <SaleForm termekId={termekId} />
                </div>
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
};
