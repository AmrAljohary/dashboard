import React, { useState, useEffect } from "react";
import { Form, FormGroup, Input, Label } from "reactstrap";
import { Btn, H4, H6, P, Spinner } from "../../../AbstractElements";
import {
  EmailAddress,
  LoginWithJWT,
  OrSignInWith,
  Password,
  SignIn,
} from "../../../Constant";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../../Store/reducers/auth";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThreeDots } from "react-loader-spinner"; // Import the Loader
let lastError = null;
let isNotificationShowing = false;
const LoginTab = () => {
  const [togglePassword, setTogglePassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const user = useSelector((state) => state.auth.user);
  const history = useNavigate();
  const handleLogin = async () => {
    try {
      // Dispatch the login action
      await dispatch(login(email, password));
    } catch (error) {}
  };

  const showErrorNotification = (error) => {
    if (error === lastError || isNotificationShowing) {
      // Skip showing duplicate notifications
      return;
    }
    lastError = error;
    isNotificationShowing = true;
    toast("🦄 " + error, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "dark",
      onClose: () => {
        isNotificationShowing = false;
      },
    });
  };
  {
    error && showErrorNotification(error);
  }
  // Use useEffect to listen for changes in accessToken and user
  React.useEffect(() => {
    // Check if accessToken and user data are available
    if (accessToken && user) {
      // Log the data to the console
      console.log("Login successful!");
      console.log("Access Token:", accessToken);
      console.log("User Data:", user);
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("login", JSON.stringify(true));
      localStorage.setItem("UserName", user.name);
      history(`${process.env.PUBLIC_URL}/dashboard`);
    }
  }, [accessToken, user, history]);
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="dark"
      />
      <Form className="theme-form">
        <H4>Sign In With Jwt</H4>
        <P>{"Enter your email & password to login"}</P>
        <FormGroup>
          <Label className="col-form-label">{EmailAddress}</Label>
          <Input
            className="form-control"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormGroup>
        <FormGroup className="position-relative">
          <Label className="col-form-label">{Password}</Label>
          <div className="position-relative">
            <Input
              className="form-control"
              type={togglePassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              className="show-hide"
              onClick={() => setTogglePassword(!togglePassword)}
            >
              <span className={togglePassword ? "" : "show"}></span>
            </div>
          </div>
        </FormGroup>
        <div>
            <Btn
              attrBtn={{
                color: "primary",
                className: "d-block w-100 mt-2",
                onClick: handleLogin, // Corrected onClick
                disabled: loading, // Corrected disabled
              }}
            >
              {loading ? (
                <ThreeDots
                  height="20"
                  width="100%"
                  radius="9"
                  color="#FF599A"
                  ariaLabel="three-dots-loading"
                  wrapperStyle={{}}
                  wrapperClassName=""
                  visible={true}
                />
              ) : (
                LoginWithJWT
              )}
            </Btn>
        </div>
      </Form>
    </>
  );
};

export default LoginTab;
