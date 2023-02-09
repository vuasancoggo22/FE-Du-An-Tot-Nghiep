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
export const updatePost = (id, data) => {
  const url = `blog/${id}`;
  return instance.put(url, data,header);
};
export const createPost = (data) => {
  const url = `blog/add`;

  return instance.post(url, data,header);
};
export const removePost = (id) => {
  const url = `blog/${id}`;
  return instance.delete(url,header);
};
export const getOnePost = (id) => {
  const url = `blogs/${id}`;
  return instance.get(url);
};
export const getPosts = () => {
  return instance.get("blogs");
};
