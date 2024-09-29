import { useState } from "react";
import PropTypes from "prop-types";
import bsc_cs from "../json/bsc_cs.json";
import bsc_it from "../json/bsc_it.json";
import msc_it from "../json/msc_it.json";
import { CoPoMatrixTable } from "./CoPoMatrixTable";

//const csProgramOutcomes23=["To think analytically, creatively and critically in developing robust, extensible and highly maintainable technological solutions to simple and complex problems.  To apply their knowledge and skills to be employed and excel in IT professional careersand/or to continue their education in IT and/or related post graduate programmes.  To be capable of managing complex IT projects with consideration of the human,financial and environmental factors.  To work effectively as a part of a team to achieve a common stated goal.  To adhere to the highest standards of ethics, including relevant industry andorganizational codes of conduct.  To communicate effectively with a range of audiences both technical and non-technical.  To develop an aptitude to engage in continuing professional development"]
//const mcsProgramOutcomes20=["PSO1: Ability to apply the knowledge of Information Technology with recent trends aligned with research and industry. PSO2: Ability to apply IT in the field of Computational Research, Soft Computing, Big Data Analytics, Data Science, Image Processing, Artificial Intelligence, Networking and Cloud Computing. PSO3: Ability to provide socially acceptable technical solutions in the domains of Information Security, Machine Learning, Internet of Things and Embedded System, Infrastructure Services as specializations. PSO4: Ability to apply the knowledge of Intellectual Property Rights, Cyber Laws and Cyber Forensics and various standards in interest of National Security and Integrity along with IT Industry. PSO5: Ability to write effective project reports, research publications and content development and to work in multidisciplinary environment in the context of changing technologies."]

const ClassDropdown = ({ selectedClass, onClassChange, classes }) => {
  return (
    <label className="fields">
      Year:
      <select name="year" value={selectedClass} onChange={onClassChange}>
        <option value="">Select a year</option>
        {classes.map((className) => (
          <option key={className} value={className}>
            {className}
          </option>
        ))}
      </select>
    </label>
  );
};

ClassDropdown.propTypes = {
  selectedClass: PropTypes.string,
  onClassChange: PropTypes.func.isRequired,
  classes: PropTypes.array.isRequired,
};

export const Home = () => {
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [semester, setSemester] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [subject, setSubject] = useState("");
  const [subjectOptions, setSubjectOptions] = useState([]);

  const handleCourse = (e) => {
    setCourse(e.target.value);
    setYear("");
    setSemester("");
    setSubject("");
    setFilteredCourses([]);
    setSubjectOptions([]);
  };

  const handleYear = (e) => {
    setYear(e.target.value);
    setSemester("");
    setSubject("");
    setFilteredCourses([]);
    setSubjectOptions([]);
  };

  const handleSemester = (e) => {
    setSemester(e.target.value);
    filterCourses(e.target.value);
  };

  const filterCourses = (semester, selectedSubject = subject) => {
    let programData;
  
    if (course && year) {
      const syllabus = msc_it.syllabi.find((s) => s.syllabus_year === "2015-2016"); 
  
      if (syllabus) {
        switch (course) {
          case "BSc CS":
            programData = bsc_cs.program.find(
              (program) => program.year === year && program.semester === semester
            );
            break;
          case "BSc IT":
            programData = bsc_it.program.find(
              (program) => program.year === year && program.semester === semester
            );
            break;
          case "MSc IT":
            programData = syllabus.program.find(
              (program) => program.year === year && program.semester === semester
            );
            break;
          default:
            programData = null;
        }
      }
    }
  
    if (programData) {
      if (!selectedSubject) {
        setFilteredCourses(programData.courses); // Show all courses
      } else {
        const selectedCourse = programData.courses.filter(
          (course) => course.name === selectedSubject
        );
        setFilteredCourses(selectedCourse);
      }
      setSubjectOptions(programData.courses.map((course) => course.name));
    } else {
      setFilteredCourses([]); 
      setSubjectOptions([]);
    }
  };
  
  

  const handleSubject = (e) => {
    setSubject(e.target.value);
    filterCourses(semester, e.target.value); // Call the filter with the updated subject
  };
  

  return (
    <>
      <main className="form-container">
        <div className="form-fields">
          <label className="fields">
            Course Name:
            <select name="course" value={course} onChange={handleCourse}>
              <option value="">Select a course</option>
              <option value="BSc CS">BSc CS</option>
              <option value="BSc IT">BSc IT</option>
              <option value="MSc IT">MSc IT</option>
            </select>
          </label>

          <ClassDropdown
            selectedClass={year}
            onClassChange={handleYear}
            classes={["First", "Second", "Third"]}
          />

          <label className="fields">
            Semester:
            <select name="semester" value={semester} onChange={handleSemester}>
              <option value="">Select a semester</option>
              <option value="I">I</option>
              <option value="II">II</option>
              <option value="III">III</option>
              <option value="IV">IV</option>
              <option value="V">V</option>
              <option value="VI">VI</option>
            </select>
          </label>

          <label className="fields">
            Subject:
            <select name="subject" value={subject} onChange={handleSubject}>
              <option value="">Select a subject</option>
              {subjectOptions.map((subjectName) => (
                <option key={subjectName} value={subjectName}>
                  {subjectName}
                </option>
              ))}
            </select>
          </label>
        </div>

        <Table courses={filteredCourses} />
        <CoPoMatrixTable />

      </main>
    </>
  );
};

const Table = ({ courses }) => {
  return (
    <table className="course-table">
      <thead>
        {courses.length !== 0 && (
          <tr>
            <th>Course ID</th>
            <th>Course Name</th>
            <th>Outcomes</th>
          </tr>
        )}
      </thead>
      <tbody>
        {courses.map((course) => (
          <tr key={course.id}>
            <td>{course.id}</td>
            <td>{course.name}</td>
            <td>
              <ul>
                {course.outcomes.map((outcome, index) => (
                  <li key={index}>{outcome}</li>
                ))}
              </ul>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};


Table.propTypes = {
  courses: PropTypes.array.isRequired,
};

{/**{
        "syllabus_year": "2015-2016",
        "program": [
          {
            "year": "First",
            "semester": "I",
            "courses": [
              {
                "id": "USCS101",
                "name": "Fundamentals of Computer Organization & Embedded Systems",
                "outcomes": [
                  "Apply knowledge of computer architecture and organization appropriate to the discipline.",
                  "Analyze given processing element, and identify and define the computing requirements.",
                  "Design, implement, and evaluate a microcontroller-based system, process, component, or program to meet desired needs.",
                  "Use current techniques, skills, and tools necessary for Low-Level computing."
                ]
              },
              {
                "id": "USCS102",
                "name": "Introduction to Programming using Python",
                "outcomes": [
                  "Students should be able to understand the concepts of programming before actually starting to write new programs.",
                  "Students should be able to understand what happens in the background when the programs are executed.",
                  "Students should be able to develop logic for Problem Solving.",
                  "Students should be made familiar with the basic constructs of programming such as data, operations, conditions, loops, functions, etc.",
                  "Students should be able to apply the problem-solving skills using syntactically simple language, i.e., Python (version: 3.X or higher)."
                ]
              }
            ]
          },
          {
            "year": "Second",
            "semester": "II",
            "courses": [
              {
                "id": "USCS201",
                "name": "Introduction to Database Management Systems",
                "outcomes": [
                  "Students should be able to evaluate business information problems and find the requirements of a problem in terms of data.",
                  "Students should be able to design the database schema with the use of appropriate data types for storage of data in a database.",
                  "Students should be able to create, manipulate, query, and back up the databases."
                ]
              },
              {
                "id": "USCS202",
                "name": "Advanced Programming using Python",
                "outcomes": [
                  "Students should be able to understand how to read/write to files using Python.",
                  "Students should be able to catch their own errors that happen during execution of programs.",
                  "Students should get an introduction to the concept of pattern matching.",
                  "Students should be familiar with the concepts of GUI controls and designing GUI applications.",
                  "Students should be able to connect to the database to move the data to/from the application.",
                  "Students should know how to search and sort data and how to determine the efficiency of algorithms used."
                ]
              }
            ]
          }
        ]
      }, */}