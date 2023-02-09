import instance from "./instance";
import { isAuthenticate } from "../utils/LocalStorage";

const user = isAuthenticate();
let header = {};
if (user) {
  header = {
    headers: {
      Authorization: `${user.token}`,
    },
  };
}

export const httpGetOne = (id) => {
  return instance.get(`employees/${id}`, header);
};

export const httpGetEmployees = () => {
  return instance.get(`employees`);
};
export const httpAddEmployees = (data) => {
  return instance.post(`employees`, data, header);
};
export const httpUpdateEmployees = (id, data) => {
  return instance.patch(`employees/${id}`, data, header);
};

export const removeEmployees = (id) => {
  const url = `employees/${id}`;
  return instance.delete(url, header);
};

export const employeeOrderStatistics = (month, year) => {
  console.log(month, year);
  let url;
  if (month == undefined && year == undefined) {
    url = `employee/order-statistics`;
  } else if (month != undefined && year != undefined) {
    url = `employee/order-statistics?month=${month}&year=${year}`;
  } else if (month == undefined) {
    url = `employee/order-statistics?year=${year}`;
  }
  return instance.get(url, header);
};

export const employeeStatistics = (id, month, year) => {
  console.log(month, year);
 
  let url;
  if (month == undefined && year == undefined) {
    url = `statistics-for-employee/${id}`;
  } else if (month != undefined && year != undefined) {
    url = `statistics-for-employee/${id}?month=${month}&year=${year}`;
  } else if (month == undefined) {
    url = `statistics-for-employee/${id}?year=${year}`;
  }
  return instance.get(url, header);
};
