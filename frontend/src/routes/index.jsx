import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useIsFetching, useIsMutating } from "react-query";
import { Spin } from "antd";

import routes from "../constants/routes";
import useLoader, { LoaderProvider } from "../context/loader";
import { ScrollSyncProvider } from "../context/ScrollSyncContext";

import PublicLayout from "../components/Layout/PublicLayout";
import PrivateLayout from "../components/Layout/PrivateLayout";

const RenderRoutes = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const { loader, setLoader } = useLoader();

  // ✅ UseEffect stays the same
  useEffect(() => {
    setLoader(isFetching || isMutating);
  }, [isFetching, isMutating, setLoader]);

  // ✅ Ensure this returns a boolean, not string "null"
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  return (
    <Routes>
      {routes.map(({ component: Component, path, restricted }, index) => {
        // ✅ Ensure Layout is always a valid component, not a string
        const Layout = restricted ? PrivateLayout : PublicLayout;

        // ✅ If route is restricted and user not logged in, redirect
        if (restricted && !isAuthenticated) {
          return (
            <Route
              key={index}
              path={path}
              element={<Navigate to="/" replace />}
            />
          );
        }

        // ✅ Normal route rendering
        return (
          <Route
            key={index}
            path={path}
            element={
              <Layout>
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      filter: loader ? "blur(5px)" : "none",
                      transition: "filter 0.3s ease",
                    }}
                  >
                    <Component />
                  </div>

                  {loader && (
                    <div className="overlayStyle">
                      <div
                        style={{
                          position: "fixed",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          zIndex: "9999",
                        }}
                      >
                        <Spin
                          className={loader ? "custom-loader" : ""}
                          size="large"
                          spinning={loader}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Layout>
            }
          />
        );
      })}

      {/* ✅ Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

const AppRoutes = () => (
  <LoaderProvider>
    <ScrollSyncProvider>
      <RenderRoutes />
    </ScrollSyncProvider>
  </LoaderProvider>
);

export default AppRoutes;
