import React, { useState, useEffect } from "react";
import { Form, FormGroup, Input, Label } from "reactstrap";
import { Btn, H4, H6, P } from "../../../AbstractElements";
import {
  EmailAddress,
  LoginWithJWT,
  OrSignInWith,
  Password,
  SignIn,
} from "../../../Constant";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormPassword from "./FormPassword";
import { login } from "../../../Store/reducers/auth";
const LoginTab = ({ selected }) => {
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
    } catch (error) {
      console.error("Login error:", error);
    }
  };
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
    <Form className="theme-form">
      <H4>
        {selected === "simpleLogin"
          ? "Sign In With Simple Login"
          : "Sign In With Jwt"}
      </H4>
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
      <FormPassword />
      <div>
        {selected === "simpleLogin" ? (
          <Btn
            attrBtn={{
              color: "primary",
              className: "d-block w-100 mt-2",
              onClick: { handleLogin },
            }}
          >
            {SignIn}
          </Btn>
        ) : (
          <Btn
            attrBtn={{
              color: "primary",
              className: "d-block w-100 mt-2",
              onClick: handleLogin, // Corrected onClick
              disabled: loading, // Corrected disabled
            }}
          >
            {loading ? "Logging in..." : "Login"}
            {error && <p>{error}</p>}
            {LoginWithJWT}
          </Btn>
        )}
      </div>
    </Form>
  );
};

export default LoginTab;
