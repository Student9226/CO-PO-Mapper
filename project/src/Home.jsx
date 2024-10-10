import { useState } from "react";
import bsc_cs from "../json/bsc_cs.json";
import bsc_it from "../json/bsc_it.json";
import msc_it from "../json/msc_it.json";
import programData from "../json/program.json";
import { CoPoMatrixTable } from "./CoPoMatrixTable";
import { Table } from "./Table";
import { generateExcel, generateDoc } from "./reportGenerator"; 

export const Home = () => {
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [subject, setSubject] = useState("");
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [isProgramSelected, setProgramSelected] = useState(false);
  const [docFormat, setDocFormat] = useState(""); 
  const [placeholder, setPlaceholder] = useState("Enter a Name");
  const [instructorName, setInstructorName] = useState(""); 
  const [coPoMatrixData, setCoPoMatrixData] = useState([]);
  const [isSwitchOn, toggleSwitch] = useState(true);

  const handleCourse = (e) => {
    setCourse(e.target.value);
    setSemester("");
    setSubject("");
    setFilteredCourses([]);
    setSubjectOptions([]);
    setProgramSelected(!!e.target.value);
  };

  const handleSemester = (e) => {
    setSemester(e.target.value);
    filterCourses(e.target.value);
  };

  const filterCourses = (semester, selectedSubject = subject) => {
    let programData;

    if (course) {
      const bscCSSyllabus = bsc_cs.syllabi.find((s) => s.syllabus_year === "2015-2016");
      const bscITSyllabus = bsc_it.syllabi.find((s) => s.syllabus_year === "2023-2024");
      const mscITSyllabus = msc_it.syllabi.find((s) => s.syllabus_year === "2015-2016");

      switch (course) {
        case "BSc CS":
          programData = bscCSSyllabus.program.find(
            (program) => program.semester === semester
          );
          break;
        case "BSc IT":
          programData = bscITSyllabus.program.find(
            (program) => program.semester === semester
          );
          break;
        case "MSc IT":
          programData = mscITSyllabus.program.find(
            (program) => program.semester === semester
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

  const handleDocFormat = (e) => {
    setDocFormat(e.target.value); 
  };

  const generateReport = () => {
    const reportData = {
      instructor: instructorName,  
      course,
      semester,
      subject,
      program: filteredProgram(),
      courses: filteredCourses,
      coPoMatrix: coPoMatrixData,  
    };
  
    if (course && semester && subject) {
      if (docFormat === "Excel") {
        generateExcel(reportData); 
      } else if (docFormat === "Docx") {
        generateDoc(reportData, docFormat); 
      } else if (docFormat === "") {
        alert('Please select a document format to export.');
      }
    } else {
      alert("Please input the required data before exporting.");
    }
  };
  const handleCoPoMatrixData = (coPoData) => {
    setCoPoMatrixData(coPoData);
  };

  const handleSwitch=()=>{
    toggleSwitch(prev => !prev)
  }

  return (
    <main className={`form-container ${isProgramSelected ? 'form-left' : 'form-centered'}`}>
      <div className="form-fields">
      <label className="fields">
          Instructor&apos;s Name:
          <input type='text' value={instructorName} onChange={(e) => setInstructorName(e.target.value)} placeholder={placeholder} onFocus={()=>setPlaceholder('')} onBlur={()=>setPlaceholder('Enter a Name')}></input>
        </label>
        <label className="fields">
          Program:
          <select name="course" value={course} onChange={handleCourse}>
            <option value="">Select a course</option>
            <option value="BSc CS">BSc CS</option>
            <option value="BSc IT">BSc IT</option>
            <option value="MSc IT">MSc IT</option>
          </select>
        </label>

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
        <label className="fields">
          Document Format:
          <select name="docFormat" value={docFormat} onChange={handleDocFormat}>
            <option value="">Select a format</option>
            <option value="Excel">Excel</option>
            <option value="Docx">Docx</option>
            <option value="PDF">PDF</option>
          </select>
        </label>
          <button onClick={generateReport}>Generate Report</button>
          <div onClick={handleSwitch} className="switch">Allow editing<span style={{background: isSwitchOn? '#00ff00':'rgba(0,128,0,0.75)'}}></span></div>
        </div>

      <div className="tables-container">
        {<Table program={filteredProgram()} programName={course}/>}
        <Table courses={filteredCourses} />
        { subject && <CoPoMatrixTable selectedCourse={subject} selectedProgram={course} onDataReady={handleCoPoMatrixData}/> }</div>
    </main>
  );
};
