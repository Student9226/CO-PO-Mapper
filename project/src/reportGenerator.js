import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

// Excel report generation
export const generateExcel = (data) => {
  const worksheet = XLSX.utils.json_to_sheet(data.courses);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Courses");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, `${data.course}_Report.xlsx`);
};

// Word report generation
export const generateDoc = (data, format) => {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun(`${data.course} Report`),
              new TextRun(`Semester: ${data.semester}`),
            ],
          }),
          ...data.courses.map((course) =>
            new Paragraph({
              children: [new TextRun(course.name)],
            })
          ),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${data.course}_Report.${format.toLowerCase()}`);
  });
};
