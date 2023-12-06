import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import {Form, FormGroup, Label, Input, Button} from "reactstrap";

function Hirlevel() {

  const initialObj = {
    title: "",
    body: "",
    sendDate: ""
  };
  const [newsLetter, setNewsLetter] = useState({
    title: "",
    body: "",
    sendDate: ""
  });
  const [responseMsg, setResponseMsg] = useState("");
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);
  const [cookie] = useCookies(["accessToken"]);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isSaveSuccess) {
      setNewsLetter(initialObj);
    }
  }, [isSaveSuccess]);

  /* useEffect(()=>{
    console.log(newsLetter);
  }, [newsLetter]); */

  async function postNewsletter() {
    setIsSending(true);
    setError("");
    try {
      const url = `${process.env.REACT_APP_API_URL}/hirlevel`;
      const {data} = await axios.post(url,
        { newsLetter },
        { headers: { Authorization: `Bearer ${cookie.accessToken}` } });
        setResponseMsg(data.msg);
        setIsSaveSuccess(true);
        console.log(data);
    } catch (err) {
        //console.log(err);
        let errorMsg = err?.response?.data?.msg ?? err.message;
        setError(errorMsg);
    } finally {
      setIsSending(false);
    }
  }

  const handleChange = (e) => {
    setResponseMsg("");
    setIsSaveSuccess(false);
    const {value} = e.target;
    setNewsLetter({...newsLetter, [e.target.name]: value }); 
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    //console.log(newsLetter);
    postNewsletter();
  }

  return (
    <div className='newsletterForm'>
      <h1>Hírlevél</h1>
      {responseMsg !== "" && (<div className='updateMsg'>{responseMsg}</div>)}
     <Form onSubmit={e => handleSubmit(e)} id="newsletterForm">
      <FormGroup>
        <Label for="title">Hírlevél címe:</Label>
        <Input 
          type='text'
          id='title'
          name='title'
          placeholder='Cím'
          style={{ backgroundColor: "#cedc00" }}
          onChange={e => handleChange(e)}
          value={newsLetter.title}
          maxLength={100}
          required
        >
        </Input>  
      </FormGroup>
      <FormGroup>
        <Label for="body">Hírlevél törzse:</Label>
        <Input 
          type='textarea'
          id='body'
          name='body'
          placeholder='Szöveg'
          style={{ backgroundColor: "#cedc00", minHeight: "200px" }}
          onChange={e => handleChange(e)}
          value={newsLetter.body}
          maxLength={1000}
          required
        >
        </Input> 
      </FormGroup>

      <FormGroup>
        <Label for="sendDate">Kiküldés dátuma:</Label>
        <Input
          id="sendDate"
          name="sendDate"
          placeholder="Kiküldés dátuma"
          type="date"
          style={{ backgroundColor: "#cedc00" }}
          onChange={e => handleChange(e)}
          value={newsLetter.sendDate}
          required
        />
      </FormGroup>
      <Button>Küldés</Button>
     </Form>
     <div className="error">
      {error !== "" && error}
     </div>
    </div>
  );
}

export default Hirlevel;
