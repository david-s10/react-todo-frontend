import axios, {AxiosInstance} from "axios";

export const IMAGE_BASE_URL = 'http://127.0.0.1:8000/'
// export const IMAGE_BASE_URL = 'http://192.168.0.104:8000/'

const instance: AxiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    // baseURL: 'http://192.168.0.104:8000/api',
    
    // headers: {
    //     Authorization: `Bearer ${window.localStorage.getItem('TOKEN')}`
    // }
    
})

instance.interceptors.request.use(config => {
    config.headers.Authorization = `Bearer ${window.localStorage.getItem('TOKEN')}`
    return config
})

export default instance