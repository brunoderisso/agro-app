import React, { useEffect } from "react";

import SessionStore from "../stores/SessionStore";
import history from "../history";


export default function RedirectTo() {
  useEffect(() => {
    setTo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTo = () => {
    if (window.localStorage.token === undefined) {
      SessionStore.emit("environment.change", "preference");
      history.push("/login");
    } else if (window.location.hash.replace('#/', '') !== "admin" ||
      (window.location.hash.replace('#/', '') === "admin" && !SessionStore.getPreference().globaladmin)) {
      history.push("/dashboard");
    }
  };

  return (
    <div></div>
  );
}
