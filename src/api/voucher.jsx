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
export const ListVouchers = () => {
  return instance.get(`/vouchers`,header);
};

export const OneVoucher = (id) => {
  return instance.get(`voucher/${id}`,header);
};

export const DeleteVoucher = (id) => {
  return instance.delete(`/voucher/delete/${id}`,header);
};

export const AddVouche = (data) => {
  return instance.post(`/voucher/add`, data,header);
};

export const useVoucher = (id, data) => {
  return instance.post(`/use-voucher/${id}`, data);
};


export const updateVouche = (id, data) => {
  const url = `/voucher/update/${id}`;
  return instance.put(url, data,header);
};
