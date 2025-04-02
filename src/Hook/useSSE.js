import { useEffect, useState } from "react";
import { EventSourcePolyfill } from "event-source-polyfill";

import sessionStore from "../stores/SessionStore";
import { LocalConfig } from "../LocalConfig";

const useSSE = (component, eventName) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let sse;

    try {
      const environmentId = sessionStore.getEnvironment();
      if (!environmentId) {
        throw new Error("EnvironmentID não definido.");
      }

      const token = sessionStore.getToken();
      if (!token) {
        throw new Error("Token não definido.");
      }

      const url = `${LocalConfig.sseURL}/${component}?environment=${environmentId}&refresh=30`;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      sse = new EventSourcePolyfill(url, { headers });

      const handleEvent = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          setData(parsedData);
        } catch (err) {
          console.error("Erro ao parsear os dados do SSE:", err);
          setError(err);
        }
      };

      const handleError = (err) => {
        console.error("Erro no SSE:", err);
        setError(err);
        sse.close();
      };

      //Listeners
      sse.addEventListener(eventName, handleEvent);
      sse.onerror = handleError;
    } catch (err) {
      console.log("Erro na configuração do SSE:", err);
      setError(err);
    }

    return () => {
      if (sse) {
        sse.removeEventListener(eventName, () => {});
        sse.close();
        console.log("Fechou")
      }
    };

  }, [component, eventName]);

  return { data, error };
};

export default useSSE;
