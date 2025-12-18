// import pdfParseModule from "pdf-parse";
// const pdfParse = pdfParseModule.default || pdfParseModule;

// export async function extractFromBuffer(file) {
//   if (!file) throw new Error("No file provided");
//   if (file.mimetype === "application/pdf") {
//     const parsed = await pdfParse(file.buffer);
//     return parsed.text || "";
//   }
//   if (file.mimetype === "text/plain") {
//     return file.buffer.toString("utf-8");
//   }
//   throw new Error("Unsupported file type (only PDF or TXT)");
// }





// import pdfParse from "pdf-parse";

// export async function extractFromBuffer(file) {
//   if (!file) throw new Error("No file provided");

//   if (file.mimetype === "application/pdf") {
//     const parsed = await pdfParse(file.buffer);
//     return parsed.text || "";
//   }

//   if (file.mimetype === "text/plain") {
//     return file.buffer.toString("utf-8");
//   }

//   throw new Error("Unsupported file type (only PDF or TXT)");
// }



import pdfParse from "pdf-parse";

export async function extractFromBuffer(file) {
  if (!file) throw new Error("No file provided");

  if (file.mimetype === "application/pdf") {
    const parsed = await pdfParse(file.buffer);
    return parsed.text || "";
  }

  if (file.mimetype === "text/plain") {
    return file.buffer.toString("utf-8");
  }

  throw new Error("Unsupported file type (only PDF or TXT)");
}