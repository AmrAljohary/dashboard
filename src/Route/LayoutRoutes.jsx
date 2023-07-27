import React, { Fragment } from 'react';
import { Route, Routes, Navigate } from "react-router-dom";
import { routes } from './Routes';
import AppLayout from '../Layout/Layout';

const LayoutRoutes = () => {

  return (
    <>
      <Routes>
        {routes.map(({ path, Component }, i) => (
          <Fragment key={i}>
            <Route element={<AppLayout />} key={i}>
              <Route path={path} element={Component} />
              {/* <Route
                path="*"
                element={
                  <Navigate
                    to={`${process.env.PUBLIC_URL}/error/error-page5`}
                  />
                }
              />*/}
            </Route>
          </Fragment>
        ))}
      </Routes>
    </>
  );
};

export default LayoutRoutes;