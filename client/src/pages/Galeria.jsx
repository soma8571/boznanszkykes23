import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Spinner, Input, Button } from 'reactstrap';
import ShowMsgModal from "../components/ShowMsgModal";
import FileUpload from '../components/FileUpload';

function Galeria() {

  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [cookie] = useCookies(["accessToken"]);
  const [responseMsg, setResponseMsg] = useState("");
  //ez a láthatóság állításakor megjelenő modal, a FileUpload-nak saját modal-ja van
  const [modal, setModal] = useState(false); 
  const [uploaded, setUploaded] = useState(false);
  
  const baseUrl = process.env.REACT_APP_API_URL.includes("localhost") ? process.env.REACT_APP_API_URL + "/" : "https://www.boznanszkykes.hu/";
  
  const toggle = () => setModal(!modal);

  useEffect(() => {
    fetchGalleryTns();
  }, []);

  //ha a feltöltés sikeres volt, akkor újra kell fetchelni a képeket
  useEffect(() => {
    if (uploaded) {
      fetchGalleryTns();
    }
  }, [uploaded]);

  //a láthatósági modal bezárásakor a ResponseMsg-t "nullázni" kell
  useEffect(() => {
    if (!modal) {
        setResponseMsg("");
        fetchGalleryTns();
    }
  }, [modal]);

  //ha a ResponseMsg tartalmat kap, akkor modal segítségével jelenítjük meg
  useEffect(() => {
    if (responseMsg !== "")
      toggle();
  }, [responseMsg]);

  async function fetchGalleryTns() {
    setIsLoading(true);
    try {
        const url = `${process.env.REACT_APP_API_URL}/galeria`;
        const {data} = await axios.get(url, 
        { headers: 
            {Authorization: cookie.accessToken} 
        });
        //console.log(data);
        setImages(data);
    } catch (err) {
        console.log(err);
    } finally {
        setIsLoading(false);
    }
  }

  async function updateVisibility(imageId, visibility) {
    try {
      const url = `${process.env.REACT_APP_API_URL}/galeria/${imageId}`;
      const {data} = await axios.patch(url, 
        { visibility },
        { headers: 
            {Authorization: cookie.accessToken} 
        });
        //console.log(data);
        setResponseMsg(data.msg);
    } catch (err) {
        console.log(err);
    }
  }

  async function deletePicture(imageId) {
    try {
      const url = `${process.env.REACT_APP_API_URL}/galeria/${imageId}`;
      const {data} = await axios.delete(url, 
        { headers: 
            {Authorization: cookie.accessToken} 
        });
        setResponseMsg(data.msg);
    } catch (err) {
        console.log(err);
    }
  }

  const handleChange = (e) => {
    updateVisibility(e.target.dataset.id, e.target.value);
  }

  const handleDelete = (e) => {
    let choice = window.confirm("Biztosan törölni szeretnéd ezt a képet?");
    if (choice) 
      deletePicture(e.target.dataset.id);
  }

  const renderImages = () => {
    
    const thumbnails = images.map((img, ind) => 
    <div key={ind}>
      <img 
        src={baseUrl + img.thumbnail_path} 
        key={ind} 
        alt={img.img_description} 
        loading='lazy'
      />
      <div>
        <Input
          name="visibility"
          type='select'
          data-id={img.id_gallery}
          defaultValue={img.img_visibility} 
          style={{ backgroundColor: "#cedc00", margin: "0.5rem 0" }}
          onChange={e => handleChange(e)}>
            <option value="0">Elrejtett</option>
            <option value="1">Látható</option>
        </Input>
        <Button 
          block
          color='danger'
          onClick={e => handleDelete(e)}
          data-id={img.id_gallery}
        >
          Törlés
        </Button>
      </div>  
    </div>);
    return thumbnails;
  }

  return (
    <div>
      <h1>Galéria</h1>
      <div className='gallery-container'>
          <div style={{ maxWidth: "500px", margin: "0 auto"}}>
            <FileUpload 
              id="0"
              uploaded={uploaded}
              setUploaded={setUploaded}
              hasUploadComment={true}
            />
          </div>
          <div className='content'>
            {isLoading ? 
              (<Spinner>Loading...</Spinner>)
              :
              (<div className='gallery'>
                {renderImages()}
              </div>)
            }
            {modal && (
              <ShowMsgModal 
                message={responseMsg} 
                isOpen={modal} 
                toggle={toggle} />
            )}
          </div>
      </div>
    </div>
  );
}

export default Galeria;
