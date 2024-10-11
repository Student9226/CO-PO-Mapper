import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell } from "docx";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const generateExcel = (data) => {
  const modifiedCourses = data.courses.map((course, index) => ({
    SrNo: data.courses.length > 1 ? index + 1 : "",  
    "Course ID": course.id || "",
    "Course Name": course.name || "",
    "Outcomes": course.outcomes.join(", "),  
  }));

  const workbook = XLSX.utils.book_new();

  const instructorSheet = XLSX.utils.aoa_to_sheet([["Instructor Name", data.instructor || ""]]);
  XLSX.utils.book_append_sheet(workbook, instructorSheet, "Instructor Info");

  const programOutcomesSheet = XLSX.utils.aoa_to_sheet(
    [["Sr No", `${data.programName} Program Outcomes`], ...data.program.map((outcome, index) => [`${index + 1}`, outcome])]
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
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Sr No")] }),
                  new TableCell({ children: [new Paragraph(`${data.programName} Program Outcomes`)] }),
                ],
              }),
              ...data.program.map((outcome, index) =>
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(`${index + 1}`)] }),
                    new TableCell({ children: [new Paragraph(outcome)] }),
                  ],
                })
              ),
            ],
          }),
          // Course table
          new Table({
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Sr No")] }),
                  new TableCell({ children: [new Paragraph("Course ID")] }),
                  new TableCell({ children: [new Paragraph("Course Name")] }),
                  new TableCell({ children: [new Paragraph("Outcomes")] }),
                ],
              }),
              ...data.courses.map((course, index) =>
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph(data.courses.length > 1 ? `${index + 1}` : "")] }),
                    new TableCell({ children: [new Paragraph(course.id)] }),
                    new TableCell({ children: [new Paragraph(course.name)] }),
                    new TableCell({ children: [new Paragraph(course.outcomes.join(", "))] }),
                  ],
                })
              ),
            ],
          }),
        ],
      },
    ],
  });

  Packer.toBlob(doc).then((blob) => {
    saveAs(blob, `${data.course}_Report.${format.toLowerCase()}`);
  });
};

export const generatePDF = (data) => {
  const doc = new jsPDF();

  doc.text(`${data.course} Report`, 10, 10);
  doc.text(`Semester: ${data.semester}`, 10, 20);
  doc.text(`Instructor: ${data.instructor || ""}`, 10, 30);

  doc.text("Program Outcomes:", 10, 40);
  doc.autoTable({
    head: [["Sr No", `${data.course} Program Outcomes`]],
    body: data.program.map((outcome, index) => [`${index + 1}`, outcome]),
    startY: 50,
  });

  doc.text("Courses:", 10, doc.autoTable.previous.finalY + 10);
  doc.autoTable({
    head: [["Sr No", "Course ID", "Course Name", "Outcomes"]],
    body: data.courses.map((course, index) => [
      data.courses.length > 1 ? `${index + 1}` : "",
      course.id,
      course.name,
      course.outcomes.join(", "),
    ]),
    startY: doc.autoTable.previous.finalY + 20,
  });

  doc.save(`${data.course}_Report.pdf`);
};