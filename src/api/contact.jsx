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

export const httpAddContact = (data) => {
    return instance.post(`contact`, data);
}

export const httpListContact = () => {
    return instance.get(`contact`,header);
}

export const httpDeleteContact = (id) => {
    return instance.delete(`contact/${id}`,header);
}
