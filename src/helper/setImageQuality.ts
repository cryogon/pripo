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
  url?: string,
  imageOptions?: ImageQualityParams
) {
  const u = url || "";
  const { quality = "", width, height } = imageOptions || {};
  const origin = new URL(u).origin;
  if (origin.includes("cloudinary")) {
    const assetType = new URL(u).pathname.slice(0, 23);
    const pathname = new URL(u).pathname.slice(23);
    return `${origin}${assetType}${quality ? "/" + quality : ""}${
      width ? "/w_" + width : ""
    }${height ? "/h_" + height : ""}${pathname}`;
  }
  return "";
}
