import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Spinner, FormGroup, Label, Input, Button, Table } from 'reactstrap';
import { saleFieldFormatter } from '../utils/utils';


function SaleForm( { termekId }) {

    const initialSaleObject = {
        deadline: "",
        sale_percentage: "",
        active: true,
        product_id: termekId,
        until_in_stock: true
    }
    //sale-be kérjük le az esetlegesen már meglévő akciót
    const [sale, setSale] = useState([]);
    const [cookie] = useCookies(["accessToken"]);
    const [isLoading, setIsLoading] = useState(false);
    const [newSale, setNewSale] = useState(initialSaleObject);
    const [responseMsg, setResponseMsg] = useState("");

    useEffect(() => {
        fetchAkcio();
    }, [responseMsg]);

    /* useEffect(() => {
        console.log(newSale);
    }, [newSale]); */

    async function fetchAkcio() {
        setIsLoading(true);
        try {
            const url = `${process.env.REACT_APP_API_URL}/termekakcio/${termekId}`;
            const {data} = await axios.get(url, 
            { headers: 
                { Authorization: `Bearer ${cookie.accessToken}` } 
            });
            //console.log(data);
            setSale(data);
        } catch (err) {
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    }

    async function saveAkcio() {
        try {
            const url = `${process.env.REACT_APP_API_URL}/termekakcio/${termekId}`;
            const {data} = await axios.post(url,
              { newSale },  
              { headers: 
                { Authorization: `Bearer ${cookie.accessToken}` }
              });
            setResponseMsg(data.msg);
            //console.log(data);
            setNewSale(initialSaleObject);
          } catch (err) {
              console.log(err);
          }
    }

    async function deleteSale() {
        try {
            const url = `${process.env.REACT_APP_API_URL}/termekakcio/${termekId}`;
            const {data} = await axios.delete(url,
              { headers: 
                { Authorization: `Bearer ${cookie.accessToken}` }
              });
            setResponseMsg(data.msg);
            //console.log(data);
          } catch (err) {
              console.log(err);
          }
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        if (name == "until_in_stock") {
            setNewSale({...newSale, [name]: e.target.checked});
        } else {
            setNewSale({...newSale, [name]: value});
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log(newSale);
        saveAkcio();
    }

    const renderTableData = () => {
        const rows = [];
        const toSkip = ["id_on_sale", "active", "product_id"];
        for (let kulcs in sale[0]) {
            if (toSkip.includes(kulcs)) continue;
            let row = (<tr key={kulcs}>
                <td>{saleFieldFormatter(kulcs)}</td>
                <td>{saleFieldFormatter(sale[0][kulcs])}</td>
            </tr>);
            rows.push(row);
        }
        return <tbody>{rows}</tbody>;
    }

    const handleDelete = () => {
        let sure = window.confirm("Biztosan törölni szeretnéd ezt az akciót?");
        if (sure) deleteSale();
    }

  return (
    <div className='saleSettings'>
        <h3>Termék akció</h3>
        {isLoading ? 
            (<Spinner>Loading...</Spinner>)
            :
            (sale.length > 0 ? 
                (<div>
                   <Table dark hover className='table caption-top'>
                    <caption>Jelenlegi akció</caption>
                    {renderTableData()}
                   </Table>
                   <p>
                    <Button 
                        onClick={handleDelete}
                        color='danger'
                    >
                        Akció törlése
                    </Button>
                   </p>
                </div>
                )
                :
                (<div>
                    <form onSubmit={e => handleSubmit(e)}>
                        <FormGroup>
                            <Input 
                                type="checkbox"
                                name="until_in_stock"
                                id="until_in_stock"
                                checked={newSale.until_in_stock}
                                onChange={e => handleChange(e)}
                            />
                            <Label 
                                for='until_in_stock' 
                                style={{ marginLeft: "0.5em" }}>
                                Amíg a készlet a tart
                            </Label>
                        </FormGroup>
                        <FormGroup>
                            <Label for='deadline'>Határidő</Label>
                            <Input 
                                type="date"
                                name="deadline"
                                id="deadline"
                                value={newSale.deadline}
                                onChange={e => handleChange(e)}
                                style={{ backgroundColor: "#cedc00" }}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for='sale_percentage'>
                                Akció mértéke (%)
                            </Label>
                            <Input 
                                type="number"
                                name="sale_percentage"
                                id="sale_percentage"
                                value={newSale.sale_percentage}
                                onChange={e => handleChange(e)}
                                style={{ backgroundColor: "#cedc00" }}
                                required
                            />
                        </FormGroup>
                        <FormGroup>
                            <Button 
                                style={{ marginTop: "1rem" }}
                            >
                                Mentés
                            </Button>
                        </FormGroup>
                    </form>
                </div>
                )
            )
        }
        
    </div>
  )
}

export default SaleForm;
