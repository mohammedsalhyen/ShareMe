import React, { useState }  from "react";
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';

import Spinner from "./Spinner";
import { client } from "../client.js";
import {categories} from "../utils/data.js"
const CreatePins=({user})=>{

    //all hooks you will need 
    const [destination,setDestination]=useState("");
    const [title,setTitle]=useState("");
    const [about,setAbout]=useState("");
    const [loading,setLoading]=useState(false);
    const [fields,setFields]=useState(null);
    const [category,setCategory]=useState(null);
    const [imageAsset,setImageAsset]=useState();
    const [wrongImage,setWrongImage]=useState(false);
    const navigate=useNavigate();

    const uploadImage=(e)=>{
        const selectedFile= e.target.files[0];
        if (selectedFile.type === "image/jpg" || selectedFile.type === "image/jpeg" || selectedFile.type === "image/gif" || selectedFile.type === "image/png" ||selectedFile.type === "image/svg" ||selectedFile.type === "image/tiff"   ) {
            setWrongImage(false);
            setLoading(true);
            client.assets
            .upload('image', selectedFile, { contentType: selectedFile.type, filename: selectedFile.name })
            .then((document) => {
                setImageAsset(document);
                setLoading(false);
            })
            .catch((error) => {
                console.log('Upload failed:', error.message);
            });
    
        } else {
            setWrongImage(true);
            setLoading(true);
        }
    }
    const savePin=()=>{
        if (title && about && destination && imageAsset?._id && category) {
            const doc = {
                _type: 'pin',
                title,
                about,
                destination,
                image: {
                    _type: 'image',
                    asset: {
                    _type: 'reference',
                    _ref: imageAsset?._id,
                    },
                },
                userId: user._id,
                postedBy: {
                    _type: 'postedBy',
                    _ref: user._id,
                },
                category,
                };
                client.create(doc).then(() => {
                navigate('/');
                });
            } else {
                setFields(true);
        
                setTimeout(
                () => {
                    setFields(false);
                },
                2000,
                );
            }
    };
    return(
        <div className=" flex flex-col justify-center items-center mt-4 lg:h-4/5">
            {fields&&(
                <p className=" text-red-600 transition-all duration-100 m-4 ease-out font-bold">
                    Plaese Add new Image...
                </p>
            )}
            <div className="flex flex-col justify-center items-center rounded-md  lg:p-5 p-3 bg-white lg:w-4/5 w-full">
                <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
                    <div className="flex flex-col justify-center items-center border-2 border-gray-300 border-dotted w-full h-420">
                        {loading&&(<Spinner/>)}
                        {wrongImage&&(
                            <p className="text-red-600 animate-pulse transition-all duration-100 m-4 ease-out font-bold"  >
                                It&apos;s wrong file type.
                            </p>
                        )}
                        {!imageAsset?(
                            <label>
                                <div className="flex justify-center items-center cursor-pointer">
                                    <div className="flex flex-col justify-center items-center">
                                        <p className=" font-bold  text-4xl " >
                                        <AiOutlineCloudUpload/>
                                        </p>
                                        <p className=" font-bold  text-lg pt-3 " >
                                        Click to upload..
                                        </p>
                                        <p className=" mt-32 text-gray-500 " >
                                        You can upload high Quality image JPG, JPEG, SVG, PNG, GIF, TIFF less 20 MB
                                        </p>
                                    </div>
                                </div>
                                <input
                                type="file"
                                name="upload"
                                onChange={uploadImage}
                                className="h-0 w-0"
                                />
                            </label>
                        ):(
                        <div className=" flex justify-center items-center relative w-full h-full">
                            <img 
                                className=" h-full w-full rounded-md "
                                src={imageAsset?.url}
                                alt="uploaded-pic"

                            />
                            <button 
                            type="button" 
                            onClick={()=>setImageAsset(null)}
                            className=" absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out ">
                                <MdDelete/>
                            </button>
                        </div>
                        )}
                    </div>
                </div>
                <div className=" flex flex-col justify-center w-full h-full">
                    <input
                    type="text"
                    placeholder="Enter image title"
                    value={title}
                    onChange={(e)=>setTitle(e.target.value)}
                    className="m-4 p-2 border-b-2 border-gray-200  focus:outline-none"
                    />
                    <input
                    type="text"
                    placeholder="Tell everyone what your Pin is about"
                    value={about}
                    onChange={(e)=>setAbout(e.target.value)}
                    className="m-4 p-2 border-b-2 border-gray-200  focus:outline-none"
                    />
                    <input
                    type="text"
                    placeholder="Add the source of image"
                    value={destination}
                    onChange={(e)=>setDestination(e.target.value)}
                    className="m-4 p-2 border-b-2 border-gray-200  focus:outline-none"
                    />
                    <div className="flex flex-col">
                        <p className=" font-bold p-2 m-4">Select cateogery</p>
                        <select 
                            onChange={(e) => {
                                setCategory(e.target.value);
                            }}
                        className="outline-none w-4/5 text-base border-b-2 border-gray-200 ml-4 p-2 rounded-md cursor-pointer ">
                            <option className="sm:text-bg bg-white"  value="other">Other Cateogery</option>
                            {categories.map((item)=>(
                                <option key={item.name} className="text-base border-0 outline-none capitalize bg-white text-black "  value={item.name}>
                                    {item.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {user&&
                        <div className="flex flex-row items-center mt-8">
                            <img
                                src={user?.image}
                                alt="user-profile"
                                className="w-12 h-12 rounded-full "
                            />
                            <p className="font-bold ml-2">{user?.userName}</p>
                        </div>
                    }
                    <div className="flex flex-row justify-end mt-5">
                        <button 
                        onClick={savePin}
                        className=" bg-green-600 font-bold text-white rounded-full p-2 pl-4 pr-4 ">
                            Save Pin
                        </button>
                    </div>
                </div>
            </div>
            

        </div>
    )
}
export default CreatePins;