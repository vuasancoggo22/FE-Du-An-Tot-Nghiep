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
export const httpAddBanner = (data) => {
  return instance.post(`/banners`, data, header);
};

export const httpListBanner = () => {
  return instance.get(`/banners`);
};

export const httpDeleteBanner = (id) => {
  return instance.delete(`/banners/${id}`, header);
};

export const httpGetOne = (id) => {
  return instance.get(`banners/${id}`);
};

export const httpUpdateBanner = (id, data) => {
  return instance.patch(`banners/${id}`, data, header);
};
