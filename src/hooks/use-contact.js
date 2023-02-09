import useSWR from "swr";
import instance from "../api/instance";
import * as method from "../api/contact"

const fetcher = async(url) => await instance.get(url);

const endpoint = "/contact";

const useContact = () => {
    const {data, error, mutate} = useSWR(endpoint, fetcher, {
        refreshInterval: 2500,
    });

    const create = async (data) => {
        const revalidate = await method.httpAddContact(endpoint, data)
        mutate([...data, revalidate]);
    }
    return {data, error, mutate, create}
}

export default useContact