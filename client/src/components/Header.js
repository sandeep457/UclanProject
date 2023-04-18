import React, { useState, useEffect } from "react";
import "../styles/Header.css";
import { useNavigate } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TablePagination from '@mui/material/TablePagination';
import Paper from '@mui/material/Paper';
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
import TableFooter from '@mui/material/TableFooter';

export default function Header(props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usersData, setUsersData] = useState([]);
  const [isPeopleModalOpen, setIsPeopleModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [category, setCategory] = React.useState('None');
  const  username  =  localStorage.getItem("userName");
  const [{ apiData }] = useFetch(`/user/${username}`);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - usersData.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const Close = <CloseIcon />;
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get("/api/getAllUsers")
      .then((res) => {
        setUsersData(res.data.users);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  function TablePaginationActions(props) {
    const theme = useTheme();
    const { count, page, rowsPerPage, onPageChange } = props;
  
    const handleFirstPageButtonClick = (event) => {
      onPageChange(event, 0);
    };
  
    const handleBackButtonClick = (event) => {
      onPageChange(event, page - 1);
    };
  
    const handleNextButtonClick = (event) => {
      onPageChange(event, page + 1);
    };
  
    const handleLastPageButtonClick = (event) => {
      onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };
  
    return (
      <Box sx={{ flexShrink: 0, ml: 2.5 }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="first page"
        >
          {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label="previous page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="next page"
        >
          {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="last page"
        >
          {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </Box>
    );
  }
  TablePaginationActions.propTypes = {
    count: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
  };
  
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
          <div className="uHeader__icon" title={"Users"} onClick={() => setIsPeopleModalOpen(true)}>
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
          <Modal
            open={isPeopleModalOpen}
            closeIcon={Close}
            onClose={() => setIsPeopleModalOpen(false)}
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
              <h5>Users List</h5>
            </div>
            <div className="modal__Field">
            <TableContainer component={Paper} sx={{ maxHeight: 350 }}>
      <Table sx={{ minWidth: 700 }} stickyHeader  aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>User Name</StyledTableCell>
            <StyledTableCell align="right">Role</StyledTableCell>
            <StyledTableCell align="right">Email</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {usersData.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right">{row.role}</StyledTableCell>
              <StyledTableCell align="right">{row.email}</StyledTableCell>
            </StyledTableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
              colSpan={3}
              count={usersData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  'aria-label': 'rows per page',
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
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