interface MetaParamsType {
  title: string;
  description: string;
}
export function setMeta(param: MetaParamsType): void {
  const meta = document.getElementsByTagName("meta") as any;
  if (meta.namedItem("og:title")?.content) {
    meta["og:title"].content = param.title;
  } else {
    const ogTitle = document.createElement("meta");
    ogTitle.setAttribute("name", "og:title");
    ogTitle.setAttribute("content", param.title);
    document.head.appendChild(ogTitle);
  }
  document.title = param.title;
  console.log(meta);
}
