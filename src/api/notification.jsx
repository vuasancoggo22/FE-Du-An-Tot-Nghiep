import instance from './instance'

export const readedNotification = (id,token) => {
    const header = {
        headers : {
            Authorization : `${token}`
        }
       
    }
    return instance.put(`/read-notification/${id}`,null,header)
}