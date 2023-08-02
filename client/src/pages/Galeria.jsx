import React, { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Spinner, Input } from 'reactstrap';
import ShowMsgModal from "../components/ShowMsgModal";

function Galeria() {

  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [cookie] = useCookies(["accessToken"]);
  const [responseMsg, setResponseMsg] = useState("");
  const [modal, setModal] = useState(false);
  
  const toggle = () => setModal(!modal);

  useEffect(() => {
    fetchGalleryTns();
  }, []);

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

const handleChange = (e) => {
  updateVisibility(e.target.dataset.id, e.target.value);
}

const renderImages = () => {
  const baseUrl = "https://www.boznanszkykes.hu/uploads/gallery/thumbnails/";
  const thumbnails = images.map((img, ind) => 
  <div key={ind}>
    <img 
      src={baseUrl + img.img_path} 
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
    </div>  
  </div>);
  return thumbnails;
}

  return (
    <div>
      <h1>Galéria</h1>
      <div className='flex-container'>
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
