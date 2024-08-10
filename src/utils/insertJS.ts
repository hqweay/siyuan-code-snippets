export default class InsertCSS {
  id: string = "";
  cssSnippets: string = "";

  onunload() {
    document.getElementById(this.id).remove()
  }

  onload() {
    let styleElement = document.createElement("script");
    styleElement.id = this.id;
    styleElement.textContent = this.cssSnippets;
    document.head.appendChild(styleElement);
  }
}
