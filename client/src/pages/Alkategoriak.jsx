import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { useCookies } from "react-cookie";
import { Spinner, Input, Button } from 'reactstrap';

function Alkategoriak() {

   const defaultSubcat = {
      subcategory_name: "",
      type: "penknife",
   };
   const [cookies] = useCookies(["accessToken"]);
   const [subCats, setSubCats] = useState([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");
   const [newSubCat, setNewSubCat] = useState(defaultSubcat);
   const [postError, setPostError] = useState("");

   useEffect(()=>{
      fetchData();
   }, []);

   /* useEffect(()=>{
      console.log(newSubCat);
   },[newSubCat]); */

   async function fetchData() {
      setIsLoading(true);
      try {
        const url = `${process.env.REACT_APP_API_URL}/alkategoriak`;
        const {data} = await axios.get(url, {
          headers: 
            { Authorization: `Bearer ${cookies.accessToken}` }
          }
        );
        if (Array.isArray(data) && data.length > 0) {
          setSubCats(data);
          //console.log(data);
        } else {
          //console.log(data);
          setError("Úgy tűnik jelenleg nincs alkategória a rendszerben.");
        }
        
      } catch (err) {
        let errorMsg = err.message ?? "Hiba történt az adatok lekérése során.";
        setError(errorMsg);
      }
      finally {
         setIsLoading(false);
      }
   }

   async function postData() {
      try {
         const url = `${process.env.REACT_APP_API_URL}/uj-alkategoria`;
         const {data} = await axios.post(url, {newSubCat}, {
            headers: 
               { Authorization: `Bearer ${cookies.accessToken}` }
         });
         //console.log(data);
         setNewSubCat(defaultSubcat);
         fetchData();
      } catch (err) {
         let postError = err.message ?? "Hiba az adatok küldése során.";
         setPostError(postError);
      }
   }

   async function deleteSubcat(id) {
      try {
         const url = `${process.env.REACT_APP_API_URL}/alkategoria-torles/${id}`;
         const {data} = await axios.delete(url, {
            headers: 
               { Authorization: `Bearer ${cookies.accessToken}` }
         });
         fetchData();
      } catch (err) {
         let postError = err.message ?? "Hiba az adatok küldése során.";
         setPostError(postError);
      }
   }

   function renderSubCats() {
      const sc = subCats.map((item, ind) => 
         <div className="subcat" key={ind}>
            {item.subcategory_name}
            <span 
               className="material-symbols-outlined delete-icon"
               data-id={item.idknives_subcategories}
               onClick={e=>handleDelete(e)}
            >
               delete
            </span>
         </div>   
      );
      return <div className="subcats-wrapper">{sc}</div>;
   }

   function handleDelete(e) {
      //alert(e.target.dataset.id);
      deleteSubcat(e.target.dataset.id);
   }

   function handleChange(e) {
      const {name, value} = e.target;
      setNewSubCat(prev => {
         return {...prev, [name]: value };
      });
   }

   function handleSubmit(e) {
      e.preventDefault();
      postData();
   }

   return (
      <div>
      <h1>Alkategóriák</h1>
      <div className="flex-container-col-v2">
         {isLoading ? 
            (<Spinner></Spinner>)
            :
            (error !== "" ?
               (<div>{error}</div>)
               :
               (renderSubCats())
            )
         }
         <div className="new-subcat">
            <form onSubmit={e=>handleSubmit(e)}>
               <div className="data-group">
                  <label htmlFor="subcat_name">Új alkategória neve:</label>
                  <Input
                     type='text'
                     id='subcat_name'
                     name='subcategory_name'
                     value={newSubCat.subcategory_name}
                     onChange={e=>handleChange(e)}
                     maxLength={44}
                     style={{ backgroundColor: "#cedc00" }}
                  />
                  <Button style={{marginBlock: "1rem"}}>Hozzáad</Button>
               </div>
               <div style={{ marginBlock: "1rem", color: "red"}}>
                  {postError !== "" && postError}
               </div>
            </form>
         </div>
      </div>
      </div>
   );
}

export default Alkategoriak;
