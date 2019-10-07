import axios from 'axios';
import appConfig from '../constants/AppConfig';

const config = {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
};

const POST = (url, params) => {
  return axios.post(`${appConfig.DB_URL}apis/${url}`, params, config);
};
const PUT = (url, params) => {
  return axios.put(`${appConfig.DB_URL}apis/${url}`, params, config);
};
const GET = (url, params) => {
  return axios.get(`${appConfig.DB_URL}apis/${url}?${dictToURI(params)}`, config);
};

const dictToURI = (dict) => {
  var str = [];
  for(var p in dict){
     str.push(encodeURIComponent(p) + "=" + encodeURIComponent(dict[p]));
  }
  return str.join("&");
};

export default {
  POST,
  GET,
  PUT,
};