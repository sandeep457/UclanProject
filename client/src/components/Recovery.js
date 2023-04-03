import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { useAuthStore } from  '../store/store'
import styles from '../styles/Username.module.css';
import { generateOTP , generateSignupOTP, verifysignupOTP, verifyOTP} from '../helper/helper';
import { useLocation, useNavigate } from 'react-router-dom';
import { registerUser } from '../helper/helper';

export default function Recovery(props) {

  let { username } = useAuthStore(state => state.auth);
  const [OTP, setOTP] = useState();
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    if(typeof(username) === 'string' && username.length > 0){
    generateOTP(username).then((OTP) => {   
      console.log(OTP)
      if(OTP) return toast.success('OTP has been send to your email!');
      return toast.error('Problem while generating OTP!')
    })}else{
      generateSignupOTP(location.state.value).then((OTP) => {
        console.log(OTP)
        if(OTP) return toast.success('OTP has been send to your email!');
        return toast.error('Problem while generating OTP!')
    });
  }}, [username]);

  async function onSubmit(e){
    e.preventDefault();
    try {
      if(typeof(username) === 'string' && username.length > 0){
        let { status } = await verifyOTP({ username, code : OTP })
        if(status === 201){
          toast.success('Verify Successfully!')
          return navigate('/reset')
        } 
      }else{
        let { status } = await verifysignupOTP({ username, code : OTP })
        if(status === 201){
          if(location.state.page){
          let registerPromise = registerUser(location.state.value);
          toast.promise(registerPromise, {
          loading: 'Creating...',
          success: () => {
            navigate('/');
            return (`${username} Registered Successfully!`);
          },
          error: (err) => `This just happened: ${err.error.response.data.error.error}`
        });
       }
      }  
      }
      
    } catch (error) {
      return toast.error('Wront OTP! Check email again!')
    }
  }

  // handler of resend OTP
  function resendOTP(event){
    event.stopPropagation();
    let sentPromise = null;
    if(typeof(username) === 'string' && username.length > 0){
     sentPromise = generateOTP(username);
    }else{
     sentPromise = generateSignupOTP(location.state.value);
    }

    toast.promise(sentPromise ,
      {
        loading: 'Sending...',
        success: <b>OTP has been send to your email!</b>,
        error: (err) => `This just happened: ${err.error.response.data.error.error}`,
      }
    );

    sentPromise.then((OTP) => {
      console.log(OTP)
    });
    
  }

  return (
    <div className="container mx-auto">

      <Toaster position='top-center' reverseOrder={false}></Toaster>

      <div className='flex justify-center items-center h-screen'>
        <div className={styles.glass}>

          <div className="title flex flex-col items-center">
            <h4 className='text-5xl font-bold'>OTP Verification</h4>
            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>
                Enter OTP to verify.
            </span>
          </div>

          <form className='pt-20' onSubmit={onSubmit}>

              <div className="textbox flex flex-col items-center gap-6">

                  <div className="input text-center">
                    <span className='py-4 text-sm text-left text-gray-500'>
                      Enter 6 digit OTP sent to your email address.
                    </span>
                    <input onChange={(e) => setOTP(e.target.value) } className={styles.textbox} type="text" placeholder='OTP' />
                  </div>

                  <button className={styles.btn} type='submit'>Submit</button>
              </div>
          </form>

          <div className="text-center py-4">
            <span className='text-gray-500'>Can't get OTP? <button onClick={resendOTP} className='text-red-500'>Resend</button>
            <button onClick={() =>navigate('/register')} style={{marginLeft:'20px'}}className='text-blue-500'>Go Back</button></span>
          </div>

        </div>
      </div>
    </div>
  )
}
