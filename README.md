<div align="center">
<img src="./docs/images/icon.svg" alt="icon"/>

<h1 align="center">Dify Next Web</h1>

English / [简体中文](./README_CN.md)

本项目基于Dify和ChatGPT-Next-Web两个项目创建，用于构建大语言模型在垂直细分领域的应用

您可以点击下方“Buy Me a Coffee”为ChatGPT-Next-Web的开发者Yidadaa提供支持，很可惜没有找到Dify开发者的支持方式，各位可以多多关注Dify项目

[Demo](https://chatgpt.nextweb.fun/) / [Issues](https://github.com/Yidadaa/ChatGPT-Next-Web/issues) / [Buy Me a Coffee](https://www.buymeacoffee.com/yidadaa)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYidadaa%2FChatGPT-Next-Web&env=OPENAI_API_KEY&env=CODE&project-name=chatgpt-next-web&repository-name=ChatGPT-Next-Web)

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Yidadaa/ChatGPT-Next-Web)

![cover](./docs/images/cover.png)

</div>

## Dify Next Web主要功能

- ChatGPT-Next-Web 是一个用于部署ChatGPT web UI的项目，它的主要功能包括完整的Markdown支持、流式响应、Mask和Prompt支持和上下文摘要等
- Dify 是一个LLMOps平台，旨在使更多的人能够创建可持续的、AI原生的应用程序。它提供了数据集的集成，以及用于提示工程、可视化分析和持续改进的单一接口
- Dify Next Web提供链接Dify的服务，且设置了Dify Key的列表以存储多个API KEY以方便切换，构建在垂直细分领域的应用
- 本项目提供一个基于Llamaindex的chrome插件，用于链接本地数据，奈何Llamaindex的release频率太高，且有一点点技术要求，暂不开放


## 开发计划

- 毫无开发计划可言，也许以后会聚合更多的功能

### 一定不会开发的功能

- 界面文字自定义
- 用户登录、账号管理、消息云同步

## Keep Updated

- 参见ChatGPT-Next-Web部分

## Environment Variables环境变量

### `OPENAI_API_KEY` (required)

Your openai api key.

### `CODE` (optional)

Access passsword, separated by comma.

### `BASE_URL` (optional)

> Default: `https://api.openai.com`

> Examples: `http://your-openai-proxy.com`

Override openai api request base url.

### `OPENAI_ORG_ID` (optional)

Specify OpenAI organization ID.

### `HIDE_USER_API_KEY` (optional)

> Default: Empty

If you do not want users to input their own API key, set this value to 1.

### `DISABLE_GPT4` (optional)

> Default: Empty

If you do not want users to use GPT-4, set this value to 1.

## Development

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Yidadaa/ChatGPT-Next-Web)

Before starting development, you must create a new `.env.local` file at project root, and place your api key into it:

```
OPENAI_API_KEY=<your api key here>
```

### Local Development

```shell
# 1. install nodejs and yarn first
# 2. config local env vars in `.env.local`
# 3. run
yarn install
yarn dev
```

## Deployment

### Docker (Recommended)

```shell
docker pull yidadaa/chatgpt-next-web

docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY="sk-xxxx" \
   -e CODE="your-password" \
   yidadaa/chatgpt-next-web
```

You can start service behind a proxy:

```shell
docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY="sk-xxxx" \
   -e CODE="your-password" \
   -e PROXY_URL="http://localhost:7890" \
   yidadaa/chatgpt-next-web
```

### Shell

```shell
bash <(curl -s https://raw.githubusercontent.com/Yidadaa/ChatGPT-Next-Web/main/scripts/setup.sh)
```

## LICENSE

[Anti 996 License](https://github.com/kattgu7/Anti-996-License/blob/master/LICENSE_CN_EN)
