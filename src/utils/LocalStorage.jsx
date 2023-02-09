
export const isAuthenticate = () => {
    if(!localStorage.getItem('user')) return 
    return JSON.parse(localStorage.getItem('user'))
}

export const userHeader = () => {
    if(!localStorage.getItem('userHeader')) return 
    return JSON.parse(localStorage.getItem('userHeader'))
}