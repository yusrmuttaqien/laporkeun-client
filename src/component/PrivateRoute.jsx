import React from "react";
import { Redirect, Route } from "react-router";
import { useStoreState } from "easy-peasy";

export default function PrivateRoute({ comp: Component, ...rest }) {
  const { isLogged } = useStoreState((state) => ({
    isLogged: state.session.isLogged,
  }));

  return (
    <Route
      {...rest}
      render={(props) => {
        return isLogged ? (
          <Component {...props}/>
        ) : (
          <Redirect to="/" />
        );
      }}
    />
  );
}
