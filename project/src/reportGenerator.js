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
  
  const worksheetData = [
    ["Instructor Name:", data.instructor || ""],
    ["Program:", data.programName || ""],
    ["Semester:", data.semester || ""],
    ["Subject:", data.course || ""],
    [], 
    ["Sr No", `${data.programName} Program Outcomes`],
    ...data.program.map((outcome, index) => [`${index + 1}`, outcome]),
    [], 
    ["Sr No", "Course ID", "Course Name", "Outcomes"],
    ...modifiedCourses.map((course) => [course.SrNo, course["Course ID"], course["Course Name"], course.Outcomes]),
    ...data.coPoMatrix.map((row) => Object.values(row))
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

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
              new TextRun(`${data.course} Report\n`),
              new TextRun(`\t\nSemester: ${data.semester || ""}`),
              new TextRun(`\t\nInstructor: ${data.instructor || ""}`),
              new TextRun(`\t\nProgram: ${data.programName || ""}`),
              new TextRun(`\t\nSubject: ${data.course || ""}\n\n`),
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
          new Paragraph("\n"), 
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
                    new TableCell({ children: [new Paragraph(course.id || "")] }),
                    new TableCell({ children: [new Paragraph(course.name || "")] }),
                    new TableCell({ children: [new Paragraph(course.outcomes.join(", ") || "")] }),
                  ],
                })
              ),
            ],
          }),
          new Paragraph("\n"),
          new Paragraph("CO PO Matrix"),
          new Table({
            rows: data.coPoMatrix.map((row) =>
              new TableRow({
                children: Object.values(row).map((cellValue) =>
                  new TableCell({ children: [new Paragraph(cellValue.toString()+" ")] })
                ),
              })
            ),
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
    head: [["Sr No", `${data.programName} Program Outcomes`]],
    body: data.program.map((outcome, index) => [`${index + 1}`, outcome]),
    startY: 50,
  });

  doc.text("Courses:", 10, doc.autoTable.previous.finalY + 10);
  doc.autoTable({
    head: [["Sr No", "Course ID", "Course Name", "Outcomes"]],
    body: data.courses.map((course, index) => [
      data.courses.length > 1 ? `${index + 1}` : "",
      course.id || "",
      course.name || "",
      course.outcomes.join(", ") || "",
    ]),
    startY: doc.autoTable.previous.finalY + 20,
  });

  doc.text("CO-PO Matrix:", 10, doc.autoTable.previous.finalY + 10);
  doc.autoTable({
    head: [Object.keys(data.coPoMatrix[0])],
    body: data.coPoMatrix.map((row) => Object.values(row)),
    startY: doc.autoTable.previous.finalY + 20,
  });

  doc.save(`${data.course}_Report.pdf`);
};
