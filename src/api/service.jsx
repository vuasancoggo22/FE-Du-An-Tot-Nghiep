import instance from "./instance";
import { isAuthenticate } from "../utils/LocalStorage";

const user = isAuthenticate()
let header = {}
if(user){
header = {
  headers: {
    Authorization: `${user.token}`,
  },
}
}
export const updateService = (id, data) => {
  const url = `service/${id}`;
  return instance.patch(url, data,header);
};
export const createService = (data) => {
  const url = `service`;

  return instance.post(url, data,header);
};
export const removeService = (id, data) => {
  const url = `service/${id}`;
  return instance.delete(url, data,header);
};
