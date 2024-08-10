import { settings } from "@/settings";
import { snippets } from "@/snippets";
import { getFileContent } from "@/utils";
import { fetchSyncPost } from "siyuan";

export default class InsertCSS {
  onunload() {
    // 获取所有的 style 元素
    const styles = document.querySelectorAll("style");

    // 遍历所有 style 元素
    styles.forEach((style) => {
      // 检查 id 是否以 'code-snippets-' 开头
      if (style.id && style.id.startsWith("code-snippets-")) {
        // 如果是，则从 DOM 中移除该元素
        style.remove();
      }
    });
  }

  //App 准备好时加载
  async onLayoutReady() {
    snippets.forEach((ele) => {
      settings.getFlag(`${ele.author}-${ele.title}`) &&
        this.insertSingleCSS(ele);
    });
  }

  async insertSingleCSSByKey(key) {
    let configs = key.split("-");
    let cssConfig = snippets.find((ele) => {
      return ele.author === configs[0] && ele.title === configs[1];
    });

    let styleElement = document.createElement("style");
    styleElement.id = `code-snippets-${cssConfig.author}-${cssConfig.title}`;
    let cssSnippetContent = await getFileContent(
      `/data/plugins/siyuan-code-snippets/${cssConfig.path}`
    );
    if (cssSnippetContent) {
      styleElement.textContent += cssSnippetContent;
      document.head.appendChild(styleElement);
    }
  }
  async onunloadCSSByKey(key) {
    let configs = key.split("-");
    let cssConfig = snippets.find((ele) => {
      return ele.author === configs[0] && ele.title === configs[1];
    });

    const styleElement = document.getElementById(
      `code-snippets-${cssConfig.author}-${cssConfig.title}`
    );

    if (styleElement) {
      styleElement.remove();
    } else {
    }
  }

  async insertSingleCSS(cssConfig) {
    let styleElement = document.createElement("style");
    styleElement.id = `code-snippets-${cssConfig.author}-${cssConfig.title}`;
    let cssSnippetContent = await getFileContent(
      `/data/plugins/siyuan-code-snippets/${cssConfig.path}`
    );
    if (cssSnippetContent) {
      styleElement.textContent += cssSnippetContent;
      document.head.appendChild(styleElement);
    }
  }

  async insertCSS() {
    let cssSnippets = await fetchSyncPost("/api/file/readDir", {
      path: "/data/plugins/siyuan-code-snippets/cssSnippets/",
    });

    cssSnippets.data.forEach(async (cssSnippet) => {
      if (cssSnippet.name.endsWith(".css")) {
        let styleElement = document.createElement("style");
        styleElement.id = `code-snippets-${cssSnippet.name}`;
        let cssSnippetContent = await getFileContent(
          `/data/plugins/siyuan-code-snippets/cssSnippets/${cssSnippet.name}`
        );
        styleElement.textContent += cssSnippetContent;
        document.head.appendChild(styleElement);
      }
    });
  }
}
