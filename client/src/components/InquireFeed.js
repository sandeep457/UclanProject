import React, { useEffect, useState } from "react";
import "../styles/InquireFeed.css";
import InquirePost from "./InquirePost";
import axios from "axios";
import { useCategoryStore } from  '../store/store';

function InquireFeed() {
    const [InquirePosts, setInquirePosts] = useState([]);
    const { category } = useCategoryStore(state => state.value);
    useEffect(() => {
      axios
        .get("/api/getAllQuestions")
        .then((res) => {
          console.log(res.data.reverse());
          setInquirePosts(res.data);
        })
        .catch((e) => {
          console.log(e);
        });
    }, []);
    return (
      <div className="Inquirefeed">
        {InquirePosts && InquirePosts.length > 0 && InquirePosts.filter(post => (post.category === category || category === 'None')).map((post, index) => (
          <InquirePost key={post._id} post={post}/>  
        ))}
      </div>
    );
}

export default InquireFeed