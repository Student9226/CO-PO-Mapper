import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

export const generateExcel = (data) => {
  const modifiedCourses = data.courses.map((course) => ({
    ...course,
    name: course.name || "", 
  }));

  const workbook = XLSX.utils.book_new();

  const instructorSheet = XLSX.utils.aoa_to_sheet([["Instructor Name", data.instructor || ""]]);
  XLSX.utils.book_append_sheet(workbook, instructorSheet, "Instructor Info");

  const programOutcomesSheet = XLSX.utils.json_to_sheet(
    data.program.map((outcome, index) => ({ "Program Outcome": `PO${index + 1}`, Outcome: outcome }))
  );
  XLSX.utils.book_append_sheet(workbook, programOutcomesSheet, "Program Outcomes");

  const courseOutcomesSheet = XLSX.utils.json_to_sheet(modifiedCourses);
  XLSX.utils.book_append_sheet(workbook, courseOutcomesSheet, "Courses");

  const coPoMatrixSheet = XLSX.utils.json_to_sheet(data.coPoMatrix);
  XLSX.utils.book_append_sheet(workbook, coPoMatrixSheet, "CO-PO Matrix");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, `${data.course}_Report.xlsx`);
};

export const generateDoc = (data, format) => {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            children: [
              new TextRun(`${data.course} Report`),
              new TextRun(`Semester: ${data.semester}`),
              new TextRun(`Instructor: ${data.instructor || ""}`), 
            ],
          }),
          ...data.program.map((outcome, index) => 
            new Paragraph({
              children: [new TextRun(`PO${index + 1}: ${outcome}`)],
            })
          ),
          ...data.courses.map((course) =>
            new Paragraph({
              children: [new TextRun(course.name)],
            })
          ),
          ...data.coPoMatrix.map((row) =>
            new Paragraph({
              children: [new TextRun(row.join(" | "))],
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
