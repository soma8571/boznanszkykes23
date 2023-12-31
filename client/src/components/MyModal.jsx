import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Table
} from "reactstrap";
import {priceFormatter, deliveryFormatter} from '../utils/utils.js';
import axios from "axios";
import { useCookies } from "react-cookie";

function MyModal({ isOpen, toggle, orderData }) {

 /*  useEffect(()=>{
    console.log(orderData);
  }, [orderData]); */

  const [updateMsg, setUpdateMsg] = useState("");
  const [cookies] = useCookies(["accessToken"]);
  const [customerInfo, setCustomerInfo] = useState({});
  const [orderInfo, setOrderInfo] = useState([]);

  useEffect(()=>{
    if (Array.isArray(orderData) && orderData.length > 0) {
      if (Array.isArray(orderData[0]) && orderData[0].length > 0) {
        //Rendelési adatok: 0. indexen vannak a rendelési adatok, ami egy obj. tömb
        setOrderInfo(orderData[0]);  
      }
  
      if (Array.isArray(orderData[1]) && orderData[1].length > 0) {
        setCustomerInfo(orderData[1][0]); //Vásárlói adatok objektuma
      }
    }
  }, [orderData]);

  function postAddressFormatter() {
    let pa = `${customerInfo["post_code"]} 
              ${customerInfo["settlement"]}, 
              ${customerInfo["street"]}`;
    return pa;
  }

  function billAddressFormatter() {
    let ba = "";
    if (customerInfo["bill_post_code"] && customerInfo["bill_settlement"]) {
      ba = `${customerInfo["bill_post_code"]} 
            ${customerInfo["bill_settlement"]}, 
            ${customerInfo["bill_street"]} 
            ${customerInfo["bill_details"]}`;
    } else {
      ba = "kiszállítási címmel azonos";
    }
    return ba;
  }

  

  /* function renderCustomerInfo() {

    let rows = (<>
      <tr key={customerInfo["cname"]}>
        <td>Vásárló neve</td><td>{customerInfo["cname"]}</td>
      </tr>
      <tr key={customerInfo["email"]}>
        <td>Email</td><td>{customerInfo["email"]}</td>
      </tr>
      <tr key={customerInfo["phone"]}>
        <td>Telefon</td><td>{customerInfo["phone"]}</td>
      </tr>
      <tr key="delivery_type">
        <td>Kiszállítás típusa</td><td>{deliveryFormatter(orderInfo[0]["delivery_type"])}</td>
      </tr>
      <tr key="post_number">
        <td>Kiszállítási cím</td><td>{postAddress}</td>
      </tr>
      {orderInfo[0]["delivery_type"] !== "home" && (
        <tr key={customerInfo["postAddress"]}>
          <td>Posta vagy postapont száma</td>
          <td>{customerInfo["post_number"]}</td>
      </tr>
      )}
      <tr key="billname">
        <td>Számlázási név</td><td>{customerInfo["bill_name"] ? customerInfo["bill_name"] : "postaival azonos"}</td>
      </tr>
      <tr key="billaddress">
        <td>Számlázási cím</td><td>{billAddress}</td>
      </tr>
    </>);
    return <tbody>{rows}</tbody>;
  } */

  function renderCustomerInfo_v2() {
    let cInfo = 
      <div className="cust-info-wrapper">
        <div className="data-group" style={{ gridArea: "name"}}>
          <label htmlFor="cust-name">Vásárló neve</label>
          <div className="data" id="cust-name">{customerInfo["cname"]}</div>
        </div>
        <div className="data-group" style={{ gridArea: "email"}}>
          <label htmlFor="cust-email">Email</label>
          <div className="data" id="cust-email">{customerInfo["email"]}</div>
        </div>
        <div className="data-group" style={{ gridArea: "tel"}}>
          <label htmlFor="cust-tel">Telefon</label>
          <div className="data" id="cust-tel">{customerInfo["phone"]}</div>
        </div>
        <div className="data-group" style={{ gridArea: "tax-number"}}>
          <label htmlFor="tax-number">Adószám (cég esetén)</label>
          <div className="data" id="tax-number">
            {customerInfo["tax_number"] ?? "-"}
          </div>
        </div>
        <div className="data-group" style={{ gridArea: "del-type"}}>
          <label htmlFor="del-type">Kiszállítás típusa</label>
          <div className="data" id="del-type">
            {deliveryFormatter(orderInfo[0]["delivery_type"])}
          </div>
        </div>
        <div className="data-group" style={{ gridArea: "post-address"}}>
          <label htmlFor="post-address">Kiszállítás címe</label>
          <div className="data" id="post-address">{postAddressFormatter()}</div>
        </div>
        <div className="data-group" style={{ gridArea: "post-number"}}>
          <label htmlFor="post-number">Posta vagy postapont száma</label>
          <div className="data" id="post-number">
            {customerInfo["post_number"] ?? "-"}
          </div>
        </div>
        <div className="data-group" style={{ gridArea: "bill-name"}}>
          <label htmlFor="bill-name">Számlázási név</label>
          <div className="data" id="bill-name">
            {customerInfo["bill_name"] ?? "-"}</div>
        </div>
        <div className="data-group" style={{ gridArea: "bill-address"}}>
          <label htmlFor="bill-address">Számlázási cím</label>
          <div className="data" id="bill-address">{billAddressFormatter()}</div>
        </div>
      </div>
    return cInfo;
  }

  function renderOrderInfoHeader() {
    let header = (
      <tr key="header">
        <th>Termék név</th>
        <th>Penge</th>
        <th>Leírás</th>
        <th>Mennyiség</th>
        <th>Eredeti ár</th>
        <th>Eladási ár</th>
        <th>Akció %</th>
        <th>Tétel összesen</th>
      </tr>
    );
    return <thead>{header}</thead>
  }

  function calcDiscountIfWas(original_price, sold_price) {
    //ha a termék eredeti ára különbözik az eladási ártól akkor visszatér a kedvezmény %-val. Ellenkező esetben "Nem akciós" értékkel
    if (Number(original_price) < 1 || Number(sold_price) < 1) return "Nem ismert";
    if (Number(original_price) === Number(sold_price)) return "Nem akciós";
    let discountPerc = Math.round((1 - Number(sold_price) / Number(original_price)) * 100);
    return `${discountPerc} %`;
  }

  function renderOrderInfo() {
    let rows = [];
    let sum = 0;
    for (let i=0; i < orderInfo.length; i++) {
      let row = (
        <tr key={i}>
          <td key={`${i}-kname`}>
            {orderInfo[i]["kname"]}
          </td>
          <td key={`${i}-blade`}>
            {orderInfo[i]["blade_material"]}
          </td>
          <td key={`${i}-desc`} style={{ maxWidth: "12rem" }}>
            {orderInfo[i]["description"]}
          </td>
          <td key={`${i}-quantity`}>
            {orderInfo[i]["quantity"]} db {""}
              <span className="from-store-quantity">
                (készletről: {orderInfo[i]["from_store_quantity"]})
              </span>
          </td>
          <td key={`${i}-original_price`}>
            {Number(orderInfo[i]["original_price"]) > 0 ? 
              priceFormatter(orderInfo[i]["original_price"])
              :
              "Nem ismert"
            }
          </td>
          <td key={`${i}-price`}>
            {priceFormatter(orderInfo[i]["price"])}
          </td>
          <td key={`${i}-sale_perc`}>
            {calcDiscountIfWas(orderInfo[i]["original_price"], orderInfo[i]["price"])}
          </td>
          <td key={`${i}-total`}>
            {priceFormatter(orderInfo[i]["quantity"] * orderInfo[i]["price"])}
          </td>
        </tr>);
        sum += orderInfo[i]["quantity"] * orderInfo[i]["price"];
        rows.push(row);
      }
      
      let row1 = 
          <tr key={"1st"}>
            <td key={"1-1st"} colSpan={7}>Rendelés összértéke:</td>
            <td key={"1-2nd"} colSpan={1}>{priceFormatter(sum)}</td>
          </tr>;
      let row2 = 
        <tr key={"2nd"}>
          <td key={"2-1st"} colSpan={7}>Kiszállítás díja:</td>
          <td key={"2-2nd"} colSpan={1}>
            {priceFormatter(orderInfo[0]["delivery_cost"])}
          </td>
        </tr>;
      let row3 =
        <tr key={"3rd"}>
          <td key={"3-1st"} colSpan={7}>Összes fizetendő:</td>
          <td key={"3-2nd"} colSpan={1}>
            {priceFormatter(calculateTotal(sum, orderInfo[0]["delivery_cost"]))}
          </td>
        </tr>;
      let row4 = 
        <tr key={"4th"}>
          <td key={"4-1st"} colSpan={7}>Fizetési mód:</td>
          <td key={"4-2nd"} colSpan={1}>
            {deliveryFormatter(orderInfo[0]["payment_method"])}
          </td>
        </tr>;
      let row5 =
        <tr key={"5th"}>
          <td key={"5-1st"}>Rendelés dátuma:</td>
          <td key={"5-2nd"} colSpan={7}>{orderInfo[0]["date"]}</td>
        </tr>;
      let row6 =
        <tr key={"6th"}>
          <td key={"6-1st"}>Vásárlói megjegyzés:</td>
          <td key={"6-2nd"} colSpan={7}>{orderInfo[0]["customer_comment"]}</td>
        </tr>;
      let row7 =
        <tr key={"7th"}>
          <td key={"7-1st"}>Rendelés státusza:</td>
          <td key={"7-2nd"} colSpan={1}>
            <select 
              key={"select-01"}
              style={{ backgroundColor: "#cedc00", padding: "0.5rem 1rem"}}
              name="orderStatus"
              data-id={orderInfo[0]["id_deliveries"]}
              defaultValue={orderInfo[0]["status"]}
              onChange={e => handleStatusChange(e)}>
                {renderStateOptions(orderInfo[0]["status"])}
            </select>
          </td>
          <td key={"7-3rd"} colSpan={6}></td>
        </tr>;
      rows.push(row1, row2, row3, row4, row5, row6, row7);
      return <tbody key={"tb-01"}>{rows}</tbody>;
    }

    function calculateTotal(a, b) {
      return Number(a) + Number(b);
    }

    const orderStates = [
      { value: "PENDING", label: "Elintézetlen"},
      { value: "COMPLETED", label: "Teljesült"},
      { value: "CANCELLED", label: "Visszavont"}
    ];

    function renderStateOptions(status) {
      const options = orderStates.map((option, ind) => 
        <option 
          value={option.value} 
          key={ind} 
          /* selected={option.value === status} */
        >
          {option.label}
        </option>);
      return options;
    } 

    function handleStatusChange(e) {
      const status = e.target.value;
      const id = e.target.dataset.id;
      //console.log(id);
      updateDeliveryStatus(id, status);
    }

    async function updateDeliveryStatus(deliveryId, status) {
      try {
        const url = `${process.env.REACT_APP_API_URL}/kiszallitas/${deliveryId}`;
        const {data} = await axios.patch(url, 
          { status },
          { headers: { Authorization: `Bearer ${cookies.accessToken}` }});
          setUpdateMsg(data.msg);
      } catch(err) {
        console.log(err);
      }
    }
    

  return (
    <Modal isOpen={isOpen} toggle={toggle} fullscreen>
      <ModalHeader 
        toggle={toggle} 
        style={{ backgroundColor: "#00594F" }}
      >
        A rendelés részletei
      </ModalHeader>
      <ModalBody style={{ backgroundColor: "#00352F" }}>
        {updateMsg !== "" && (<div className="updateMsg">{updateMsg}</div>)}
        {orderInfo.length > 0 ? 
          (<div style={{ margin: "1rem" }}>
            <Table dark id="orderDetails">
            {renderOrderInfoHeader()}
            {renderOrderInfo()}
            </Table>
          </div>
          )
          :
          (<p>Hiba a rendelés adatainak lekérdezése során.</p>)
        }

        {Object.keys(customerInfo).length > 0 ? 
          (<div style={{ margin: "1rem" }}>
            {/* <Table dark id="orderDetails">
              {renderCustomerInfo()}
            </Table> */}
            {renderCustomerInfo_v2()}
          </div>
          ) 
          : 
          (<p>Hiba a vásárlói adatok lekérése során.</p>)
        }
      </ModalBody>
      <ModalFooter style={{ backgroundColor: "#00594F" }}>
        <Button color="primary" onClick={toggle}>
          Ok
        </Button>{" "}
      </ModalFooter>
    </Modal>
  );
}

export default MyModal;
