export default function getUrl(str) {
    let run_mode = process.env.OPS_RUN_MODE;
    let url = '';
    if (run_mode==='DEPLOY'){
        url = 'your domain' + str;
    }else {
        url = 'http://127.0.0.1:8000/' + str;
    }
    return url;
}