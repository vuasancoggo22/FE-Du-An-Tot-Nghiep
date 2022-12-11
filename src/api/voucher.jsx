import instance from "./instance";

export const ListVouchers = () => {
  return instance.get(`/vouchers`);
};

export const OneVoucher = (id) => {
  return instance.get(`voucher/${id}`);
};

export const DeleteVoucher = (id) => {
  return instance.delete(`/voucher/delete/${id}`);
};

export const AddVouche = (data) => {
  return instance.post(`/voucher/add`, data);
};

export const updateVouche = (id, data) => {
  const url = `/voucher/update/${id}`;
  return instance.put(url, data);
};
