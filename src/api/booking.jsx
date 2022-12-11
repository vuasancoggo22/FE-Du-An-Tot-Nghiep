import instance from "./instance";

const httpGetAll = () => {
  return instance.get(`booking`);
};

const bookingGenderStatistics = () => {
  const url = `booking-gender-statistics`
  return instance.get(url);
};
const httpAddBooking = (token, data,userId) => {
  const header = {
    headers: {
      Authorization: `${token}`,
    },
  };
  return instance.post(`booking?user=${userId}`, data, header);
};
const bookingAddByEmployeeApi = (data) => {
  return instance.post(`bookingAddByEmployee`, data); 
};
const httpGetOne = (id) => {
  return instance.get(`booking/${id}`);
};
const httpGetChangeStatus = (id, data) => {
  return instance.patch(`booking/${id}`, data);
};

export const userHistory = (id) => {
  const url = `booking-history/${id}`
  return instance.get(url)
}
// const httpPut = (endpoint, id, data) => {
//   return instance.put(`${endpoint}/${id}`, data);
// };

// const httpDelete = (endpoint, id) => {
//   return instance.delete(`${endpoint}/${id}`);
// };

export {
  httpGetAll, httpAddBooking, httpGetOne, httpGetChangeStatus, bookingGenderStatistics, bookingAddByEmployeeApi
  //  httpPut, httpDelete 
};
