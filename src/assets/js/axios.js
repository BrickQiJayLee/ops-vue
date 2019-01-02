import axios from 'axios'
import getUrl from '../../config/api_url'
import qs from 'qs'
import router from '../../router'

export default {
    AxiosGet(config) {
        axios.get(
            getUrl(config.url),
            {
                headers: {
                    sessionid: sessionStorage.getItem('session_id')
                },
                params: config.params
            }).then ((res) => {
                stateDetection(res);
                config.callback && config.callback(res);
        });
        //}else{
        //    router.push({name: 'Login'});
        //}
    },
    AxiosPost(config) {
        //if (sessionStorage.hasOwnProperty('session_id')){
        //console.log(config);
        axios.post(
            getUrl(config.url),
            qs.stringify(config.params),
            {
                headers: {
                    sessionid: sessionStorage.getItem('session_id')
                }
            }).then((res) => {
                //console.log(res.data);
                if (res.data.result==='needLogin'){
                    router.push({name: 'Login'});
                }else{
                    stateDetection(res);
                    config.callback && config.callback(res);
                }
        })
        //}else{
        //    router.push({name: 'Login'});
        //}
    }

}
//状态检测
let stateDetection = (data, callback) => {
    let status = data.status_code;
    switch (status) {
        case 102:
            break;
        case 103:
            alert(data.content);
            break;
        case 404:
            window.location.href = data.url;
            break;
    }
};