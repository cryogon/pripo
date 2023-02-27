import { h } from "vue";
//This is a test project that converts normal string to hyperscripts
// Currently not using but will be using in diffrent project later

function getTag(type: string, content: string | undefined) {
  if (content === undefined) {
    return h("span", {
      innerHTML: type,
    });
  }
  switch (type) {
    case "heading":
      return h("h2", {
        innerHTML: content,
      });
    case "underline":
      return h("span", {
        innerHTML: content,
        style: "text-decoration:underline;",
      });
    case "bold": {
      return h("span", {
        innerHTML: content,
        style: "font-weight:bold;",
      });
    }
    case "img": {
      return h("img", {
        src: content,
        alt: "",
        referrerpolicy: "no-referrer",
      });
    }
    default:
      return h("span", {
        innerHTML: content,
      });
  }
}

/**
 *
 * @param str str that need to be converted
 * @returns HTML tags i,e [tagName,content]
 */
function textConverter(str: string) {
  return str.split("\n").map((line) => {
    //Working Find with simple text but not with images
    let str = "";
    for (const i of line) {
      str += i;
      if (i === ":") {
        break;
      }
    }
    return getTag(str.slice(0, -1), line.slice(str.length) || undefined);
  });
}

/**
 *
 * @param type type of the tag
 * @param content innerText of the tag
 * @description This function converts simple string to hyperscripts
 */
function textConverterv1(str: string) {
  return str.split("\n").map((line) => {
    const l: string[] = line.split(":");
    return getTag(l[0], l[1] || undefined);
  });
}

export default function AboutSection(props: any, _context: any) {
  return textConverter(props.content);
}
