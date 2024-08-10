import { Dialog, Plugin, fetchSyncPost, getFrontend } from "siyuan";

import SettingPannel from "@/setting.svelte";
import { settings } from "./settings";

import { getFileContent, setPlugin } from "./utils";
import { snippets } from "./snippets";
import InsertCSS from "./utils/insertCSS";
export default class PluginGo extends Plugin {
  myIcon = `<svg t="1723301907327" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4269" width="128" height="128"><path d="M438.4 849.1l222.7-646.7c0.2-0.5 0.3-1.1 0.4-1.6L438.4 849.1z" opacity=".224" p-id="4270"></path><path d="M661.2 168.7h-67.5c-3.4 0-6.5 2.2-7.6 5.4L354.7 846c-0.3 0.8-0.4 1.7-0.4 2.6 0 4.4 3.6 8 8 8h67.8c3.4 0 6.5-2.2 7.6-5.4l0.7-2.1 223.1-648.3 7.4-21.4c0.3-0.8 0.4-1.7 0.4-2.6-0.1-4.5-3.6-8.1-8.1-8.1zM954.6 502.1c-0.8-1-1.7-1.9-2.7-2.7l-219-171.3c-3.5-2.7-8.5-2.1-11.2 1.4-1.1 1.4-1.7 3.1-1.7 4.9v81.3c0 2.5 1.1 4.8 3.1 6.3l115 90-115 90c-1.9 1.5-3.1 3.8-3.1 6.3v81.3c0 4.4 3.6 8 8 8 1.8 0 3.5-0.6 4.9-1.7l219-171.3c6.9-5.4 8.2-15.5 2.7-22.5zM291.1 328.1l-219 171.3c-1 0.8-1.9 1.7-2.7 2.7-5.4 7-4.2 17 2.7 22.5l219 171.3c1.4 1.1 3.1 1.7 4.9 1.7 4.4 0 8-3.6 8-8v-81.3c0-2.5-1.1-4.8-3.1-6.3l-115-90 115-90c1.9-1.5 3.1-3.8 3.1-6.3v-81.3c0-1.8-0.6-3.5-1.7-4.9-2.7-3.5-7.7-4.1-11.2-1.4z" p-id="4271"></path></svg>`;

  private isMobile: boolean;

  insertCss = new InsertCSS();

  //获取插件类实例
  init() {
    setPlugin(this);
  }

  //绑定文档块右键菜单
  editortitleiconEvent({ detail }: any) {}

  //编辑器切换事件
  switchProtyleEvent({ detail }: any) {}

  //块右键菜单
  private blockIconEvent({ detail }: any) {}

  //App 准备好时加载
  async onLayoutReady() {
    //这里注入CSS和JS
    this.insertCss.onLayoutReady();
  }

  //卸载逻辑
  onunload() {
    this.insertCss.onunload();
  }

  //App 启动时加载
  async onload() {
    const frontEnd = getFrontend();
    this.isMobile = frontEnd === "mobile" || frontEnd === "browser-mobile";

    this.init();
    await settings.initData();
  }

  openSetting(): void {
    this.openGlobalSetting();
  }

  openGlobalSetting(): void {
    let dialog = new Dialog({
      title: "配置",
      content: `<div id="code-snippets-setting-pannel" style="height: 600px;"></div>`,
      width: "800px",
      destroyCallback: (options) => {
        console.log("destroyCallback", options);
        pannel.$destroy();
      },
    });

    let pannel = new SettingPannel({
      target: dialog.element.querySelector("#code-snippets-setting-pannel"),
    });
  }
}
