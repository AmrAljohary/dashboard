import { createSlice } from "@reduxjs/toolkit";
import api from "../api";
import axios from "axios";
const authSlice = createSlice({
    name: "auth",
    initialState: {
        accessToken: null,
        user: null,
        loading: false,
        error: null,
    },
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state, action) {
            state.accessToken = action.payload.accessToken;
            state.user = action.payload.user;
            state.res = action.payload;
            state.loading = false;
            state.error = null;
        },
        loginFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
    },
});

export const { loginStart, loginSuccess, loginFailure } = authSlice.actions;

export const login = (email, password) => async(dispatch) => {
    dispatch(loginStart());
    try {
        // Create the form data using URLSearchParams
        const formData = new URLSearchParams();
        formData.append("email", email);
        formData.append("password", password);

        // Set the headers to indicate x-www-form-urlencoded
        const config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };

        // Make the POST request with the form data using Axios
        const response = await axios.post(
            `${api.defaults.baseURL}/admin/login`,
            formData,
            config
        );

        // Save the access token to the Redux store
        dispatch(loginSuccess(response));
    } catch (error) {
        console.error("Login error:", error.response.data.message);
        // Handle login error in your app
        dispatch(loginFailure(error.response.data.message));
    }
};

export default authSlice.reducer;