const docx = require("docx");
const fs = require("fs");
const axios = require("axios");
const { nanoid } = require("nanoid");

const { Document, Packer, Paragraph, TextRun, ImageRun } = require("docx");

const client = axios.create({
  baseURL: "http://localhost:3000",
  headers: {},
});

async function getQRCodeImage() {
  const { data } = await client.get(`/api/demo/qr/${nanoid(15)}.png`, {
    responseType: "arraybuffer",
  });
  console.debug(typeof data);
  if (data) {
    const image = new ImageRun({
      data,
      transformation: {
        width: 300,
        height: 300,
      },
    });
    return image;
  }
}

async function getDoc() {
  const image = await getQRCodeImage();
  // Documents contain sections, you can have multiple sections per document, go here to learn more about sections
  // This simple example will only contain one section
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            children: [
              new TextRun("Hello World"),
              new TextRun({
                text: "Foo Bar",
                bold: true,
              }),
              new TextRun({
                text: "\tGithub is the best",
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [image],
          }),
        ],
      },
    ],
  });
  return doc;
}

getDoc().then((doc) => {
  // Used to export the file into a .docx file
  Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("My Document.docx", buffer);
  });
});
