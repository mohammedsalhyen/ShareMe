import React, { useEffect, useState }  from "react";
import { useParams } from "react-router-dom";
import MasonryLayout from "./MasonryLayout";
import { client } from "../client";
import Spinner from "./Spinner";
import { feedQuery, searchQuery } from "../utils/data";
const Feed=()=>{
    const [loading ,setLoading]=useState(false);
    const [pins ,setPins]=useState();
    const {categoryId}=useParams()
    useEffect(() => {
        if (categoryId) {
            setLoading(true);
            const query = searchQuery(categoryId);
            client.fetch(query).then((data) => {
                setPins(data);
                setLoading(false);
            });
            } else {
            setLoading(true);
        
            client.fetch(feedQuery).then((data) => {
                setPins(data);
                setLoading(false);
            });
            }
        }, [categoryId]);
    if(loading) return <Spinner message="We are adding new ideas for You!"/>
    if(!pins?.length) return <h2 className="  text-center text-2xl "> No Feature here...</h2>
    return(
        <div>
            {pins&&<MasonryLayout pins={pins}/>}
        </div>
    )
}
export default Feed;
