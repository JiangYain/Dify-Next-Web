import { prettyObject } from "@/app/utils/format";
import { NextRequest, NextResponse } from "next/server";
import { requestDify } from "../../common";
import { DIFY_KEY_PREFIX } from "@/app/constant";
import { getServerSideConfig } from "../../../config/server";

async function handle(
  req: NextRequest,
  { params }: { params: { path: string[] } },
) {
  console.log("[Dify Route] params ", params);

  const authResult = authDify(req);
  if (authResult.error) {
    return NextResponse.json(authResult, {
      status: 401,
    });
  }

  try {
    return await requestDify(req);
  } catch (e) {
    console.error("[Dify] ", e);
    return NextResponse.json(prettyObject(e));
  }
}

export const GET = handle;
export const POST = handle;

export const runtime = "edge";

function authDify(req: NextRequest) {
  const bearer = req.headers.get("Authorization") ?? "";
  const token = bearer.trim();
  const serverConfig = getServerSideConfig();
  console.log("[Time] ", new Date().toLocaleString());

  // if user does not provide an api key, inject system api key
  if (!token) {
    const apiKey = serverConfig.difyApiKey;
    if (apiKey) {
      console.log("[Dify Auth] use system api key");
      req.headers.set("Authorization", `Bearer ${apiKey}`);
    } else {
      console.log("[Dify Auth] admin did not provide an api key");
    }
  } else {
    console.log("[Dify Auth] use user api key");
  }

  return {
    error: false,
  };
}
