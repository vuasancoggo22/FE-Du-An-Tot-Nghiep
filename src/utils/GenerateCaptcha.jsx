import {auth} from '../firebase/config'
import { RecaptchaVerifier  } from "firebase/auth";
export const generateCaptcha = () =>{
  if(window.recaptchaVerifier){
    window.recaptchaVerifier.recaptcha.reset(
      window.recaptchaWidgetId
    );
  }
  else{
    window.recaptchaVerifier = new RecaptchaVerifier('recaptcha', {
      'size': 'invisible',
      'callback': (response) => {
        
      },

    }, auth);
  }
}