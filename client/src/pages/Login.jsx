import React, {useState} from 'react';
import {Form, FormGroup, Input, Label, Button, Spinner} from "reactstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const Login = ( { handleLogin } ) => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoginPending, setLoginPending] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [_, setCookies] = useCookies(["accessToken"]); 

    function userChange(e) {
        setUsername(e.target.value);
    }

    function pwdChange(e) {
        setPassword(e.target.value);
    }

    async function loginFormSubmit(e) {
        e.preventDefault();
        setLoginPending(true);
        try {
            const url = `${process.env.REACT_APP_API_URL}/login`;
             const response = await axios.post(
                url, 
                { username, password }
            );
                
            
            if (response.statusText === "OK") {
                let accessToken = response.data.accessToken;
                setCookies("accessToken", accessToken, { path: "/" });
                handleLogin(true);
                navigate("/");
            } 

        } catch (err) {
            if (err.response?.status === 401)
                setError("Hibás bejelentkezési adatok!");
            else
                setError(err.message);
        } finally {
            setLoginPending(false);
        }
        
    }
  
    return (
    <div className='loginWrapper'>
        <div>
        <Form onSubmit={e => loginFormSubmit(e)}>
            <FormGroup floating>
                <Input
                    id="username"
                    name="username"
                    placeholder="Felhasználónév"
                    type="text"
                    onChange={e => userChange(e)}
                    style={{ backgroundColor: "#00594F" }}
                />
                <Label for="username">
                    Felhasználónév
                </Label>
            </FormGroup>

            {' '}

            <FormGroup floating>
                <Input
                    id="password"
                    name="password"
                    placeholder="Jelszó"
                    type="password"
                    onChange={e => pwdChange(e)}
                    style={{ backgroundColor: "#00594F" }}
                />
                <Label for="password">
                    Jelszó
                </Label>
            </FormGroup>
            {' '}

            <Button>
                Belépés
            </Button>
        </Form>
        </div>
        
        <div className='loginResponse'>
            {isLoginPending ? 
                (<Spinner color="primary">Loading...</Spinner>)
                :
                (error)
            }
            
        </div>
        
    </div>
    
  )
}

export default Login;
