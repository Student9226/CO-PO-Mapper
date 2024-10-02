import { useState } from "react";
import PropTypes from "prop-types";
import bsc_cs from "../json/bsc_cs.json";
import bsc_it from "../json/bsc_it.json";
import msc_it from "../json/msc_it.json";
import programData from "../json/program.json";
import { CoPoMatrixTable } from "./CoPoMatrixTable";
import { Table } from "./Table";

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
  const [isProgramSelected, setProgramSelected] = useState(false);
  
  const handleCourse = (e) => {
    setCourse(e.target.value);
    setYear("");
    setSemester("");
    setSubject("");
    setFilteredCourses([]);
    setSubjectOptions([]);
    setProgramSelected(!!e.target.value);
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
      const bscCSSyllabus = bsc_cs.syllabi.find((s) => s.syllabus_year === "2023-2024");
      const bscITSyllabus = bsc_it.syllabi.find((s) => s.syllabus_year === "2023-2024");
      const mscITSyllabus = msc_it.syllabi.find((s) => s.syllabus_year === "2015-2016");
  
      switch (course) {
        case "BSc CS":
          programData = bscCSSyllabus.program.find(
            (program) => program.year === year && program.semester === semester
          );
          break;
        case "BSc IT":
          programData = bscITSyllabus.program.find(
            (program) => program.year === year && program.semester === semester
          );
          break;
        case "MSc IT":
          programData = mscITSyllabus.program.find(
            (program) => program.year === year && program.semester === semester
          );
          break;
        default:
          programData = null;
      }
    }
  
    if (programData) {
      if (!selectedSubject) {
        setFilteredCourses(programData.courses);
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

  const filteredProgram = () => {
    if (course) {
      return programData.program_outcomes[course];
    }
    return [];
  };

  const handleSubject = (e) => {
    setSubject(e.target.value);
    filterCourses(semester, e.target.value); 
  };

  return (
    <main className={`form-container ${isProgramSelected ? 'form-left' : 'form-centered'}`}>
      <div className="form-fields">
        <label className="fields">
          Program:
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
          Course:
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

      <div className="tables-container">
        <Table program={filteredProgram()} programName={course}/>
        <Table courses={filteredCourses} />
        <CoPoMatrixTable selectedCourse={subject} selectedProgram={course} /> 
      </div>
    </main>
  );
};
