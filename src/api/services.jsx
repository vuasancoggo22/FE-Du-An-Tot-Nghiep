import { isAuthenticate } from "../utils/LocalStorage";
import instance from "./instance";
const user = isAuthenticate()
let header = {}
if(user){
header = {
  headers: {
    Authorization: `${user.token}`,
  },
}
}
const httpGetOneService = (id) => {
  return instance.get(`service/${id}`);
};

const getSerViceBySlug = (slug) => {
  return instance.get(`service-slug/${slug}`);
};

const groupAgeByService = () => {
  return instance.get(`age-by-service`,header);
};

const httpGetAllService = () => {
  return instance.get(`service`,header);
};

const groupGenderByService = () => {
  return instance.get(`gender-by-service`,header);
};

const turnoverServicesMonth = (year) => {
  return instance.get(`turnover-month-service?year=${year}`,header);
};

const servicesStatistic = (month, year) => {
  console.log(month, year);
  let url
  if(month == undefined && year == undefined) {
    url = `service-statistics`
  }
  else if(month != undefined && year != undefined) {
    url = `service-statistics?month=${month}&year=${year}`;
  }else if(month == undefined){
    url = `service-statistics?year=${year}`;
  }
  return instance.get(url,header);
}
const httpGet = (endpoint, id) => {
  return instance.get(`${endpoint}/${id}`,header);
};
const httpPost = (endpoint, data,header) => {
  console.log(data);
  return instance.post(`${endpoint}`,data,header);
};
const httpPut = (endpoint, id, data) => {
  return instance.patch(`${endpoint}/${id}`, data,header);
};

const httpDelete = (endpoint, id) => {
  return instance.delete(`${endpoint}/${id}`,header);
};

export {
  httpGetOneService,
  httpGet,
  httpPost,
  httpPut,
  httpDelete,
  httpGetAllService,
  getSerViceBySlug,
  servicesStatistic,
  turnoverServicesMonth,
  groupAgeByService,
  groupGenderByService
};
