import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Input } from "reactstrap";
import { useCookies } from 'react-cookie';
import ShowMsgModal from "./ShowMsgModal";

function FileUpload( { id, uploaded, setUploaded, hasUploadComment }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [cookie] = useCookies(["accessToken"]);
  const [modal, setModal] = useState(false);
  const [uploadComment, setUploadComment] = useState("");
  
  const toggleModal = () => {
    setUploadProgress(0);
    setModal(!modal); 
    if (!modal) {
      setUploaded(true);
    }  
  }

  useEffect(() => {
    setSelectedFile(null);
    setUploadComment("");
  }, [uploaded]);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    setUploaded(false);
    if (!selectedFile) {
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("comment", uploadComment);
    
    try {
        const url = `${process.env.REACT_APP_API_URL}/kepfeltoltes/${id}`;
        const response = await axios.post(url, formData, {
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      if (response.status === 200) {
        //setUploaded(true);
        toggleModal();
      }
    } catch (error) {
      console.error("Hiba a fájl feltöltése során: ", error);
    }
  };

  return (
    <div className="imageUpload">
      <h3>Új kép feltöltése</h3>

      <form>
        <Input 
          type="file" 
          onChange={handleFileChange} 
          style={{ backgroundColor: "#cedc00" }}
        />
        {hasUploadComment && (
          <Input 
            type="text" 
            name="comment" 
            placeholder="Leírás a képhez (opcionális)"
            maxLength="200"
            style={{ backgroundColor: "#cedc00", margin: "0.5rem 0"}}
            value={uploadComment}
            onChange={e => setUploadComment(e.target.value)}
          />
        )}
        <Button 
          color="warning" 
          onClick={handleUpload}
          style={{ margin: "0.5rem 0" }}
        >
          Feltöltés
        </Button>
      </form>
          {uploadProgress > 0 && <p>Feltöltés folyamatban: {uploadProgress}%</p>}
          {uploaded && <ShowMsgModal 
            message="A fájl sikeresen feltöltődött."
            isOpen={modal}
            toggle={toggleModal}
            />}
    </div>
  );
}

export default FileUpload;
