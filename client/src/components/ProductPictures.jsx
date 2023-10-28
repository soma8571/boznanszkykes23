import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Button, Spinner } from 'reactstrap';
import FileUpload from '../components/FileUpload';

function ProductPictures( {termekId} ) {

    const [imageUrls, setImageUrls] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [cookie] = useCookies(["accessToken"]);
    const [responseMsg, setResponseMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [uploaded, setUploaded] = useState(false);

    const baseUrl = process.env.REACT_APP_API_URL.includes("localhost") ? process.env.REACT_APP_API_URL + "/" : "https://www.boznanszkykes.hu/";

    useEffect(() => {
        fetchImageURLs();
    }, []);

    useEffect(() => {
        if (responseMsg !== "" || uploaded)
            fetchImageURLs();
    }, [responseMsg, uploaded]);

    async function fetchImageURLs() {
        setIsLoading(true);
        try {
            const url = `${process.env.REACT_APP_API_URL}/termekkepek/${termekId}`;
            const {data} = await axios.get(url, 
                { headers: 
                    { Authorization: `Bearer ${cookie.accessToken}` }
                });
            setImageUrls(data);
        } catch (err) {
            setErrorMsg("Hiba a termék kép(ek) lekérdezése során. " + err);
        } finally {
            setIsLoading(false);
        }
    }

    async function deleteImage(imageId) {
        try {
            const url = `${process.env.REACT_APP_API_URL}/termekkeptorlese/${imageId}`;
            const {data} = await axios.delete(url, 
                { headers: 
                    { Authorization: `Bearer ${cookie.accessToken}` } 
                });
            setResponseMsg(data.msg);
        } catch (err) {
            setErrorMsg("Hiba a kép törlése során. " + err);
        }
    }

    async function updateProfilPicture(imageId, productId) {
        try {
            const url = `${process.env.REACT_APP_API_URL}/termekprofilmodositas/${imageId}`;
            const {data} = await axios.patch(url, 
                { productId }, 
                { headers: 
                    { Authorization: `Bearer ${cookie.accessToken}` } 
                });
            setResponseMsg(data.msg);
        } catch (err) {
            setErrorMsg("Hiba a profilkép módosítása során. " + err);
        }
    }

    function handleImageDelete(imageId) {
        setResponseMsg("");
        const sure = window.confirm("Biztosan törölni szeretnéd ezt a képet?");
        if (sure) {
            deleteImage(imageId);
        }
    }
    
    function handleImageSetProfil(imageId, productId) {
        setResponseMsg("");
        updateProfilPicture(imageId, productId);
    }
    
    function renderProductPictures() {
        const pictures = imageUrls.map((image, ind) => 
            <div key={ind}>
                <img 
                    src={baseUrl + image.thumbnail_path} 
                    alt={`kep-${ind}`} 
                    key={ind} 
                />
                <div className='picButtons'>
                    <div><Button 
                            color='danger'
                            onClick={() => handleImageDelete(image.id)} 
                            block>Törlés
                        </Button>
                    </div>
                    {Number(image.profil) !== 1 && (
                        <div><Button 
                                color='info'
                                onClick={() => handleImageSetProfil(image.id, image.knives_id)}
                                block>Profil
                            </Button>
                        </div>
                    )}
                </div>
                
                
            </div>
        );
        return pictures;
    }


  return (
    <div className='saleSettings'>
        <h3>Termék képek</h3>
        {errorMsg !== "" && <div className='error'>{errorMsg}</div>}
        {isLoading ? 
            (<Spinner>Betöltés...</Spinner>)
            :
            (imageUrls.length > 0 ?
                (<div className='thumbnailWrapper'>
                    {renderProductPictures()}
                </div>
                )
                : 
                (<p>Nincs megjeleníthető kép.</p>)
            )
        }
        
        <FileUpload 
            id={termekId}
            uploaded={uploaded}
            setUploaded={setUploaded}
            hasUploadComment={false}
        />
    </div>
  )
}

export default ProductPictures;
