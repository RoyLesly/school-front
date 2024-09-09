import { revalidatePath } from 'next/cache';
import Axios, { AxiosResponse } from "axios";
import axios from "axios";
import { getSession } from "./serverActions/sessionAction";
import { DataProps } from './serverActions/interfaces';


interface FetchProps {
    url: string,
    searchParams?: any,
    page?: any,
    revalTime?: number,
    revalPath?: string,
    revalTag?: string,
}


export const fetchData = async ({url, searchParams = {}, page, revalTime = 0, revalPath = "", revalTag = ""} : FetchProps) => {

    const session = await getSession()

    if (session.access && session.access.length > 10) {
        var config = { headers: { Authorization: `Bearer ${session.access}`}}

        if (Object.keys(searchParams).length > 0){
            var Searchkeys = Object.keys(searchParams)
            if (Searchkeys) { 
                var newUrl = `${url}?`
    
                try {
                    const response = await fetch(
                        newUrl + new URLSearchParams(searchParams),
                        {...config }
                    )
                    .then((response) => response.json())
                    if (response && response){
                        return response; 
                    }
                    return { error: "error" }
                } catch (error: any) {
                    if (error.response?.data?.code == "token_not_valid"){ return { unauthorized: error.response.data.code } }
                    if (error && Object.keys(error).length > 0)
                        if (error.response?.data.detail){ return { error: error.response.data.detail } }
                        return error.cause?.code
                    return error;
                }
            }
        }
        if (Object.keys(searchParams).length == 0 && !page) {
            try {
                const response = await fetch(
                    url + new URLSearchParams(searchParams),
                    config
                )
                .then((response) => response.json())

                if (response && response){
                    return response; 
                }
                return { error: "error" }
            } catch (error: any) {
                if (error.response?.data?.code == "token_not_valid"){ return { unauthorized: error.response.data.code } }
                if (error && Object.keys(error).length > 0)
                    if (error.response?.data.detail){ return {error: error.response.data.detail} }
                    return error.cause?.code
                return error;
            }
        }
    }

}


export const getData = async (url: string, searchParams: any, page?: string | null) => {

    const session = await getSession();

    if (session.access && session.access.length > 10) {
        var config = { headers: { Authorization: `Bearer ${session.access}`}}

        if (Object.keys(searchParams).length > 0){

            var Searchkeys = Object.keys(searchParams)
            if (Searchkeys) { 
                var newUrl = `${url}?`
                Searchkeys.forEach(key => {
                    newUrl = `${newUrl}${key}=${searchParams[key]}&`
                });
    
                try {
                    const response = await axios.get(
                        newUrl,
                        config
                    )
                    if (response?.data){
                        return response.data; 
                    }
                    return { error: "error" }
                } catch (error: any) {
                    var errObj = Object.keys(error)
                    console.log(101, "error", errObj)
                    if (errObj && errObj.length > 0){
                        console.log(103)
                        console.log(103)
                        console.log(error.code)
                        if (errObj?.includes("code") && error.code == "ERR_BAD_RESPONSE"){ console.log("error.code", 104, error.code); return { error: "ERR_BAD_RESPONSE" }}
                        if (errObj?.includes("code") && error.code == "ECONNRESET"){ console.log("error.code", 104, error.code); return { error: "ECONNRESET" }}
                        if (errObj?.includes("name") && error.name =="Error"){ console.log("error.name", 105, error.name, ); return { error: "Error" }}
                        if (errObj?.includes("message") && error.message.includes("Client network")){ console.log("error.message", 106, error.message, ); return { error: error.message }}
                        if (errObj?.includes("cause") && error.cause.code){ console.log("error.cause", 107, error.cause.code); return { error: "ECONNRESET" }}
                        if (errObj?.includes("response") && error.response.data){ 
                            console.log("error.cause", 109, error.cause.code); 
                            if (error.response?.data?.code == "token_not_valid"){ return { unauthorized: error.response.data.code } }
                            return { error: error.response.data }
                        }
                    }

                    if (error.response?.data?.code == "token_not_valid"){ return { unauthorized: error.response.data.code } }
                    if (error && Object.keys(error).length > 0)
                        if (error.response?.data.detail){ return { error: error.response.data.detail } }
                        return { error: error }
                    return error;
                }
            }
        }
        if (Object.keys(searchParams).length == 0 && !page) {
            try {
                const response = await axios.get(
                    url,
                    config
                )
                // console.log(response, 119)
                return response.data; 
            } catch (error: any) {
                if (error.response?.data?.code == "token_not_valid"){ return { unauthorized: error.response.data.code } }
                if (error && Object.keys(error).length > 0)
                    if (error.response?.data.detail){ return {error: error.response.data.detail} }
                    return error.cause?.code
                return error;
            }
        }
    }
}


export const getWeekOfYear: any = (date: any) => {
    date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    // Set to Nearest Thursday bc -> ISO standard the first thursday of the year as the first week
    // Make sunday's day number 7
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay()||7));
    // Get first day of year
    var yearStart: any = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    // Calculate full weeks to nearest Thursday
    var weekNo = Math.ceil(( ( (date - yearStart) / 86400000) + 1) / 7);
    // Return and week number
    return weekNo
    // Return array of year and week number
    // return [date.getUTCFullYear(), weekNo]
}

export const addDaysToDate = (d: Date, days: number) => {
    return new Date(d.getTime() + days*24*60*60*1000);
}

export const subtractDaysToDate = (d: Date, days: number) => {
    return new Date(d.getTime() + days*24*60*60*1000);
}


export const getDateOfWeek = (weekNo: number, year: number) => {
    var d = (1 + (weekNo - 1) * 7);
    return new Date(year, 0, d);
}

export const getStartEndOfWeek = (weekNo: any, year: any) => {
    var a = (1 + (weekNo - 1) * 7);
    var start = new Date(year, 0, a + 1)
    var end = new Date(start.getTime() + 6*24*60*60*1000)
    return [start.toUTCString().slice(0, 16), end.toUTCString().slice(0, 16)];
}

export const getWeekRange = (weekNo: number, year: number) => {
    var a = (1 + (weekNo - 1) * 7);
    var mon = new Date(year, 0, a)
    var tue = new Date(mon.getTime() + 1*24*60*60*1000)
    var wed = new Date(tue.getTime() + 1*24*60*60*1000)
    var thu = new Date(wed.getTime() + 1*24*60*60*1000)
    var fri = new Date(thu.getTime() + 1*24*60*60*1000)
    var sat = new Date(fri.getTime() + 1*24*60*60*1000)
    var sun = new Date(sat.getTime() + 1*24*60*60*1000)

    // return [mon, tue, wed, thu, fri, sat, sun];
    return [
        mon.toISOString().slice(0, 10), 
        tue.toISOString().slice(0, 10), 
        wed.toISOString().slice(0, 10),
        thu.toISOString().slice(0, 10),
        fri.toISOString().slice(0, 10),
        sat.toISOString().slice(0, 10),
        sun.toISOString().slice(0, 10),
    ];
}


export const getMondays = (month: number, year: number) => {
    var da = year + "-" + month.toString().padStart(2, "0") +  "-01"
    var today = new Date(da)
    var month = today.getMonth();
    var mondays = []
    today.setDate(1);

    while (today.getDay() !== 1) {
        today.setDate(today.getDate() + 1);
    }

    while (today.getMonth() === month){
        const date = new Date(today)
        const formatted = date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + (date.getDay() ? date.getDate() : 7).toString().padStart(2, "0")
        mondays.push(formatted);
        today.setDate(today.getDate() + 7);
    }

    return mondays
}

export const generateGrade = async (mark: any) => {
    if (mark){
        if (mark > 79.99) { return "A" }  
        if (mark > 69.99) { return "B+" } 
        if (mark > 59.99) { return "B" }     
        if (mark > 54.99) { return "C+" }
        if (mark > 49.99) { return "C" }
        if (mark > 44.99) { return "D+" }
        if (mark > 39.99) { return "D" }
        return "F"
    }
}

export const addCAandExam = async (ca: number, exam: number) => {
    if (ca && exam && ca > -1 && exam > -1) return ca + exam;
    if (ca && !exam && ca > -1) return ca;
    if (!ca && exam && exam > -1) return exam;
}

// Function to Extract Number
export const getNumFromStr = (data: string, afterStr: string) => {
    const strAfterSubstr = data.split(afterStr)[1]

    let matches: any = false
    if (strAfterSubstr) { 
        matches = strAfterSubstr.match(/(\d+)/)
    }
    
    if (matches) { return parseInt(matches[0]) }
    else { return 1 }
}


// Function to Get Days Of week Given Day
export const getDatesOfWeekGivenDate = (date: string) => {
    const weekDate = new Date(date);

    function getDate(d: number){
        const t = new Date(date).setDate(weekDate.getDate() - weekDate.getDay() + d)
        return t
    }

    var monday = getDate(1)
    var tuesday = getDate(2)
    var wednesday = getDate(3)
    var thursday = getDate(4)
    var friday = getDate(5)
    var saturday = getDate(6)
    var sunday = getDate(7)
    const format = (d: any) => {
        let date = new Date(d)
        return( date.getFullYear().toString() + "-" + (date.getMonth() + 1).toString().padStart(2, "0") + "-" + date.getDate().toString().padStart(2, "0"))
    };
    const dates: any[] = [ monday, tuesday, wednesday, thursday, friday, saturday, sunday ];
    console.log(dates.map((date: any) => format(date)))
    
    return dates.map((date: any) => format(date))
}



// Function to Calculate Pagination
export const calculatePagination = (total: number, pageCount: number, currentPage: number) => {
    let firstNumber = 1
    let lastNumber = total
    if (currentPage != 1) { 
        firstNumber = currentPage * pageCount - pageCount
    }
    if (pageCount < total) { 
        lastNumber = currentPage * pageCount 
    }
    if (lastNumber > total) { 
        lastNumber = total
    }
    return `${firstNumber} - ${lastNumber} of ${total}`
}

13

export const getDistanceBetweenTwoPoints = (latA:number, lonA:number, latB:number, lonB:number) => {
    let p = 0.017453292519943295;    // Math.PI / 180
    let cosi = Math.cos;
    let a = 0.5 - cosi((latA-latB) * p) / 2 + cosi(latB * p) *cosi((latA) * p) * (1 - cosi(((lonA- lonB) * p))) / 2;
    let dis = (12742 * Math.asin(Math.sqrt(a))); // 2 * R; R = 6371 km
    return Math.round(dis * 1000);
}


interface AxiosRequestProps {
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'update' | 'check'
    url: string
    payload?: DataProps | FormData
    hasAuth?: boolean
    showError?: boolean
    errorObject?: {
        message: string,
        description?: string
    }
    file?: boolean
    params?: any
    token?: any
}

export const axiosRequest = async <T>({
    method = 'get',
    url,
    payload,
    hasAuth = false,
    showError = true,
    file = false,
    params = {},
    errorObject,
    token
}: AxiosRequestProps): Promise<AxiosResponse<T> | null | any> => {
    let headers = hasAuth ? {} : {}
    if (file) {
        headers = { ...headers, 'content-type': 'multipart/form-data' }
    } 
    else {
        // headers = { ...headers, 'content-type': 'application/json', 'media_type': 'application/json' }
    } 
    if (token && Object.keys(token).length > 0){
        headers = { ... headers, ...token }
    }


    if (params == "remove_payload") {
        payload = payload
        params = {}
    }
    else {
        payload = {payload: payload}
    }

    if (Object.keys(token).length > 0){
        const response = await Axios({
            method,
            url,
            params: params,
            data: payload, 
            headers: {...token.headers}
        }).catch(
            (e: any) => {
                if (!showError) return
                return e.response
            }
        ) as AxiosResponse<T>
        if (response) { return response }
    } else {
        const response = await Axios({
            method,
            url,
            params: params,
            data: payload, 
        }).catch(
            (e: any) => {
                // console.log(e, 362)
                if (!showError) return
                return e.response
            }
        ) as AxiosResponse<T>
        if (response) { return response }
    }

    return null
}
