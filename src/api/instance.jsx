
import axios from "axios";

const instance = axios.create({
  baseURL: "https://be-du-an-tot-nghiep-delta.vercel.app/api",
});
instance.interceptors.response.use(
  function (response) {
    return response.data;
  },
  function (error) {
   
    if(error.response.status == 401 ){
      console.log(error);
    }
    return Promise.reject(error);
  }
);
export default instance;
