
import { GoogleLogin } from "react-google-login";
import {useNavigate } from "react-router-dom";
import { FcGoogle} from "react-icons/fc";
import shreMeVideo from "../assets/share.mp4"
import Logo from "../assets/logowhite.png";
import {gapi} from "gapi-script"
import { useEffect } from "react";
import { client } from "../client";
const Login=()=>{
    const navigate=useNavigate();
    const clientId="797515085637-his674s8nnbid2j9s70uctje8l3uli4h.apps.googleusercontent.com";
    //this to solve issue of google auth is blocked and give error 
    useEffect(()=>{
        function start(){
            gapi.client.init({clientId:clientId,scope:""})
        };
        gapi.load("client:auth2",start)
    });

    const responseGoogle=(response)=>{
        console.log(response)
        localStorage.setItem("user",JSON.stringify(response.profileObj))
        const {name,googleId,imageUrl}=response.profileObj;
        const doc={
            _id:googleId,
            _type:"user",
            userName:name,
            image:imageUrl 
        }
        client.createIfNotExists(doc)
        .then((result) => {
            navigate("/",{replace:true})
        })
    }
    return(
        <div className="flex flex-col justify-start items-center h-screen">
            <div className=" relative w-full h-full ">
                <video 
                src={shreMeVideo}
                type="video/mp4"
                autoPlay
                loop
                muted
                controls={false}
                className="w-full h-full object-cover"
                />
            </div>
            <div className="flex flex-col absolute justify-center items-center top-0 left-0 bottom-0 right-0 bg-blackOverlay">
                <div className=" p-5">
                    <img src={Logo} alt="logo"/>
                </div>
                <div className=" shadow-2xl">
                    <GoogleLogin
                        clientId={clientId}
                        render={(renderProps)=>(
                            <button 
                            type="button" 
                            className=" bg-mainColor flex items-center p-3 outline-none rounded-lg"
                            onClick={renderProps.onClick}
                            disabled={renderProps.disabled}
                            >
                                <FcGoogle className="mr-4"/> sign in with Google
                                
                            </button>
                        )}  
                        onSuccess={responseGoogle}
                        onFailure={responseGoogle}
                        cookiePolicy="single_host_origin"
                    />
                </div>
            </div>
        </div>
    )
}
export default Login;