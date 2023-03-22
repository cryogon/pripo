export interface ImageQualityParams {
  /**
   * quality of the image
   * @default "original"
   */
  quality?: "q_10" | "q_30" | "q_50" | "q_100" | "q_200";
  /**
   * width of the image in px
   */
  width?: number;
  /**
   * height of the image in px
   */
  height?: number;
}
export function setImageQuality(
  image?: string,
  imageOptions?: ImageQualityParams
) {
  const url = image || window.location.origin;
  const { quality = "", width, height } = imageOptions || {};
  const origin = new URL(url).origin;
  if (origin.includes("cloudinary")) {
    const assetType = new URL(url).pathname.slice(0, 23);
    const pathname = new URL(url).pathname.slice(23);
    return `${origin}${assetType}${quality ? "/" + quality : ""}${
      width ? "/w_" + width : ""
    }${height ? "/h_" + height : ""}${pathname}`;
  }
  return "";
}
