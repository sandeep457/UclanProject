import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import avatar from '../assets/profile.png';
import  { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import { registerValidation } from '../helper/validate';
import convertToBase64 from '../helper/convert';


import styles from '../styles/Username.module.css';

export default function Register() {

  const navigate = useNavigate()
  const [file, setFile] = useState()

  const formik = useFormik({
    initialValues : {
      email: '',
      username: '',
      password : '',
      role: ''
    },
    validate : registerValidation,
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit : async values => {
      values = await Object.assign(values, { profile : file || ''});
      navigate('/Recovery', { state: {page: 'register', value: values}});
    }
  })

  /** formik doensn't support file upload so we need to create this handler */
  const onUpload = async e => {
    const base64 = await convertToBase64(e.target.files[0]);
    setFile(base64);
  }
  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen register'>
        <div className={styles.glass} style={{ width: "45%", paddingTop: '1em', height:'95%'}}>

          <div className="title flex flex-col items-center">
            <h4 className='text-3xl font-bold' style={{color:"cornflowerblue"}}>Register</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                Happy to join you!
            </span>
          </div>

          <form className='py-1' onSubmit={formik.handleSubmit}>
              <div className='profile flex justify-center py-1'>
                  <label htmlFor="profile">
                    <img src={file || avatar} className={styles.profile_img} alt="avatar"  />
                  </label>
                  
                  <input onChange={onUpload} type="file" id='profile' name='profile' />
              </div>

              <div className="textbox flex flex-col items-center gap-2">
                  <input {...formik.getFieldProps('email')} className={styles.textbox} type="text" placeholder='Enter Your UCLAN Email address' />
                  <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Enter Your Username' />
                  <input {...formik.getFieldProps('password')} className={styles.textbox} type="text" placeholder='Enter Your Password' />
                  <select
                      name="role"
                      {...formik.getFieldProps('role')} 
                      style={{ display: "block" }}
                      className={styles.textbox}
                    >
                      <option value="" label="Select a role">
                        Select User Role{" "}
                      </option>
                      <option value="student" label="student">
                        {" "}
                        Student
                      </option>
                      <option value="staff" label="staff">
                        staff
                      </option>
                    </select>
                  <button className={styles.btn} type='submit'>Register</button>
              </div>

              <div className="text-center py-4">
                <span className='text-gray-500'>Already Register? <Link className='text-red-500' to="/">Login Now</Link></span>
              </div>

          </form>

        </div>
      </div>
    </div>
  )
}

