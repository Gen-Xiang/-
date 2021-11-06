import service from '../components/request'

 export function LoginAPI(acc){
     return service.request({
         url: "/login/",
         method:"post",
         data: acc
     })
 }

 export function ForgetPSWAPI(acc){
    return service.request({
        url: "/ForgetPSW/",
        method:"post",
        data: acc
    })
}