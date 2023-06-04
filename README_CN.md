![主界面](./docs/images/cover.png)

</div>

## 开始使用

1. 准备好你的 [OpenAI API Key](https://platform.openai.com/account/api-keys);
2. 点击右侧按钮开始部署：
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYidadaa%2FChatGPT-Next-Web&env=OPENAI_API_KEY&env=CODE&project-name=chatgpt-next-web&repository-name=ChatGPT-Next-Web)，直接使用 Github 账号登录即可，记得在环境变量页填入 API Key 和[页面访问密码](#配置页面访问密码) CODE；
3. 部署完毕后，即可开始使用；
4. 注意：Vercel 分配的域名 DNS 在某些区域被污染了，可以绑定自定义域名。

## 保持更新

如果你按照上述步骤一键部署了自己的项目，可能会发现总是提示“存在更新”的问题，这是由于 Vercel 会默认为你创建一个新项目而不是 fork 本项目，这会导致无法正确地检测更新。
推荐你按照下列步骤重新部署：

- 删除掉原先的仓库；
- 使用页面右上角的 fork 按钮，fork 本项目；
- 在 Vercel 重新选择并部署

### 打开自动更新

> 如果你遇到了 Upstream Sync 执行错误，请手动 Sync Fork 一次！

当你 fork 项目之后，由于 Github 的限制，需要手动去你 fork 后的项目的 Actions 页面启用 Workflows，并启用 Upstream Sync Action，启用之后即可开启每小时定时自动更新：

![自动更新](./docs/images/enable-actions.jpg)

![启用自动更新](./docs/images/enable-actions-sync.jpg)

### 手动更新代码

如果你想让手动立即更新，可以查看 [Github 的文档](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork) 了解如何让 fork 的项目与上游代码同步。

你可以 star/watch 本项目或者 follow 作者来及时获得新功能更新通知。

## 配置页面访问密码

> 配置密码后，用户需要在设置页手动填写访问码才可以正常聊天，否则会通过消息提示未授权状态。

> **警告**：请务必将密码的位数设置得足够长，最好 7 位以上，否则[会被爆破](https://github.com/Yidadaa/ChatGPT-Next-Web/issues/518)。

本项目提供有限的权限控制功能，请在 Vercel 项目控制面板的环境变量页增加名为 `CODE` 的环境变量，值为用英文逗号分隔的自定义密码：

```
code1,code2,code3
```

增加或修改该环境变量后，请**重新部署**项目使改动生效。

## 环境变量

> 本项目大多数配置项都通过环境变量来设置，教程：[如何修改 Vercel 环境变量](./docs/vercel-cn.md)。

### `OPENAI_API_KEY` （必填项）

OpanAI 密钥，你在 openai 账户页面申请的 api key。

### `CODE` （可选）

访问密码，可选，可以使用逗号隔开多个密码。

**警告**：如果不填写此项，则任何人都可以直接使用你部署后的网站，可能会导致你的 token 被急速消耗完毕，建议填写此选项。

### `BASE_URL` （可选）

> Default: `https://api.openai.com`

> Examples: `http://your-openai-proxy.com`

OpenAI 接口代理 URL，如果你手动配置了 openai 接口代理，请填写此选项。

> 如果遇到 ssl 证书问题，请将 `BASE_URL` 的协议设置为 http。

### `OPENAI_ORG_ID` （可选）

指定 OpenAI 中的组织 ID。

### `HIDE_USER_API_KEY` （可选）

如果你不想让用户自行填入 API Key，将此环境变量设置为 1 即可。

### `DISABLE_GPT4` （可选）

如果你不想让用户使用 GPT-4，将此环境变量设置为 1 即可。

## 开发

> 不建议在本地进行开发或者部署，由于一些技术原因，很难在本地配置好 OpenAI API 代理，除非你能保证可以直连 OpenAI 服务器。

点击下方按钮，开始二次开发：

[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/Yidadaa/ChatGPT-Next-Web)

在开始写代码之前，需要在项目根目录新建一个 `.env.local` 文件，里面填入环境变量：

```
OPENAI_API_KEY=<your api key here>
```

### 本地开发

1. 安装 nodejs 18 和 yarn，具体细节请询问 ChatGPT；
2. 执行 `yarn install && yarn dev` 即可。⚠️ 注意：此命令仅用于本地开发，不要用于部署！
3. 如果你想本地部署，请使用 `yarn install && yarn start` 命令，你可以配合 pm2 来守护进程，防止被杀死，详情询问 ChatGPT。

## 部署

### 容器部署 （推荐）

> Docker 版本需要在 20 及其以上，否则会提示找不到镜像。

> ⚠️ 注意：docker 版本在大多数时间都会落后最新的版本 1 到 2 天，所以部署后会持续出现“存在更新”的提示，属于正常现象。

```shell
docker pull yidadaa/chatgpt-next-web

docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY="sk-xxxx" \
   -e CODE="页面访问密码" \
   yidadaa/chatgpt-next-web
```

你也可以指定 proxy：

```shell
docker run -d -p 3000:3000 \
   -e OPENAI_API_KEY="sk-xxxx" \
   -e CODE="页面访问密码" \
   --net=host \
   -e PROXY_URL="http://127.0.0.1:7890" \
   yidadaa/chatgpt-next-web
```

如果你需要指定其他环境变量，请自行在上述命令中增加 `-e 环境变量=环境变量值` 来指定。

### 本地部署

在控制台运行下方命令：

```shell
bash <(curl -s https://raw.githubusercontent.com/Yidadaa/ChatGPT-Next-Web/main/scripts/setup.sh)
```

⚠️ 注意：如果你安装过程中遇到了问题，请使用 docker 部署。


## 开源协议

> 反对 996，从我开始。






[Anti 996 License](https://github.com/kattgu7/Anti-996-License/blob/master/LICENSE_CN_EN)

[官方网站](https://dify.ai) • [文档](https://docs.dify.ai/v/zh-hans) • [Twitter](https://twitter.com/dify_ai) •  [Discord](https://discord.gg/FngNHpbcY7)

在 Product Hunt 上投Dify一票吧 ↓  
<a href="https://www.producthunt.com/posts/dify-ai"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?sanitize=true&post_id=dify-ai&theme=light" alt="Product Hunt Badge" width="250" height="54"></a>

**Dify** 是一个易用的 LLMOps 平台，旨在让更多人可以创建可持续运营的原生 AI 应用。Dify 提供多种类型应用的可视化编排，应用可开箱即用，也能以“后端即服务”的 API 提供服务。

通过 Dify 创建的应用包含了：

- 开箱即用的的 Web 站点，支持表单模式和聊天对话模式
- 一套 API 即可包含插件、上下文增强等能力，替你省下了后端代码的编写工作
- 可视化的对应用进行数据分析，查阅日志或进行标注

Dify 兼容 Langchain，这意味着我们将逐步支持多种 LLMs ，目前已支持：

- GPT 3 (text-davinci-003)
- GPT 3.5 Turbo(ChatGPT)
- GPT-4

## 使用云服务

访问 [Dify.ai](https://cloud.dify.ai)

## 安装社区版

### 系统要求

在安装 Dify 之前，请确保您的机器满足以下最低系统要求：

- CPU >= 1 Core
- RAM >= 4GB

### 快速启动

启动 Dify 服务器的最简单方法是运行我们的 [docker-compose.yml](docker/docker-compose.yaml) 文件。在运行安装命令之前，请确保您的机器上安装了 [Docker](https://docs.docker.com/get-docker/) 和 [Docker Compose](https://docs.docker.com/compose/install/)：

```bash
cd docker
docker-compose up -d
```

运行后，可以在浏览器上访问 [http://localhost/install](http://localhost/install) 进入 Dify 控制台并开始初始化安装操作。

### 配置

需要自定义配置，请参考我们的 [docker-compose.yml](docker/docker-compose.yaml) 文件中的注释，并手动设置环境配置，修改完毕后，请再次执行 `docker-compose up -d`。

## Roadmap

我们正在开发中的功能：

- **数据集**，支持更多的数据集，例如同步 Notion 或网页的内容
我们将支持更多的数据集，包括文本、网页，甚至 Notion 内容。用户可以根据自己的数据源构建 AI 应用程序。
- **插件**，推出符合 ChatGPT 标准的插件，或使用 Dify 产生的插件
我们将发布符合 ChatGPT 标准的插件，或者 Dify 自己的插件，以在应用程序中启用更多功能。
- **开源模型**，例如采用 Llama 作为模型提供者，或进行进一步的微调
我们将与优秀的开源模型如 Llama 合作，通过在我们的平台中提供它们作为模型选项，或使用它们进行进一步的微调。

## Q&A

**Q: 我能用 Dify 做什么？**

A: Dify 是一个简单且能力丰富的 LLM 开发和运营工具。你可以用它搭建商用级应用，个人助理。如果你想自己开发应用，Dify 也能为你省下接入 OpenAI 的后端工作，使用我们逐步提供的可视化运营能力，你可以持续的改进和训练你的 GPT 模型。

**Q: 如何使用 Dify “训练”自己的模型？**

A: 一个有价值的应用由 Prompt Engineering、上下文增强和 Fine-tune 三个环节组成。我们创造了一种 Prompt 结合编程语言的 Hybrid 编程方式（类似一个模版引擎），你可以轻松的完成长文本嵌入，或抓取用户输入的一个 Youtube 视频的字幕——这些都将作为上下文提交给 LLMs 进行计算。我们十分注重应用的可运营性，你的用户在使用 App 期间产生的数据，可进行分析、标记和持续训练。以上环节如果没有好的工具支持，可能会消耗你大量的时间。

**Q: 如果要创建一个自己的应用，我需要准备什么？**

A: 我们假定你已经有了 OpenAI API Key，如果没有请去注册一个。如果你已经有了一些内容可以作为训练上下文，就太好了。

**Q: 提供哪些界面语言？**

A: 现已支持英文与中文，你可以为我们贡献语言包。

## 联系Dify

如果您有任何问题、建议或合作意向，欢迎通过以下方式联系Dify：

- 在Dify的 [GitHub Repo](https://github.com/langgenius/dify) 上提交 Issue 或 PR
- 在Dify的 [Discord 社区](https://discord.gg/FngNHpbcY7) 上加入讨论
- 发送邮件至 hello@dify.ai

## 贡献代码

为了确保正确审查，所有代码贡献 - 包括来自具有直接提交更改权限的贡献者 - 都必须提交 PR 请求并在合并分支之前得到核心开发人员的批准。

我们欢迎所有人提交 PR！如果您愿意提供帮助，可以在 [贡献指南](CONTRIBUTING_CN.md) 中了解有关如何为项目做出贡献的更多信息。

## 安全

为了保护您的隐私，请避免在 GitHub 上发布安全问题。发送问题至 security@dify.ai，我们将为您做更细致的解答。

## Citation

本软件使用了以下开源软件：

- Chase, H. (2022). LangChain [Computer software]. https://github.com/hwchase17/langchain
- Liu, J. (2022). LlamaIndex [Computer software]. doi: 10.5281/zenodo.1234.

更多信息，请参考相应软件的官方网站或许可证文本。

## License

本仓库遵循 [Dify Open Source License](LICENSE) 开源协议。
