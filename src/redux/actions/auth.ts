import { createAsyncThunk } from "@reduxjs/toolkit";
import actionTypes from "../actionTypes";
import makeApiCall from "@lib/makeApi";
import config from "@lib/config";
import UseDrawers from "@hooks/useDrawers";
import {
  ApiResponse,
  LoginParams,
  RegisterParams,
  VerifyOtpParams,
  ApiError,
} from "../../types";

const authEndPoints = config.apiEndPoints.auth;

export const registerThunk = createAsyncThunk(
  actionTypes.auth.REGISTER,
  async ({
    payload,
    redirect,
  }: {
    payload: RegisterParams;
    redirect: (path: string) => void;
  }) => {
    const { notify } = UseDrawers();
    const response: ApiResponse<unknown> = await makeApiCall({
      url: `${authEndPoints.baseUrl}${authEndPoints.register}`,
      method: "POST",
      data: payload,
    });
    notify({
      message: response.message,
      type: response.status === 201 ? "success" : "error",
    });
    if (response.status === 201) {
      redirect("/verify-otp/?email=" + payload.email);
    }
  }
);

export const verifyOtpThunk = createAsyncThunk(
  actionTypes.auth.VERIFYOTP,
  async ({
    payload,
    redirect,
  }: {
    payload: VerifyOtpParams;
    redirect: (path: string) => void;
  }) => {
    const { notify } = UseDrawers();
    const response: ApiResponse<unknown> = await makeApiCall({
      url: `${authEndPoints.baseUrl}${authEndPoints.verifyOtp}`,
      method: "POST",
      data: payload,
    });
    notify({
      message: response.message,
      type: response.status === 200 ? "success" : "error",
    });
    if (response.status === 200) {
      redirect("/login");
    }
  }
);

export const resendOtpThunk = createAsyncThunk(
  actionTypes.auth.RESENDOTP,
  async ({ payload }: { payload: Omit<VerifyOtpParams, "otp"> }) => {
    const { notify } = UseDrawers();
    const response: ApiResponse<unknown> = await makeApiCall({
      url: `${authEndPoints.baseUrl}${authEndPoints.resendOtp}`,
      method: "POST",
      data: payload,
    });
    notify({
      message: response.message,
      type: response.status === 200 ? "success" : "error",
    });
  }
);

export const loginThunk = createAsyncThunk(
  actionTypes.auth.LOGIN,
  async ({
    payload,
    redirect,
  }: {
    payload: LoginParams;
    redirect: (path: string) => void;
  }) => {
    const { notify } = UseDrawers();

    try {
      const response: ApiResponse<unknown> = await makeApiCall({
        url: `${authEndPoints.baseUrl}${authEndPoints.login}`,
        method: "POST",
        data: payload,
      });

      if (response.status === 200) {
        const data = response.data as Record<string, unknown>;
        if (Object.keys(data).includes("accessToken")) {
          localStorage.setItem("accessToken", data.accessToken as string);
        }

        redirect("/dashboard");
      } else {
        notify({
          message: response.message,
          type: "error",
        });
      }

      return response;
    } catch (error) {
      notify({
        message:
          (error as ApiError)?.response?.data?.message ||
          "An error occurred while logging in. Please try again.",
        type: "error",
      });

      console.error("Login Error:", error);

      throw error;
    }
  }
);
