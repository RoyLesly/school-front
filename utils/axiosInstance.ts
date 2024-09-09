import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';
import { ConfigData } from './config';
import { getSession } from './serverActions/sessionAction';
import { SessionInter } from './serverActions/interfaces';
import { RefreshTokenUrl } from './NoDomain/configDom';

var authTokens: any = getSession()
// var authTokens =  session ? JSON.parse(session) : null

const axiosInstance = axios.create({
    baseURL: ConfigData.BaseUrl,
    // headers: {
    //     Authorization: `Bearer ${authTokens?.access}`
    // }
})


axiosInstance.interceptors.request.use(async req => {
    var session: SessionInter = await getSession();
    console.log(session, 22);
    if (!session.access){
        // req.headers.Authorization = `Bearer ${session?.access}`
    }
    req.headers.Authorization = `Bearer ${session.access}`
    const user = jwtDecode(session.access);
    const isExpired = dayjs.unix(user.exp).diff(dayjs()) > 1;
    console.log(isExpired, 25)
    if (!isExpired) return req
    const response = await fetch(RefreshTokenUrl, {
        method: "post", 
        body: JSON.stringify({ refresh: session.refresh }) ,
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
    })
    console.log(response, 40)
    // req.headers.Authorization = `Bearer ${response.data.access}`
    
    return req
})


export default axiosInstance