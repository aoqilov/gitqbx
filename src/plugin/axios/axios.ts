import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { showToast } from "@/utils/showToaster";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { store } from "@/store";

// ─── Environment ────────────────────────────────────────────────────────────
const isDev = import.meta.env.VITE_APP_ENV === "development";
const isDevtoolsEnabled = import.meta.env.VITE_ENABLE_DEVTOOLS === "true";

// ─── Logger (faqat dev + devtools yoqilgan bo'lsa) ──────────────────────────
const log = {
  request: (config: InternalAxiosRequestConfig) => {
    if (!isDev || !isDevtoolsEnabled) return;
    console.groupCollapsed(
      `%c[API ▶] ${config.method?.toUpperCase()} ${config.url}`,
      "color: #60a5fa; font-weight: bold;",
    );
    console.log("Base URL:", config.baseURL);
    console.log("Params:", config.params ?? "—");
    console.log("Body:", config.data ?? "—");
    console.groupEnd();
  },
  response: (res: AxiosResponse) => {
    if (!isDev || !isDevtoolsEnabled) return;
    console.groupCollapsed(
      `%c[API ✔] ${res.status} ${res.config.url}`,
      "color: #4ade80; font-weight: bold;",
    );
    console.log("Data:", res.data);
    console.groupEnd();
  },
  error: (err: AxiosError) => {
    if (!isDev || !isDevtoolsEnabled) return;
    console.groupCollapsed(
      `%c[API ✖] ${err.response?.status ?? "Network"} ${err.config?.url}`,
      "color: #f87171; font-weight: bold;",
    );
    console.log("Response:", err.response?.data);
    console.groupEnd();
  },
};
const BASE_URL = import.meta.env.VITE_API_URL;

// ─── Axios instance ──────────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: BASE_URL + `/api/v1`,
  timeout: 10000,
  headers: {
    "ngrok-skip-browser-warning": "true",
  },
});

// ─── Request interceptor ─────────────────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    const userId = store.getState().user.user?.id;
    const initData = store.getState().user.initData;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    if (userId) {
      config.headers.id = userId;
    }
    if (initData) {
      config.headers.initdata = initData;
    }

    log.request(config);
    return config;
  },
  (error: AxiosError) => {
    log.error(error);
    return Promise.reject(error);
  },
);

/// ─── HTTP status → user-facing сообщения ──────────────────────────────────────
const HTTP_ERROR_MESSAGES: Record<number, string> = {
  400: "Неверно отправлен запрос",
  401: "Сессия истекла, войдите снова",
  403: "Нет доступа",
  404: "Данные не найдены",
  408: "Время запроса истекло",
  422: "Некорректные данные",
  429: "Слишком много запросов, попробуйте позже",
  500: "Ошибка сервера",
  502: "Сервер временно недоступен",
  503: "Сервис временно остановлен",
};

// ─── Response interceptor ────────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => {
    log.response(response);
    return response.data;
  },
  (error: AxiosError) => {
    log.error(error);

    const status = error.response?.status;

    // 401 → удалить токен и перенаправить на login
    if (status === 401) {
      // localStorage.removeItem("token");
      // window.location.replace("/");
      return Promise.reject(error);
    }

    // Network ошибка (нет интернета, CORS, timeout)
    // if (!error.response) {
    //   showToast({
    //     type: "error",
    //     title: "Ошибка сети или CORS",
    //     description: "Проверьте интернет или попробуйте позже",
    //   });
    //   return Promise.reject(error);
    // }

    // HTTP status ошибка → показать toast
    const message = HTTP_ERROR_MESSAGES[status!] ?? "Неизвестная ошибка";

    // showToast({
    //   type: "error",
    //   title: `Ошибка ${status}`,
    //   description: message,
    // });

    return Promise.reject(error);
  },
);
