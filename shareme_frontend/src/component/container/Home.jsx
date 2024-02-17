import React ,{useState,useEffect,useRef} from "react";
import {HiMenu} from "react-icons/hi";
import {AiFillCloseCircle} from "react-icons/ai";
import {Link,Route,Routes} from "react-router-dom"
import {UserProfile,Slidebar} from "../index"
import Pins from "./Pins";
import { client } from "../../client";
import logo from "../../assets/logo.png";
import { userQuery } from "../../utils/data";
import { fetchUser } from "../fetchUser";
const Home=()=>{
    const [ToogleSlidebar,setToogleSlidebar]=useState(false);
    const [user,setUser]=useState(null);
    const scrollRef=useRef(null);
    const userInfo=fetchUser();
    useEffect(()=>{
        const Query=userQuery(userInfo?.googleId);
        client.fetch(Query)
        .then((data)=>{
            setUser(data[0])
        })
    },[])
    useEffect(()=>{
        scrollRef.current.scrollTo(0,0)
    },[])
    return(
        <div className=" flex md:flex-row flex-col bg-gray-50 transaction-height h-screen duration-75 ease-out">
            <div className=" hidden md:flex h-screen flex-initial">
                <Slidebar user={user && user}/>
            </div>
            <div className=" flex md:hidden flex-row">
                <div className=" p-2 w-full flex justify-between items-center flex-row shadow-md">
                    <HiMenu fontSize={40} className=" cursor-pointer" onClick={()=> setToogleSlidebar(true)}/>
                    <Link to="/">
                        <img src={logo} alt="logo" className=" w-28"/>
                    </Link>
                    <Link to={`user-profile/${user?._id}`}>
                        <img src={user?.image} alt="logo" className=" w-28"/>
                    </Link> 
                </div>
                {ToogleSlidebar&&(
                    <div className=" fixed h-screen w-4/5 overflow-y-auto bg-white shadow-md z-10 animate-slide-in">
                        <div className=" absolute w-full flex justify-end items-center p-2 ">
                            <AiFillCloseCircle fontSize={30} className=" cursor-pointer" onClick={()=> setToogleSlidebar(false)} />
                        </div>
                        <Slidebar user={user && user} closeToogle={setToogleSlidebar} />
                    </div>
                )}
            </div>
            <div className=" pb-2 flex-1 overflow-y-scroll " ref={scrollRef}>
                <Routes>
                    <Route path="/user-profile/:userId" element={<UserProfile/>}/>
                    <Route path="/*" element={<Pins user={user&& user}/>}/>
                </Routes>
            </div>
        </div>
    )
}
export default Home;