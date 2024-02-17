import React, { Fragment, useEffect, useState }  from "react";
import {Link,useParams}from "react-router-dom";
import {MdDownloadForOffline}from "react-icons/md"
import { v4 as uuidv4 } from 'uuid';

import { client,urlFor } from "../client";
import {pinDetailMorePinQuery,pinDetailQuery} from "../utils/data.js"
import Spinner from "./Spinner";
import MasonryLayout from "./MasonryLayout.jsx";
const PinDetails=({user})=>{
    const [pins ,setPins]=useState();
    const [pinDetail ,setPinDetail]=useState();
    const [comment ,setComment]=useState("");
    const [addingCommmet ,setAddingComment]=useState(false);
    const {pinId}=useParams();

    const fetchPinDetails = () => {
        const query = pinDetailQuery(pinId);
        if (query) {
            client.fetch(`${query}`).then((data) => {
                setPinDetail(data[0]);
                if (data[0]) {
                const query1 = pinDetailMorePinQuery(data[0]);
                client.fetch(query1).then((res) => {
                    setPins(res);
                });
                }
            });
        }
    };

    const addComment=()=>{
        if (comment) {
            setAddingComment(true);
            client
                .patch(pinId)
                .setIfMissing({ comments: [] })
                .insert('after', 'comments[-1]', [{ comment, _key: uuidv4(), postedBy: { _type: 'postedBy', _ref: user._id } }])
                .commit()
                .then(() => {
                fetchPinDetails();
                setComment('');
                setAddingComment(false);
                });
        }
    }

    useEffect(()=>{
        fetchPinDetails();
    },[pinId])

    if(!pinDetail){
        return(
            <Spinner message="we are Search for pin detail..."/>
        )
        
    }
    return(
        <Fragment>
            {pinDetail&&
                <div className="flex xl:flex-row flex-col bg-white m-auto" style={{ maxWidth:"1500px", borderRadius:"32px"}}>
                    <div className="flex justify-center items-center md:items-start flex-initial">
                        <img 
                            className=" rounded-t-3xl rounded-b-lg "
                            src={(pinDetail?.image&&urlFor(pinDetail?.image).url())}
                            alt="pin"
                        />
                    </div>
                    <div className="w-full p-5 flex-1 xl:min-w-620">
                        <div className="flex justify-between items-center">
                            <div>
                                <a
                                    href={`${pinDetail.image.asset.url}?dl=`}
                                    className="bg-secondaryColor p-2 text-xl rounded-full flex items-center justify-center text-dark opacity-75 hover:opacity-100"
                                >
                                    <MdDownloadForOffline/>
                                </a>
                            </div>
                            <a 
                                href={pinDetail.destination}
                                target="_blank"
                                rel="noreferrer" 
                            >
                                {pinDetail.destination}
                            </a>
                        </div>
                        <div>
                            <h1 className=" text-3xl p-2 mt-3 font-bold">
                                {pinDetail.title}
                            </h1>
                            <p className="p-2 text-gray-500">{pinDetail.about}</p>
                        </div>
                        <Link to={`/user-profile/${pinDetail?.postedB?._id}`} className="flex gap-2 mt-2 items-center">
                            <img
                            className="w-8 h-8 rounded-full object-cover"
                            src={pinDetail?.postedBy.image}
                            alt="user-profile"
                            />
                            <p className="font-semibold text-black capitalize">{pinDetail?.postedBy.userName}</p>
                        </Link>
                        <h2 className="font-bold p-2 mt-8">Comments</h2>
                        <div className="max-h-370 overflow-y-auto">
                            {pinDetail?.comments?.map((item)=>(
                                <div className="flex items-center gap-2 mt-4 rounded-lg" key={item.comment}>
                                    <img
                                        className="w-8 h-8 rounded-full object-cover"
                                        src={item.postedBy?.image}
                                        alt="user-profile"
                                    />
                                    <div className="flex flex-col ">
                                        <p className="font-bold">{item.postedBy?.userName}</p>
                                        <p className=" text-gray-600">{item.comment}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex items-center flex-wrap mt-9 gap-3">
                            <Link to={`/user-profile/${pinDetail?.postedB?._id}`} >
                                <img
                                className="w-8 h-8 rounded-full object-cover"
                                src={user?.image}
                                alt="user-profile"
                                />
                            </Link>
                            <input
                                type="text"
                                placeholder="write your commet..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className=" flex-1 border-2 p-2 outline-none border-gray-100 focus:border-gray-300 rounded-lg"
                            />
                            <button 
                            type="button"
                            onClick={addComment}
                            className=" font-semibold outline-none text-white bg-red-500 rounded-full px-6 py-2 w-auto cursor-pointer"
                            >
                                {addingCommmet?"Saving..":"Save"}
                            </button>
                        </div>
                    </div>
                </div>
            }
            {pins?.length>0&&(
                <div>
                    <p className=" text-center font-bold text-red-500 my-6 ">More you may like</p>
                </div>
            )
            }
            {pins?(
                <MasonryLayout pins={pins}/>
            ):(
                <Spinner message="Loading more pins" />
            )
                
            }
        </Fragment>
    )
}
export default PinDetails;