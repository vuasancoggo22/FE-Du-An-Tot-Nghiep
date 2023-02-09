import useSWR from "swr";
import instance from "../api/instance";
import * as method from "../api/services";

const fetcher = async (url) => await instance.get(url);

const endpoint = "/service";

const useService = () => {
  const {
    data,
    error,
    mutate
  } = useSWR(endpoint, fetcher,{
    refreshInterval: 2500,
  })
  const create = async (data) => {
    const revalidate = await method.httpPost(endpoint, data);
    mutate(revalidate);
  };
  const remove = async (id) => {
    await method.httpDelete(endpoint, id);
    const revalidate = data.filter((item) => item.id !== id);
    mutate(revalidate);
  };
  const update = async (id, data) => {
    const newData = await method.httpPut(endpoint, id, data);
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
export default useService;