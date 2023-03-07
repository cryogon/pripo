export interface MetaOptions {
  /**
   *Title for the current page
   */
  title: string;
  /**
   * @default ""
   */
  description?: string;
}

export interface MetaType extends HTMLCollectionOf<HTMLMetaElement> {
  namedItem(name: string): HTMLMetaElement;
}
export function setMeta(param: MetaOptions): void {
  const { title, description = "" } = param;
  const meta: MetaType = document.getElementsByTagName("meta") as MetaType;
  //Open Graph Title
  if (meta.namedItem("og:title")?.content) {
    meta.namedItem("og:title").content = title;
  } else {
    createMetaElement("og:title", title);
  }

  //Open Graph Description
  if (meta.namedItem("og:description")?.content) {
    meta.namedItem("og:description").content = description;
  } else {
    createMetaElement("og:description", description);
  }

  //Page Description
  if (meta.namedItem("description")?.content) {
    meta.namedItem("description").content = description;
  } else {
    createMetaElement("description", description);
  }

  //Page Title
  document.title = title;
}

function createMetaElement(name: string, _content: string) {
  const el = document.createElement("meta");
  el.setAttribute("name", name);
  el.setAttribute("content", _content);
  document.head.appendChild(el);
}
