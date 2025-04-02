import React, { useEffect } from 'react';
import { withRouter } from "react-router-dom";
import { useParams } from 'react-router-dom';

import TokenList from '../../stores/CancelTokenList';
import userStore from '../../stores/UserStore';
import history from '../../history';


export default withRouter(function RedirectMap() {
  const tokenList = new TokenList();

  const { hash } = useParams();
  console.log(hash);

  useEffect(() => {
    invite();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const invite = () => {
    const cancelToken = {};
    cancelToken.id = tokenList.add();
    cancelToken.token = tokenList.get(cancelToken.id);

    userStore.setShareAccount(cancelToken, hash, responseInvite);
  }

  const responseInvite = (response) => {
    tokenList.remove(response.id);

    if (response.data) {
      history.push("/");
    }
  }

  return (
    <></>
  )
})