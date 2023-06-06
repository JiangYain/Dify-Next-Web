import { REQUEST_TIMEOUT_MS } from "@/app/constant";
import { useAccessStore, useAppConfig, useChatStore } from "@/app/store";
import { getDifyHeaders } from "../api";
import Locale from "../../locales";
import {
  EventStreamContentType,
  fetchEventSource,
} from "@fortaine/fetch-event-source";
import { prettyObject } from "@/app/utils/format";

interface DifyLLMConfig {
  // user: string;
  conversationId?: string;
  stream?: boolean;
}

interface DifyChatOptions {
  // messages: RequestMessage[];
  config: DifyLLMConfig;
  query: string;
  user: string;
  difyKey: string;
  onUpdate?: (message: string, conversationId?: string) => void;
  onFinish: (message: string) => void;
  onError?: (err: Error) => void;
  onController?: (controller: AbortController) => void;
}

export class DifyAPI {
  public ChatPath = "/chat-messages";

  path(path: string): string {
    let difyUrl = useAccessStore.getState().difyUrl;
    if (difyUrl.endsWith("/")) difyUrl = difyUrl.slice(0, difyUrl.length - 1);
    return [difyUrl, path].join("");
  }

  extractMessage(res: any) {
    return res.answer ?? "";
  }

  async chat(options: DifyChatOptions) {
    const requestPayload = {
      response_mode: options.config.stream ? "streaming" : "blocking",
      query: options.query,
      user: options.user,
      conversationId: options.config.conversationId,
      inputs: {},
    };

    console.log("[Request] dify payload: ", requestPayload);

    const shouldStream = !!options.config.stream;
    const controller = new AbortController();
    options.onController?.(controller);

    try {
      const chatPath = this.path(this.ChatPath);
      const chatPayload = {
        method: "POST",
        body: JSON.stringify(requestPayload),
        signal: controller.signal,
        headers: getDifyHeaders(options.difyKey),
      };
      console.log("[Dify Chat Headers]", chatPayload.headers);
      console.log("[Dify Chat Path]", chatPath);

      // make a fetch request
      const requestTimeoutId = setTimeout(
        () => controller.abort(),
        REQUEST_TIMEOUT_MS,
      );

      if (shouldStream) {
        let responseText = "";
        let finished = false;
        let conversationId = "";

        const finish = () => {
          if (!finished) {
            options.onFinish(responseText);
            finished = true;
          }
        };

        controller.signal.onabort = finish;

        fetchEventSource(chatPath, {
          ...chatPayload,
          async onopen(res) {
            clearTimeout(requestTimeoutId);
            const contentType = res.headers.get("content-type");
            console.log("[Dify] request response content type: ", contentType);

            if (contentType?.startsWith("text/plain")) {
              responseText = await res.clone().text();
              return finish();
            }

            if (
              !res.ok ||
              !res.headers
                .get("content-type")
                ?.startsWith(EventStreamContentType) ||
              res.status !== 200
            ) {
              const responseTexts = [responseText];
              let extraInfo = await res.clone().text();
              try {
                const resJson = await res.clone().json();
                extraInfo = prettyObject(resJson);
              } catch {}

              if (res.status === 401) {
                responseTexts.push(Locale.Error.DifyUnauthorized);
              }

              if (extraInfo) {
                responseTexts.push(extraInfo);
              }

              responseText = responseTexts.join("\n\n");

              return finish();
            }
          },
          onmessage(msg) {
            if (msg.data === "[DONE]" || finished) {
              return finish();
            }
            const text = msg.data;
            try {
              const json = JSON.parse(text);
              const delta = json.answer;
              console.log("[Dify json]", json);
              if (delta) {
                responseText += delta;
                options.onUpdate?.(responseText, json.conversation_id);
              }
            } catch (e) {
              console.error("[Request] parse error", text, msg);
            }
          },
          onclose() {
            finish();
          },
          onerror(e) {
            options.onError?.(e);
            throw e;
          },
          openWhenHidden: true,
        });
      } else {
        const res = await fetch(chatPath, chatPayload);
        clearTimeout(requestTimeoutId);

        const resJson = await res.json();
        const message = this.extractMessage(resJson);
        options.onFinish(message);
      }
    } catch (e) {
      console.log("[Request] failed to make a chat reqeust", e);
      options.onError?.(e as Error);
    }
  }
  // async usage() {
  //   // dify does not provide usage api
  //   // so just return some fake data
  //   return {
  //     used: 0.00,
  //     total: 0.00,
  //   } as LLMUsage;
  // }
}
