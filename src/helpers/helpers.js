import dispatcher from "../dispatcher";
import axios from "axios"
import toolsUtils from "../utils/toolsUtils"

export function checkStatus(response) {
  if (axios.isCancel(response)) {
    console.error('Request canceled', "checkStatus");
  } else {
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      throw response.json();
    }
  }
}

export function checkStatusGeoData(response) {
  if (axios.isCancel(response)) {
    console.error('Request canceled', "checkStatusGeoData");
  } else {
    if (response.status >= 200 && response.status < 300) {
      return response
    } else if (response === 404) {
      return [];
    } else {
      throw response.json();
    }
  }
}

export function checkStatusLogin(response) {
  if (axios.isCancel(response)) {
    console.error('Request canceled', "checkStatusLogin");
  } else {
    if (response.status >= 200 && response.status < 300) {
      return response
    } else {
      throw response;
    }
  }
}

export function errorHandler(error) {
  if (axios.isCancel(error)) {
    console.error('Request canceled', "errorHandler");
    return error
  } else {
    if (error.response === undefined) {
      dispatcher.dispatch({
        type: "CREATE_NOTIFICATION",
        notification: {
          type: "error",
          message: error.message,
        },
      });
    } else {
      dispatcher.dispatch({
        type: "CREATE_NOTIFICATION",
        notification: {
          type: "error",
          message: error.response.data.status + " (message: " + error.response.data.description + ")",
        },
      });
    }
  }
}

export function errorHandlerLogin(error) {
  if (axios.isCancel(error)) {
    console.error('Request canceled', "errorHandlerLogin");
  } else {
    if (error.response === undefined) {
      dispatcher.dispatch({
        type: "CREATE_NOTIFICATION",
        notification: {
          type: "error",
          message: error.message,
        },
      });
    } else {
      dispatcher.dispatch({
        type: "CREATE_NOTIFICATION",
        notification: {
          type: "error",
          message: error.response.data.status + " (message: " + error.response.data.description + ")",
        },
      });
    }
  }
}

export function errorHandlerIgnoreNotFound(error) {
  if (axios.isCancel(error)) {
    console.error('Request canceled', "errorHandlerIgnoreNotFound");
  } else {
    if (error.response === undefined) {
      dispatcher.dispatch({
        type: "CREATE_NOTIFICATION",
        notification: {
          type: "error",
          message: error.message,
        },
      });
    } else if (error.response.data.status !== 404) {
      dispatcher.dispatch({
        type: "CREATE_NOTIFICATION",
        notification: {
          type: "error",
          message: error.response.data.status + " (message: " + error.response.data.description + ")",
        },
      });
    }
  }
}

export function errorHandlerIgnoreNotFoundWithCallback(callbackFunc) {
  return function (error) {
    if (axios.isCancel(error)) {
      console.error('Request canceled', error.message);
    } else {
      if (!toolsUtils.isNullOrEmpty(error, "response.data.status") && error.response.data.status === 404) {
        callbackFunc("404");
      } else {
        errorHandlerIgnoreNotFound(error);
      }
    }
  }
}

export function errorHandlerIgnoreNotFoundWithCallbackv2(callbackFunc) {
  return function (error) {
    if (axios.isCancel(error)) {
      console.error('Request canceled', error.message);
    } else {
      if (!toolsUtils.isNullOrEmpty(error, "response.status") && error.response.status === 404) {
        callbackFunc("404");
      } else {
        errorHandlerIgnoreNotFound(error);
      }
    }
  }
}

export function errorHandlerIgnoreNotFoundAndUnauthorizedWithCallback(callbackFunc) {
  return function (error) {
    if (axios.isCancel(error)) {
      console.error('Request canceled', error.message);
    } else {
      if (!toolsUtils.isNullOrEmpty(error, "response.data.status") && (error.response.data.status === 404)) {
        callbackFunc("404");
      } else if (!toolsUtils.isNullOrEmpty(error, "response.data.status") && error.response.data.status === 401) {
        callbackFunc("401");
      } else {
        errorHandlerIgnoreNotFound(error);
      }
    }
  }
}

export function errorHandlerIgnoreUnauthorizedWithCallback(callbackFunc) {
  return function (error) {
    if (axios.isCancel(error)) {
      console.error('Request canceled', error.message);
    } else {
      if (!toolsUtils.isNullOrEmpty(error, "response.data.status") && error.response.data.status === 401) {
        callbackFunc("401");
      } else {
        errorHandlerIgnoreNotFound(error);
      }
    }
  }
}

export function errorHandlerInvite(callbackFunc) {
  return function (error) {
    if (axios.isCancel(error)) {
      console.error('Request canceled', error.message);
    } else {
      callbackFunc(error.response.data);
    }
  }
}

export function errorHandlerIgnoreErrorWithCallback(callbackFunc) {
  return function (error) {
    if (axios.isCancel(error)) {
      console.error('Request canceled', error.message);
    } else {
      if (error.response.data.status === 400) {
        callbackFunc(error);
      } else {
        errorHandlerIgnoreNotFound(error);
      }
    }
  }
}

export function errorHandlerIgnoreErrorsWithCallback(callbackFunc) {
  return function (error) {
    if (axios.isCancel(error)) {
      console.error('Request canceled', error.message);
    } else {
      if (
        error.response !== undefined &&
        error.response.data !== undefined &&
        (error.response.data.status === 400 || error.response.data.status === 404 || error.response.data.status === 504)
      ) {
        callbackFunc(error.response.data || null);
      } else {
        errorHandlerIgnoreNotFound(error);
      }
    }
  }
}
