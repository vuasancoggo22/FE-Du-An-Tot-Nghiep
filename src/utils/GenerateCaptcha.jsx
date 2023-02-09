import {auth} from '../firebase/config'
import { RecaptchaVerifier  } from "firebase/auth";
export const generateCaptcha = () =>{
  
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha', {
      'size': 'invisible',
      'callback': (response) => {
        
      },

    }, auth);
  
}