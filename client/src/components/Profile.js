import React, { useState } from 'react'
import avatar from '../assets/profile.png';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { profileValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';
import useFetch from '../hooks/fetch.hook';
import { updateUser } from '../helper/helper'
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/store'

import styles from '../styles/Username.module.css';
import extend from '../styles/Profile.module.css';
import { ColorRing  } from  'react-loader-spinner';

export default function Profile() {

  const [file, setFile] = useState();
  const [{ isLoading, apiData, serverError }] = useFetch();
  const navigate = useNavigate()
  const setUsername = useAuthStore(state => state.setUsername);
  const formik = useFormik({
    initialValues : {
      username: apiData?.username || '',
      email: apiData?.email || ''
    },
    enableReinitialize: true,
    validate : profileValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
      values = await Object.assign(values, { profile : file || apiData?.profile || ''})
      let updatePromise = updateUser(values);

      toast.promise(updatePromise, {
        loading: 'Updating...',
        success: () => {
          setTimeout(function(){
            navigate('/Dashboard');
        }, 1000);
          setUsername(values.username);
          localStorage.setItem("userName", values.username);
          return (`Profile Updated Successfully!`);
        },
        error: <b>Could not Update!</b>
      });

    }
  })

  /** formik doensn't support file upload so we need to create this handler */
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }

  // logout handler function
  function userLogout(){
    localStorage.removeItem('token');
    navigate('/')
  }

  if(isLoading) return <div><ColorRing
  visible={true}
  height="80"
  width="80"
  ariaLabel="blocks-loading"
  wrapperStyle={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
  wrapperClass="blocks-wrapper"
  colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
/></div>;
  if(serverError) return <h1 className='text-xl text-red-500'>{serverError.message}</h1>

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={`${styles.glass} ${extend.glass}`} style={{ width: "45%", paddingTop: '2em'}}>

          <div className="title flex flex-col items-center">
            <h4 className='text-4xl font-bold'>Profile</h4>
            <span className='py-3 text-xl w-2/3 text-center text-gray-500'>
                You can update the details.
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
              <div className='profile flex justify-center py-3'>
                  <label htmlFor="profile">
                    <img src={apiData?.profile || file || avatar} className={`${styles.profile_img} ${extend.profile_img}`} alt="avatar" />
                  </label>
                  
                  <input onChange={onUpload} type="file" id='profile' name='profile' />
              </div>

              <div className="textbox flex flex-col items-center gap-6">
                <div>
                  <input {...formik.getFieldProps('username')} style={{width:"100%"}} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='UserName*' />
                </div>
                <div>
                  <input {...formik.getFieldProps('email')} style={{width:"100%"}} className={`${styles.textbox} ${extend.textbox}`} type="text" placeholder='Email*' />
                </div>
                  <button className={styles.btn} type='submit'>Update</button>
              </div>

              <div className="text-center py-4">
                <span style={{paddingRight:'30px',color:'blue',cursor:'pointer'}} onClick={() => navigate('/Dashboard')}>Back</span>
                <span className='text-gray-500'>come back later? <button onClick={userLogout} className='text-red-500' to="/">Logout</button></span>
              </div>

          </form>

        </div>
      </div>
    </div>
  )
}

