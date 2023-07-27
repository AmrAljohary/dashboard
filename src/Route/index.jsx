import React from "react";
import { Suspense, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { auth0 } from "../Config/Config";
import { Auth0Provider } from "@auth0/auth0-react";
import { configureFakeBackend, authHeader, handleResponse } from "../Services/fack.backend";
import Callback from '../Auth/Callback';
import Loader from "../Layout/Loader";
import { authRoutes } from "./AuthRoutes";
import LayoutRoutes from "../Route/LayoutRoutes";
import Signin from '../Auth/Signin';
import PrivateRoute from "./PrivateRoute";
import ErrorPage4 from "../Components/Pages/ErrorPages/error-page4";


const Routers = () => {
  const accessToken = localStorage.getItem("accessToken");
  const login = JSON.parse(localStorage.getItem("login"));
  const isAuthenticated = login;
  useEffect(() => {
    // Check if the user is authenticated based on the presence of access token in localStorage
    console.ignoredYellowBox = ["Warning: Each", "Warning: Failed"];
    console.disableYellowBox = true;
  }, []);

  return (
    <Auth0Provider
      domain={auth0.domain}
      clientId={auth0.clientId}
      redirectUri={auth0.redirectUri}
    >
      <BrowserRouter basename={"/"}>
        <>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path={"/"} element={<PrivateRoute />}>
                {isAuthenticated || accessToken || login ? (
                  <>
                    <Route
                      exact
                      path={`${process.env.PUBLIC_URL}`}
                      element={
                        <Navigate to={`${process.env.PUBLIC_URL}/dashboard`} />
                      }
                    />
                    <Route
                      exact
                      path={`/`}
                      element={
                        <Navigate to={`${process.env.PUBLIC_URL}/dashboard`} />
                      }
                    />
                  </>
                ) : (
                  ""
                )}
                <Route path={`/*`} element={<LayoutRoutes />} />
              </Route>
              <Route
                path={`${process.env.PUBLIC_URL}/callback`}
                render={() => <Callback />}
              />
              <Route
                exact
                path={`${process.env.PUBLIC_URL}/login`}
                element={<Signin />}
              />
              {authRoutes.map(({ path, Components }, i) => (
                <Route path={path} element={Components} key={i} />
              ))}
            </Routes>
          </Suspense>
        </>
      </BrowserRouter>
    </Auth0Provider>
  );
};

export default Routers;
