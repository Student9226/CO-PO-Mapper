import { useState, useEffect } from "react";
import axios from 'axios';
import { CoPoMatrixTable } from "./CoPoMatrixTable";
import { Table } from "./Table";
import { generateExcel, generateDoc, generatePDF } from "./reportGenerator"; 

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
  const [isSwitchOn, toggleSwitch] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(''); 
  const [selectedCourse, setSelectedCourse] = useState('');  
  const [editableCourses, setEditableCourses] = useState([]);
  const [newMapping, setNewMapping] = useState([]);
  
  const fetchCourseData = async (course) => {
    let url = "";
  
    switch (course) {
      case "BSc CS":
        url = "/get_course/BSc%20CS"; // Use encoded space
        break;
      case "BSc IT":
        url = "/get_course/BSc%20IT";
        break;
      case "MSc IT":
        url = "/get_course/MSc%20IT";
        break;
      default:
        console.error("Invalid course selected");
        return null;
    }
  
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${course} data:`, error);
      return null;
    }
  };
  
  
  const fetchProgramOutcomes = async (program) => {
    try {
      const response = await axios.get(`/get_program/${program}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${program} outcomes:`, error);
      return [];
    }
  };

  const handleMapOutcomes = async () => {
    try {
      const response = await fetch('https://5000-sagar999-copomapper-sasdici9ljh.ws-us116.gitpod.io/map-outcomes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          program: selectedProgram,
          course_outcomes: editableCourses.map(course => course.outcomes).flat(),
        }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log(data)
      setNewMapping(data);
    } catch (error) {
      console.error('Error mapping outcomes:', error);
    }
  };

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

  const filterCourses = async (semester, selectedSubject = subject) => {
    const courseData = await fetchCourseData(course);
  
    if (!courseData) {
      setFilteredCourses([]);
      setSubjectOptions([]);
      return;
    }
  
    const syllabus = courseData.syllabi.find((s) => s.syllabus_year === "2023-2024"); // Or the appropriate year
  
    const programData = syllabus?.program.find(
      (program) => program.semester === semester
    );
  
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

  const filteredProgram = async () => {
  if (course) {
    const programOutcomes = await fetchProgramOutcomes(course);
    if (programOutcomes?.outcomes) {
      return programOutcomes.outcomes;
    } else {
      console.log(`No program outcomes found for course: ${course}`);
      return [];
    }
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
      } else if (docFormat === "PDF") {
        generatePDF(reportData); 
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
  const func=async()=>{
    try {
      const response = await fetch("https://5000-sagar999-copomapper-sasdici9ljh.ws-us116.gitpod.io/get_course/BSC%20CS");
      const data = await response.json();
      console.log("Fetched Program Data:", data);
    } catch (error) {
      console.error("Error fetching program data:", error);
    }
}
  return (
    <main className={`form-container ${isProgramSelected ? 'form-left' : 'form-centered'}`}>
      <div className="main-border">
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
          <button onClick={generateReport} >Generate Report</button>
          <label className="switch"><span>Allow editing</span><input onClick={handleSwitch} type="checkbox" value={isSwitchOn}/><span className="slider"></span></label>
          <button onClick={handleMapOutcomes}>Map Outcomes</button>
          </div>
      </div>
      <button onClick={func}/>
      <div className="tables-container">
        {<Table program={filteredProgram()} programName={course} isEditable={isSwitchOn}/>}
        <Table courses={filteredCourses} isEditable={isSwitchOn}/>
        { subject && <CoPoMatrixTable selectedCourse={subject} selectedProgram={course} newMapping={newMapping} onDataReady={handleCoPoMatrixData} />}</div>
    </main>
  );
};
