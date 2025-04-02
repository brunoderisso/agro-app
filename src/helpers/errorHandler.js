import axios from "axios"


export default function errorHandlerWithCallback(callbackFunc) {
  return function (error) {
    if (axios.isCancel(error)) {
      console.error('Request canceled', error.message);
    } else if (error.response?.data) {
      callbackFunc(error.response.data);
    }
  }
}