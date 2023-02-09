import useSWR from "swr";
import instance from "../api/instance";
import * as method from "../api/services";
import { isAuthenticate } from "../utils/LocalStorage";
const user = isAuthenticate()
let userId = ""

if(!user){
  userId = ""
  // Guess userId when user is not sign in
}
else{
  userId = user.id
}
const fetcher = async (url) => await instance.get(url);

const endpoint = "/booking";

const useBooking = () => {
  const { data, error, mutate } = useSWR(endpoint, fetcher, {
    refreshInterval: 2500,
  });
  const create = async (data,token) => {
    const header = {
      headers: {
        "Authorization": `${token}`,
      },
    };
    const revalidate = await method.httpPost(endpoint+`?user=${userId}`,data,header);
    mutate(revalidate);
  };
  const remove = async (id) => {
    await method.httpDelete(endpoint, id);
    const revalidate = data.filter((item) => item.id !== id);
    mutate(revalidate);
  };
  const update = async (id, update) => {
    const newData = await method.httpPut(endpoint, id, update);
    const revalidate = data.map((item) => (item.id == id ? newData : item));
    mutate(revalidate);
  };
  return {
    data,
    error,
    create,
    remove,
    update,

  };
};
export default useBooking;
