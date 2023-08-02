import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Table,
  Input
} from "reactstrap";
import {priceFormatter} from '../utils/utils.js';
import axios from "axios";
import { useCookies } from "react-cookie";

function MyModal({ isOpen, toggle, orderData }) {

  const [updateMsg, setUpdateMsg] = useState("");
  const [cookies] = useCookies(["accessToken"]);
  let customerInfo = null;
  let orderInfo = null;

  if (Array.isArray(orderData) && orderData.length > 0) {
    if (Array.isArray(orderData[0]) && orderData[0].length > 0) {
      orderInfo = orderData[0];
    }

    if (Array.isArray(orderData[1]) && orderData[1].length > 0) {
      customerInfo = orderData[1][0]; //ez így már maga az object
    }
  }

  function renderCustomerInfo() {
    let postAddress = `${customerInfo["post_code"]} ${customerInfo["settlement"]}, ${customerInfo["street"]} ${customerInfo["details"]}`;
    
    let billAddress = "";
    if (customerInfo["bill_post_code"] && customerInfo["bill_settlement"]) {
      billAddress = `${customerInfo["bill_post_code"]} ${customerInfo["bill_settlement"]}, ${customerInfo["bill_street"]} ${customerInfo["bill_details"]}`;
    } else {
      billAddress = "postaival azonos";
    }
    
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
      <tr key={customerInfo["postAddress"]}>
        <td>Postai cím</td><td>{postAddress}</td>
      </tr>
      <tr key={customerInfo["billName"]}>
        <td>Számlázási név</td><td>{customerInfo["bill_name"] ? customerInfo["bill_name"] : "postaival azonos"}</td>
      </tr>
      <tr key={customerInfo["billAddress"]}>
        <td>Számlázási cím</td><td>{billAddress}</td>
      </tr>
    </>);
    return <tbody>{rows}</tbody>;
  }

  function renderOrderInfoHeader() {
    let header = (
      <tr key="header">
        <th>Termék név</th>
        <th>Mennyiség</th>
        <th>Egységár</th>
        <th>Tétel összesen</th>
      </tr>
    );
    return <thead>{header}</thead>
  }

  function renderOrderInfo() {
    let rows = [];
    let sum = 0;
    for (let i=0; i < orderInfo.length; i++) {
      let row = (
        <tr key={i}>
          <td key={`${i}-kname`}>{orderInfo[i]["kname"]}</td>
          <td key={`${i}-quantity`}>{orderInfo[i]["quantity"]} db</td>
          <td key={`${i}-price`}>{priceFormatter(orderInfo[i]["price"])}</td>
          <td key={`${i}-total`}>{priceFormatter(orderInfo[i]["quantity"] * orderInfo[i]["price"])}</td>
        </tr>);
        sum += orderInfo[i]["quantity"] * orderInfo[i]["price"];
        rows.push(row);
      }
      let staticRows = (<>
        <tr key="sum">
          <td key="sum1" colSpan={3}>Rendelés összértéke:</td>
          <td key="sum2" colSpan={1}>{priceFormatter(sum)}</td>
        </tr>
        <tr key="date">
          <td key="date1" colSpan={2}>Rendelés dátuma:</td>
          <td key="date2" colSpan={2}>{orderInfo[0]["date"]}</td>
        </tr>
        <tr key="comment">
          <td key="comm1" colSpan={2}>Megjegyzés:</td>
          <td key="comm2" colSpan={2}>{orderInfo[0]["comment"]}</td>
        </tr>
        <tr key="status">
          <td key="stat1" colSpan={2}>Rendelés státusza:</td>
          <td key="stat2" colSpan={2}>
            <Input 
              style={{ backgroundColor: "#cedc00" }}
              type="select"
              name="orderStatus"
              data-id={orderInfo[0]["id_deliveries"]}
              defaultValue={orderInfo[0]["status"]}
              onChange={e => handleStatusChange(e)}
              >
                <option key="pending" value="PENDING">Elintézetlen</option>
                <option key="completed" value="COMPLETED">Teljesült</option>
                <option key="cancelled" value="CANCELLED">Visszavont</option>
            </Input>
          </td>
        </tr></>
      )
      rows.push(staticRows);
      return <tbody key="unique-tbody">{rows}</tbody>;
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
          { headers: { Authorization: cookies.accessToken }});
          setUpdateMsg(data.msg);
      } catch(err) {
        console.log(err);
      }
    }
    

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader 
        toggle={toggle} 
        style={{ backgroundColor: "#00594F" }}
      >A rendelés részletei
      </ModalHeader>
      <ModalBody style={{ backgroundColor: "#00352F" }}>
        {updateMsg !== "" && (<div className="updateMsg">{updateMsg}</div>)}
        {orderInfo ? (
          <div style={{ margin: "1rem" }}>
            <Table dark id="orderDetails">
            {renderOrderInfoHeader()}
            {renderOrderInfo()}
            </Table>
          </div>
        )
        :
        (<p>Hiba a rendelés adatainak lekérdezése során.</p>)
        }

        {customerInfo ? (
          <div style={{ margin: "1rem" }}>
            <Table dark id="orderDetails">
              {renderCustomerInfo()}
            </Table>
          </div>
        ) : (
          <p>Hiba a vásárlói adatok lekérése során.</p>
        )}
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
