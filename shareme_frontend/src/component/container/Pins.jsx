import React ,{ useState } from "react";
import {Routes,Route} from "react-router-dom"
import {Search,CreatePins,Feed,PinDetails,Navbar} from "../../component"
const Pins=({user})=>{
    const [search,setSearch]=useState("");
    return(
        <div className=" px-2 md:px-5">
            <div className=" bg-gray-50">
                <Navbar search={search} setSearch={setSearch} user={user} />
            </div>
            <div className=" h-full">
                <Routes>
                    <Route path="/" element={<Feed/>}/>
                    <Route path="/category/:categoryId" element={<Feed/>}/>
                    <Route path="/pin-detail/:pinId" element={<PinDetails user={user}/>}/>
                    <Route path="/create-pin" element={<CreatePins user={user}/>}/>
                    <Route path="/search" element={<Search search={search} setSearch={setSearch} />}/>
                </Routes>
            </div>
        </div>
    )
}
export default Pins;
