//Add More Test Later On
import { describe, test, expect } from "vitest";
import {
  setImageQuality,
  type ImageQualityParams,
} from "@/utils/setImageQuality";
describe("setImageQuality", () => {
  test("returns the same URL when origin does not includes 'cloudinary'", () => {
    const url = "https://example.com/image.jpg";
    expect(setImageQuality(url)).toEqual(url);
  });

  test("modifies the URL with quality options when the origin includes 'cloudinary'", () => {
    const url =
      "https://res.cloudinary.com/demo/image/upload/v1624615948/sample.jpg";
    const options: ImageQualityParams = { quality: "q_50" };
    const expectedUrl =
      "https://res.cloudinary.com/demo/image/upload/q_50/v1624615948/sample.jpg";
    expect(setImageQuality(url, options)).toEqual(expectedUrl);
  });

  test("modifies the URL with width and height options when the origin includes 'cloudinary'", () => {
    const url =
      "https://res.cloudinary.com/demo/image/upload/v1624615948/sample.jpg";
    const options = { width: 500, height: 500 };
    const expectedUrl =
      "https://res.cloudinary.com/demo/image/upload/w_500/h_500/v1624615948/sample.jpg";
    expect(setImageQuality(url, options)).toEqual(expectedUrl);
  });

  test("modifies the URL with all options when the origin includes 'cloudinary'", () => {
    const url =
      "https://res.cloudinary.com/demo/image/upload/v1624615948/sample.jpg";
    const options: ImageQualityParams = {
      quality: "q_50",
      width: 500,
      height: 500,
    };
    const expectedUrl =
      "https://res.cloudinary.com/demo/image/upload/q_50/w_500/h_500/v1624615948/sample.jpg";
    expect(setImageQuality(url, options)).toEqual(expectedUrl);
  });
});
