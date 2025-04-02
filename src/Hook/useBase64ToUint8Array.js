import { useEffect, useState } from "react";


const useBase64ToUint8Array = (imageBase64) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (imageBase64) {
      const base64WithoutPrefix = imageBase64.split(',').pop();
      const binaryString = atob(base64WithoutPrefix);
      const uint8Array = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }

      setData(Object.values(uint8Array));
    }

  }, [imageBase64]);

  return data;
};

export default useBase64ToUint8Array;
