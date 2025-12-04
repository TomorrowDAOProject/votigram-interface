// import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
// import { getCroppedImg } from "../canvasUtils";

// // Mock the canvas and its context
// const mockCanvas = () => {
//   const canvas = {
//     width: 500,
//     height: 500,
//     getContext: vi.fn(() => ({
//       translate: vi.fn(),
//       rotate: vi.fn(),
//       scale: vi.fn(),
//       drawImage: vi.fn(),
//       getImageData: vi.fn(() => ({
//         data: new Uint8ClampedArray(),
//         width: 100,
//         height: 100,
//       })),
//       putImageData: vi.fn(),
//       clearRect: vi.fn(),
//       save: vi.fn(),
//       restore: vi.fn(),
//     })),
//     toBlob: vi.fn((callback: BlobCallback) => {
//       const blob = new Blob(["sample-image-data"], { type: "image/png" });
//       callback(blob);
//     }), // Mock the toBlob method
//     toDataURL: vi.fn(() => "data:image/png;base64,sample-image-data"), // Mock for fallback usage
//   } as unknown as HTMLCanvasElement;

//   const context = {
//     translate: vi.fn(),
//     rotate: vi.fn(), // Mock `rotate`
//     scale: vi.fn(),
//     drawImage: vi.fn(),
//     getImageData: vi.fn(() => ({
//       data: new Uint8ClampedArray(),
//       width: 100,
//       height: 100,
//     })),
//     putImageData: vi.fn(),
//     clearRect: vi.fn(),
//     save: vi.fn(),
//     restore: vi.fn(),
//   };

//   return { canvas, context };
// };

// describe("getCroppedImg", () => {
//   let originalCreateElement: typeof document.createElement;

//   beforeEach(() => {
//     // Save the original `document.createElement`
//     originalCreateElement = document.createElement;

//     // Mock `document.createElement`
//     vi.spyOn(document, "createElement").mockImplementation(
//       (tagName: string) => {
//         if (tagName === "canvas") {
//           return mockCanvas();
//         }
//         return originalCreateElement.call(document, tagName); // Call the original implementation for non-canvas elements
//       }
//     );

//     // Mock the `Image` constructor
//     vi.spyOn(global, "Image").mockImplementation(
//       () =>
//         ({
//           width: 500,
//           height: 400,
//           setAttribute: vi.fn(),
//           addEventListener: vi.fn((event, handler) => {
//             if (event === "load") {
//               setTimeout(handler, 0); // Simulate successful image load
//             }
//             if (event === "error") {
//               setTimeout(() => {
//                 handler(new Error("Image load error"));
//               }, 0);
//             }
//           }),
//           removeEventListener: vi.fn(),
//           get src() {
//             return "";
//           },
//           set src(value: string) {
//             // Simulate setting the src attribute
//             setTimeout(() => {
//               // Assume the image loads successfully when src is set
//             }, 0);
//           },
//         } as unknown as HTMLImageElement)
//     );
//   });

//   afterEach(() => {
//     // Restore the original `document.createElement`
//     document.createElement = originalCreateElement;

//     // Restore all mocks
//     vi.restoreAllMocks();
//   });

//   it("creates a canvas and crops the image correctly", async () => {
//     const result = await getCroppedImg(
//       "mock-image-src",
//       { x: 100, y: 50, width: 200, height: 150 },
//       0, // No rotation
//       { horizontal: false, vertical: false }
//     );

//     expect(result).not.toBeNull();
//   });

//   it("handles image rotation correctly", async () => {
//     const { getContext } = mockCanvas();
//     const context = getContext("2d");

//     const result = await getCroppedImg(
//       "mock-image-src",
//       { x: 100, y: 50, width: 200, height: 150 },
//       90, // Rotation
//       { horizontal: false, vertical: false }
//     );

//     expect(result).not.toBeNull();
//     expect(context?.rotate).toHaveBeenCalledWith(Math.PI / 2);
//   });

//   it("handles horizontal and vertical flipping correctly", async () => {
//     const { getContext } = mockCanvas();
//     const context = getContext("2d");

//     const result = await getCroppedImg(
//       "mock-image-src",
//       { x: 100, y: 50, width: 200, height: 150 },
//       0,
//       { horizontal: true, vertical: true } // Flip both horizontally and vertically
//     );

//     expect(result).not.toBeNull();
//     expect(context?.scale).toHaveBeenCalledWith(-1, -1);
//   });

//   it("returns null if the canvas context is not available", async () => {
//     // Mock `getContext` to return null
//     vi.spyOn(document, "createElement").mockImplementation(
//       (tagName: string) => {
//         if (tagName === "canvas") {
//           const canvas = {
//             getContext: vi.fn(() => null), // No context
//           } as unknown as HTMLCanvasElement;
//           return canvas;
//         }
//         return originalCreateElement.call(document, tagName);
//       }
//     );

//     const result = await getCroppedImg(
//       "mock-image-src",
//       { x: 100, y: 50, width: 200, height: 150 },
//       0
//     );

//     expect(result).toBeNull();
//   });

//   it("handles image load errors correctly", async () => {
//     // Simulate an image load failure
//     vi.spyOn(global, "Image").mockImplementation(
//       () =>
//         ({
//           width: 500,
//           height: 400,
//           setAttribute: vi.fn(),
//           addEventListener: vi.fn((event, handler) => {
//             if (event === "error") {
//               setTimeout(() => {
//                 handler(new Error("Image load error"));
//               }, 0);
//             }
//           }),
//           removeEventListener: vi.fn(),
//           get src() {
//             return "";
//           },
//           set src(value: string) {
//             // Simulate setting the src attribute
//             setTimeout(() => {
//               // Simulate image load error
//             }, 0);
//           },
//         } as unknown as HTMLImageElement)
//     );

//     const result = await getCroppedImg(
//       "invalid-image-src",
//       { x: 100, y: 50, width: 200, height: 150 },
//       0
//     );

//     expect(result).toBeNull();
//   });
// });
