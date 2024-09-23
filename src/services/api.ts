import axios from "axios"

export const api = axios.create({
    baseURL:"https://reqres.in/api/",
});

api.interceptors.response.use(
    function(config){
        if (config.data.errors){
            return Promise.reject(config.data.errors);
        }
        return config;
    },
    
    function(error){
        if(error?.message?.code == "401"){
            // to-do login (since 401 error code is an unathorized request)
        }

        return Promise.reject(error);
    }
)

// api.interceptors.request.use
// (function(config){}, 

// function(error{
//     return Promise.reject(error)
// }))