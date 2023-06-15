import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_API_HOST, StoreKey } from "../constant";
import { getHeaders } from "../client/api";
import { BOT_HELLO } from "./chat";
import { ALL_MODELS } from "./config";
import { getClientConfig } from "../config/client";

export interface AccessControlStore {
  accessCode: string;
  token: string;
  difyToken: string;

  needCode: boolean;
  hideUserApiKey: boolean;
  openaiUrl: string;
  difyUrl: string;

  updateToken: (_: string) => void;
  updateDifyToken: (_: string) => void;
  updateCode: (_: string) => void;
  updateOpenAiUrl: (_: string) => void;
  enabledAccessControl: () => boolean;
  isAuthorized: () => boolean;
  // isDifyAuthorized: () => boolean;
  isAuthorizedWithoutDify: () => boolean;
  fetch: () => void;
}

let fetchState = 0; // 0 not fetch, 1 fetching, 2 done

const DEFAULT_OPENAI_URL =
  getClientConfig()?.buildMode === "export" ? DEFAULT_API_HOST : "/api/openai/";
console.log("[API] default openai url", DEFAULT_OPENAI_URL);

export const useAccessStore = create<AccessControlStore>()(
  persist(
    (set, get) => ({
      token: "",
      difyToken: "",
      accessCode: "",
      needCode: true,
      hideUserApiKey: false,
      openaiUrl: DEFAULT_OPENAI_URL,
      difyUrl: "/api/dify",

      enabledAccessControl() {
        get().fetch();

        return get().needCode;
      },
      updateCode(code: string) {
        set(() => ({ accessCode: code }));
      },
      updateToken(token: string) {
        set(() => ({ token }));
      },
      updateDifyToken(difyToken: string) {
        set(() => ({ difyToken }));
      },
      updateOpenAiUrl(url: string) {
        set(() => ({ openaiUrl: url }));
      },
      isAuthorized() {
        get().fetch();

        // has token or has code or disabled access control
        return (
          !!get().difyToken ||
          !!get().token ||
          !!get().accessCode ||
          !get().enabledAccessControl()
        );
      },
      // isDifyAuthorized() {
      //   get().fetch();
      //   return !!get().difyToken || !get().enabledAccessControl();
      // },
      isAuthorizedWithoutDify() {
        get().fetch();
        return (
          !!get().token || !!get().accessCode || !get().enabledAccessControl()
        );
      },
      fetch() {
        if (fetchState > 0) return;
        fetchState = 1;
        fetch("/api/config", {
          method: "post",
          body: null,
          headers: {
            ...getHeaders(),
          },
        })
          .then((res) => res.json())
          .then((res: DangerConfig) => {
            console.log("[Config] got config from server", res);
            set(() => ({ ...res }));

            if (!res.enableGPT4) {
              ALL_MODELS.forEach((model) => {
                if (model.name.startsWith("gpt-4")) {
                  (model as any).available = false;
                }
              });
            }

            if ((res as any).botHello) {
              BOT_HELLO.content = (res as any).botHello;
            }
          })
          .catch(() => {
            console.error("[Config] failed to fetch config");
          })
          .finally(() => {
            fetchState = 2;
          });
      },
    }),
    {
      name: StoreKey.Access,
      version: 1,
    },
  ),
);
