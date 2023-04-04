/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from "react";
import "../styles/Header.css";
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
//import SearchIcon from '@mui/icons-material/Search';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import CloseIcon from '@mui/icons-material/Close';
import avatar from '../assets/profile.png';
import LogoutIcon from '@mui/icons-material/Logout';
import { Avatar, Button, TextField } from "@mui/material";
import { Modal } from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import axios from "axios";
import useFetch from '../hooks/fetch.hook';
import styles from '../styles/Username.module.css';

export default function Header(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [category, setCategory] = React.useState('None');
  const  username  =  localStorage.getItem("userName");
  const [{ apiData }] = useFetch(`/user/${username}`);
  const Close = <CloseIcon />;
  const navigate = useNavigate();
  const handleSubmit = async () => {
    if (question !== "") {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      
        const body = {
          questionName: question,
          questionUrl: inputUrl,
          user: username,
          category: category,
          createdDate: new Date()
        };
      
      
      await axios
        .post("/api/question", body, config)
        .then((res) => {
          console.log(res.data);
          alert(res.data.message);
          window.location.href = "/dashboard";
        })
        .catch((e) => {
          console.log(e);
          alert("Error in adding question");
        });
    }
  };
  const handleProfile = () => {
    navigate('/profile')
  };
  const handleSelect = (event) => {
    setCategory(event.target.value)
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/')
  };
  return (
    <div className="uHeader">
      <div className="uHeader-content">
        <div className="uHeader__logo">
          <img
            src="https://moein.video/wp-content/uploads/2021/12/QA-GIF-Quastion-and-Answer-Royalty-Free-Animated-Icon-350px-after-effects-project.gif"
            alt="logo"
          />
        </div>
        <div className="uHeader__icons">
          <div className="uHeader__icon" title={"Home"} onClick={() => window.location.reload(false)}>
            <HomeIcon />
          </div>
          <div className="uHeader__icon" title={"Users"} onClick={() => window.location.reload(false)}>
            <PeopleAltIcon/>
          </div>
        </div>
        {/* <div className="uHeader__input">
          <SearchIcon />
          <input type="text" placeholder="Search questions" />
        </div> */}
        <div className="uHeader__Rem">
          <div className='profile flex justify-center py-3' onClick={handleProfile} title={"View Profile"}>
            <img src={apiData?.profile || avatar} className={styles.profile_img} alt="avatar" />
           </div>
          <Button onClick={() => setIsModalOpen(true)}>Add Question</Button>
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
            <div className="modal__title">
              <h5>Add Your Question</h5>
            </div>
            <div className="modal__info">
              <Avatar src={apiData?.profile} className="avatar" />
              <div className="modal__scope">
                <PeopleAltIcon />
                <p>Public</p>
                <ExpandMoreIcon />
              </div>
            </div>
            <div className="modal__Field">
              <TextField
                value={question}
                rows={5}
                col={5}
                id="question"
                onChange={(e) => setQuestion(e.target.value)}
                type=" text"
                placeholder="Start your question with 'What', 'How', 'Why', etc. "
              />
              <div style={{padding:'15px 0px  0px'}}>
              <InputLabel id="simple-select-label" style={{display:'inline-block',color:'black',padding:'20px 20px 20px 0px', float:'left', fontWeight:'bold'}}>Category:</InputLabel>
              <Select
                labelId="simple-select-label"
                id="simple-select"
                value={category}
                style={{minWidth:'200px'}}
                label="Category"
                onChange={handleSelect}
              >
                <MenuItem value={'None'}>None</MenuItem>
                <MenuItem value={'FreshersHub'}>Freshers Hub</MenuItem>
                <MenuItem value={'MSCComputing'}>MSC Computing</MenuItem>
                <MenuItem value={'CurricularActivities'}>Curricular Activities</MenuItem>
                <MenuItem value={'ModulesRelated'}>Modules Related</MenuItem>
                <MenuItem value={'Assignments'}>Assignments & Exams</MenuItem>
              </Select>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <TextField
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  style={{
                    margin: "10px 0",
                  }}
                  placeholder="Optional: include a image link that gives context"
                />
                {inputUrl !== "" && (
                  <img
                    style={{
                      height: "40vh",
                      objectFit: "contain",
                    }}
                    src={inputUrl}
                    alt="displayimage"
                  />
                )}
              </div>
            </div>
            <div className="modal__buttons">
              <button className="cancle" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button onClick={handleSubmit} type="submit"  disabled={!question} className="add">
                Add Question
              </button>
            </div>
          </Modal>
        </div>
        <div className="uHeader__icon" onClick={handleLogout} title={"Logout"}>
            <LogoutIcon/>
        </div>
      </div>
    </div>
  );
}