import instance from "./instance";
import {isAuthenticate} from '../utils/LocalStorage'
const user = isAuthenticate()
let header = {}
if(user){
header = {
  headers: {
    Authorization: `${user.token}`,
  },
}
}
export const login = (values) => {
  const url = `signin`;
  return instance.post(url, values);
};
export const register = (values) => {
  const url = `signup`;
  return instance.post(url, values);
};

export const httpGetAllUser = () => {
  return instance.get(`users`,header);
};
export const httpGetTopUser = () => {
  return instance.get(`users/loyal-customer`);
};
export const getProfile = (token) => {
  const url = `/user/my-profile`;
  const header2 = {
    headers: {
      Authorization: `${token}`,
    },
  };
  return instance.get(url,header2);
};
export const updateProfile = (token, data) => {
  const url = `/user/my-profile/edit`;
  const header2 = {
    headers: {
      Authorization: `${token}`,
    },
  };
  return instance.put(url, data,header2);
};
export const changeAccountStatus = (phoneNumber, status, token) => {
  const url = `change-account-status?phone=${phoneNumber}&status=${status}`;
  const header = {
    headers: {
      Authorization: `${token}`,
    },
  };
  return instance.put(url, null, header);
};
export const httpGetOneUser = (token, id) => {
  const header = {
    headers: {
      Authorization: `${token}`,
    },
  };
  return instance.get(`user/${id}`, header);
};
export const httpUpdateOneUser = (token, id, data) => {
  const header = {
    headers: {
      Authorization: `${token}`,
    },
  };
  return instance.put(`user/edit/${id}`, data, header);
};

export const userAccountStatistics = () => {
  const url = `/users/acccount-status-statistics`;
  return instance.get(url);
};
export const updatePass = (token, data) => {
  const url = `/update-password`;
  const header = {
    headers: {
      Authorization: `${token}`,
    },
  };
  return instance.put(url, data, header);
};

export const checkValidPhoneNumber = (phoneNumber) =>{
  const url = `/check-valid-phone-number`
  return instance.post(url,phoneNumber)
}

export const resetPassword = (data,token) => {
  const url = `reset-password`
  const header = {
    headers: {
      Authorization: `${token}`,
    },
  };
  return instance.put(url,data,header)
}