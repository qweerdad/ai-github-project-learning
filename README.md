# AI时代GitHub开源项目实战

> 从看不懂源码，到借助 AI 完成开源项目复现、理解和二次开发。
> 一份**免费**的项目实践教程，适合学过一点编程（C/Python 均可）、但还没有独立完成过开源项目的本科生。

## 在线阅读

**<https://qweerdad.github.io/ai-github-project-learning/>**

打开即可学，无需安装任何软件，手机也能看。

## 离线学习（下载 ZIP）

到 [Releases](../../releases) 下载 `AI时代GitHub开源项目实践教程_学生体验版.zip`，解压后**双击根目录 `index.html`** 即可开始。网页完全离线可读；动手做项目时再按教程指引安装免费工具（Python / VS Code，均为免费）。

## 教程讲什么

以一个真实的开源任务管理项目 [TaskFlow](https://github.com/SultanZhalifa/TaskFlow)（固定 commit `40dcd30`）为对象，八章带做：

1. **第1章 学习观** — AI 时代为什么仍要自己读懂、验证代码
2. **第2章 认识GitHub** — 仓库五要素、项目评估、ZIP/Clone 下载
3. **第3章 跑起项目** — 本地服务器、`file://` 失效真相
4. **第4章 读懂项目** — 入口定位、追踪一条完整数据流
5. **第5章 向AI提问** — 提问公式、识别 AI 幻觉
6. **第6章 二次开发** — 从零实现"任务备注"功能（完整可复制代码）
7. **第7章 验证代码** — 三层验证法、手动测试清单、DevTools
8. **第8章 迁移方法** — 分级练习 + 下一个项目的可复用流程

配套：学生练习 A~D、自检表、7 个 AI 提问示例、参考答案（⚠ 标记，先做完再看）、下载中心（原版/参考实现源码 + 改动 diff）。

## 适用人群与要求

- 会基本电脑操作、学过任意一门编程语言即可；不要求用过 GitHub、命令行或付费 AI；
- 阅读教程只需浏览器；动手环节需要 Windows 电脑 + Python + VS Code（可选）+ 一个免费 AI 助手；
- 约 7~10 天、每天 1~2 小时。

## 反馈

遇到问题先看站内「遇到问题怎么办」页；教程的改进建议欢迎在本仓库的 **Issues** 或 **Discussions** 里留言，也可填写包内 `学习反馈模板.txt` 交给课程组织者。

## 许可

- **教程文档**（正文、练习、AI 示例、原创图示）：[CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/deed.zh-hans)，见 `LICENSE-教程文档.txt`；
- **TaskFlow 源码**（`downloads/` 内两个 zip）：原作者 MIT License，LICENSE 保留在 zip 内，版权归 TaskFlow contributors；
- 截图中的 GitHub、Windows、浏览器等第三方界面元素归其各自所有者，仅作教学演示。

## 项目来源

教程基于开源项目 [TaskFlow](https://github.com/SultanZhalifa/TaskFlow) 固定版本 `40dcd30`（MIT）制作，二次开发改动完全可审查（`downloads/changes.diff`，4 文件 +137/-10 行）。
