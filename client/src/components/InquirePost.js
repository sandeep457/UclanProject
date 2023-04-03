import { Avatar} from "@mui/material";
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteBorderIcon  from '@mui/icons-material/FavoriteBorder';
import React, { useState } from "react";
import "../styles/InquirePost.css";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import CloseIcon from '@mui/icons-material/Close';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import TimeAgo from 'react-timeago';
import axios from "axios";
import ReactHtmlParser from "html-react-parser";

function LastSeenQuestion({ date }) {
  return (
    <div>
      <TimeAgo date={date}/>
    </div>
  );
}
function LastSeenAnswer({ date }) {
  return (
    <div>
      <TimeAgo date={date}/>
    </div>
  );
}
function InquirePost({ post }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [answer, setAnswer] = useState("");
  const [like, setLike] = useState(false);
  const Close = <CloseIcon />;
  const username  =  localStorage.getItem("userName");
  const handleQuill = (value) => {
    setAnswer(value);
  };
  const handleSubmit = async () => {
    if (post?._id && answer !== "") {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = {
        answer: answer,
        questionId: post?._id,
        user: username,
        createdDate: new Date()
      };
      await axios
        .post("/api/answer", body, config)
        .then((res) => {
          console.log(res.data);
          alert("Answer added succesfully");
          setIsModalOpen(false);
          window.location.href = "/dashboard";
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };
  return (
    <div className="post">
      <div className="post__info">
        <Avatar src={post?.user?.photo} />
        <h4>{post?.user}</h4>

        <small>
          <LastSeenQuestion date={post?.createdAt} />
        </small>
      </div>
      <div className="post__body">
        <div className="post__question">
          <p>{post?.questionName}</p>
          <Modal
            open={isModalOpen}
            closeIcon={Close}
            onClose={() => setIsModalOpen(false)}
            closeOnEsc
            center
            closeOnOverlayClick={false}
            styles={{
              overlay: {
                height: "auto",
              },
            }}
          >
            <div className="modal__question">
              <h1>{post?.questionName}</h1>
              <p>
                asked by <span className="name">{post?.user}</span> on{" "}
                <span className="name">
                  {new Date(post?.createdAt).toLocaleString()}
                </span>
              </p>
            </div>
            <div className="modal__answer">
              <ReactQuill
                value={answer}
                onChange={handleQuill}
                placeholder="Enter your answer"
              />
            </div>
            <div className="modal__button">
              <button className="cancle" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button onClick={handleSubmit} type="submit" className="add">
                Add Answer
              </button>
            </div>
          </Modal>
        </div>
        {post.questionUrl !== "" && <img src={post.questionUrl} alt="url" />}
      </div>
      <div className="post__footer">
        <span title='Answer' style={{cursor:'pointer'}}><ChatBubbleOutlineOutlinedIcon onClick={() => {
              setIsModalOpen(true);
            }}/></span>
        
      </div>
      <p
        style={{
          color: "rgba(0,0,0,0.5)",
          fontSize: "12px",
          fontWeight: "bold",
          margin: "10px 0",
        }}
      >
        {post?.allAnswers.length} Answer(s)
      </p>
      <div
        style={{
          margin: "5px 0px 0px 0px ",
        }}
        className="post__answer"
      >
        {post?.allAnswers?.map((_a) => (
          <>
          <div key={_a?.user?.userName}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                padding: "10px 5px",
                border: "1px solid gray",
                marginBottom:"10px",
                borderRadius:"1.5em"
              }}
              className="post-answer-container"
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "#888",
                }}
                className="post-answered"
              >
                <Avatar src={_a?.user?.photo} />
                <div
                  style={{
                    margin: "0px 10px",
                  }}
                  className="post-info"
                >
                  <p>{_a?.user?.userName}</p>
                  <span>
                    <LastSeenAnswer date={_a?.createdAt} />
                  </span>
                </div>
                <span title='Like' style={{cursor:'pointer',padding:'0px 15px'}}>
                  <FavoriteBorderIcon onClick={() => {
              setLike(true);
            }}/></span>
              </div>
              <div className="post-answer">{ReactHtmlParser(_a?.answer)}</div>
            </div></div>
          </>
        ))}
      </div>
    </div>
  );
}

export default InquirePost;