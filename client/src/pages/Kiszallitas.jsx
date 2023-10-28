import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import DeliveryCostForm from '../components/DeliveryCostForm';
import { Table, Button } from 'reactstrap';

function Kiszallitas() {

    const [deliveryData, setDeliveryData] = useState();
    const [cookie] = useCookies(["accessToken"]);
    const [error, setError] = useState("");
    const [newDeliveryCost, setNewDeliveryCost] = useState("");
    const [deleteMsg, setDeleteMsg] = useState("");

    useEffect(() => {
        async function fetchData() {
            const url = `${process.env.REACT_APP_API_URL}/kiszallitas`;
            try {   
                const {data} = await axios.get(url, 
                    { headers: 
                        { Authorization: `Bearer ${cookie.accessToken}` }
                    });
                if (Array.isArray(data) && data.length > 0) {
                    setDeliveryData(data);
                    setError("");
                } else {
                    setError("Úgy tűnik jelenleg nincs megjeleníthető adat.");
                }
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [newDeliveryCost, deleteMsg]);

    async function deleteDeliveryCost(dc_id) {
        try {
            const url = `${process.env.REACT_APP_API_URL}/kiszallitas/${dc_id}`;
            const {data} = await axios.delete(url, 
                {headers: 
                    { Authorization: `Bearer ${cookie.accessToken}` }
                });
            setDeleteMsg(data);
        } catch(err) {
            console.log(err);
            setError(err);
        }
    }

    function confirmDeleteDeliveryCost(e) {
        let sure = window.confirm("Biztosan törölni szeretnéd ezt a kiszállítási költséget?");
        if (sure) {
           deleteDeliveryCost(e.target.dataset.id);
        }
      }

    const renderTableHeadingJSX = () => {
        const heading = <thead>
          <tr>
            <td>#</td>
            <td>Vásárlási összegtől</td>
            <td>Vásárlási összegig</td>
            <td>Ár utánvét esetén</td>
            <td>Ár előre utalás esetén</td>
            <td>Törlés</td>
          </tr>
        </thead>;
        return heading;
    }

    const renderTableDataJSX = () => {
        const rows = deliveryData.map((item, index) => 
          <tr key={index}>
            <td>{index + 1}</td>
            <td>{item.price_from}</td>
            <td>{item.price_to}</td>
            <td>{item.cash_on_delivery_price}</td>
            <td>{item.forward_paying_price}</td>
            <td><Button className="btn btn-danger"
                  data-id={item.id_delivery_costs} 
                  onClick={e => confirmDeleteDeliveryCost(e)}>
                Törlés</Button>
            </td>
          </tr>
        );
        return <tbody>{rows}</tbody>;
      }

  return (
    <div>
      <h1>Kiszállítási költségek</h1>
        <div className='flex-container-col'>
            <div className='content'>
                {error === "" && deliveryData ? 
                (<Table dark className='table caption-top'>
                    <caption>Korábban létrehozott felhívások</caption>
                    {renderTableHeadingJSX()}
                    {renderTableDataJSX()}
                </Table>)
                :
                (<p>{error}</p>)}
            </div>

            <div className='content'>
                <DeliveryCostForm setNewDeliveryCost={setNewDeliveryCost} />
            </div>

        </div>
        
    </div>
  )
}

export default Kiszallitas;
