import { describe, it, expect, vi, beforeEach } from "vitest";
import { JSDOM } from "jsdom";

const sharpInstance = {
    png: vi.fn().mockReturnThis(),
    toBuffer: vi.fn().mockResolvedValue(Buffer.from("PNGDATA"))
};

vi.mock("sharp", () => {
    return {
        default: vi.fn(() => sharpInstance)
    };
});

vi.mock(import("fs"), async (importOriginal) => {
    const actual = await importOriginal()
    return {
        default: {
            ...actual,
            promises: {
                mkdir: vi.fn().mockResolvedValue(),
                writeFile: vi.fn().mockResolvedValue()
            },
            readFileSync: vi.fn(),
            readdirSync: vi.fn().mockReturnValue([]),
            rmSync: vi.fn()
        }
    };
});

vi.mock("./vehicleConfigs.js", () => ({
  vehicleBaseDirectory: "/base",
  vehiclesDistDirectory: "/dist",
  colorMapping: {
    "#111111": "outline",
    "#222222": "primary"
  },
  backdropConfig: {
    outline: { color: "white", opacity: 1 },
    primary: { color: "red", opacity: 0.8 }
  },
  imageThemeConfig: {
    light: {
      idle: {
        outline: { color: "blue", opacity: 1 },
        primary: { color: "yellow", opacity: 0.5 }
      }
    }
  }
}));

// Import AFTER mocks
import {
  convertSvgToPng,
  processPathSaveNewAttributes,
  convertSvgPathsToPng
} from "./vehicleIconCreation.js";

import fs from "fs";
import sharp from "sharp";


// ============================================================================================
// TESTS
// ============================================================================================
describe("vehicleIconCreation utilities", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ------------------------------------------------------------------------------------------
  // TEST convertSvgToPng
  // ------------------------------------------------------------------------------------------
  it("convertSvgToPng writes PNG output using sharp", async () => {
    const svgString = `<svg><rect width="100" height="100" /></svg>`;
    const outputPath = "/dist/example/output.png";

    await convertSvgToPng(svgString, outputPath);

    expect(sharp).toHaveBeenCalled();  
    expect(fs.promises.mkdir).toHaveBeenCalled();
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      outputPath,
      expect.any(Buffer)
    );
  });


  // ------------------------------------------------------------------------------------------
  // TEST processPathSaveNewAttributes
  // ------------------------------------------------------------------------------------------
  it("processPathSaveNewAttributes sets attributes and calls convertSvgToPng", async () => {
    const svgString = `
      <svg id="svgContainer">
        <path id="p1" fill="#111111"></path>
        <path id="p2" fill="#222222"></path>
      </svg>
    `;

    const dom = new JSDOM(svgString);
    const document = dom.window.document;

    const svgPaths = {
      outline: document.querySelectorAll(`path#p1`),
      primary: document.querySelectorAll(`path#p2`)
    };

    const options = {
      outline: { color: "white", opacity: 1 },
      primary: { color: "green", opacity: 0.7 }
    };

    const spy = vi.spyOn(sharp().png(), "toBuffer");

    await processPathSaveNewAttributes(document, svgPaths, options, "/dist/test.png");

    // check attributes applied
    expect(document.querySelector("#p1").getAttribute("fill")).toBe("white");
    expect(document.querySelector("#p2").getAttribute("fill")).toBe("green");

    // check sharp was invoked
    expect(spy).toHaveBeenCalled();
  });


  // ------------------------------------------------------------------------------------------
  // TEST convertSvgPathsToPng
  // ------------------------------------------------------------------------------------------
  it("convertSvgPathsToPng processes backdrop and theme images", async () => {
    const svgContent = `
      <svg>
        <path fill="#111111"></path>
        <path fill="#222222"></path>
      </svg>
    `;

    await convertSvgPathsToPng(svgContent, "shipA");

    // backdrop.png
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      "/dist/shipA/backdrop.png",
      expect.any(Buffer)
    );

    // theme state files
    expect(fs.promises.writeFile).toHaveBeenCalledWith(
      "/dist/shipA/light/idle.png",
      expect.any(Buffer)
    );
  });

});