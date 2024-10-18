import { useState } from "react";
import bsc_cs from "../json/bsc_cs.json";
import bsc_it from "../json/bsc_it.json";
import msc_it from "../json/msc_it.json";
import programData from "../json/program.json";
import { CoPoMatrixTable } from "./CoPoMatrixTable";
import { Table } from "./Table";
import { generateExcel, generateDoc, generatePDF } from "./reportGenerator"; 

export const Home = () => {
  const [course, setCourse] = useState("");
  const [program, setProgram] = useState([]); 
  const [semester, setSemester] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [subject, setSubject] = useState("");
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [docFormat, setDocFormat] = useState(""); 
  const [placeholder, setPlaceholder] = useState("Enter a Name");
  const [instructorName, setInstructorName] = useState(""); 
  const [coPoMatrixData, setCoPoMatrixData] = useState([]);
  const [isSwitchOn, toggleSwitch] = useState(false);
  
  const handleProgram = (e) => {
    setCourse(e.target.value);
    setSemester("");
    setSubject("");
    setFilteredCourses([]);
    setSubjectOptions([]);
    
    // Set the program outcomes for the selected course
    if (e.target.value) {
      const selectedProgramOutcomes = programData.program_outcomes[e.target.value] || [];
      setProgram(selectedProgramOutcomes); // Store the selected program outcomes
    } else {
      setProgram([]); // Clear program outcomes if no course is selected
    }
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

  const handleOutcomesSubmit = async () => {
    try {
        const programOutcomes = program; 
        const courseOutcomes = filteredCourses
            .flatMap(course => course.outcomes) // Access outcomes correctly
            .filter(outcome => outcome !== null); // Exclude null outcomes

        if (!programOutcomes.length || !courseOutcomes.length) {
            console.error('Missing program or course outcomes');
            return; // Prevent empty request
        }

        const response = await fetch('https://5000-sagar999-copomapper-sasdici9ljh.ws-us116.gitpod.io/map_outcomes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                program_outcomes: programOutcomes,
                course_outcomes: courseOutcomes,
            }),
        });

        const mappingData = await response.json();
        console.log(mappingData);
       await setCoPoMatrixData(mappingData.mapping);

    } catch (error) {
        console.error('Error while fetching CO-PO Mapping:', error);
    }
};

  const fetchCoPoMatrixData = async () => {
    try {
      const response = await fetch('/path_to_your_api');
      const data = await response.json();
      setCoPoMatrixData(data); // Make sure this is structured correctly
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  fetchCoPoMatrixData();

const handleSubject = (e) => {
  setSubject(e.target.value);
  filterCourses(semester, e.target.value);
  if (semester && e.target.value) {
      handleOutcomesSubmit();
  }
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
      program: program, 
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


  const handleSwitch = () => {
    toggleSwitch((prev) => !prev);
  };

  return (
    <main className={`form-container ${program.length ? 'form-left' : 'form-centered'}`}>
      <div className="main-border">
        <div className="form-fields">
          <label className="fields">
            Instructor&apos;s Name:
            <input 
              type='text' 
              value={instructorName} 
              onChange={(e) => setInstructorName(e.target.value)} 
              placeholder={placeholder} 
              onFocus={() => setPlaceholder('')} 
              onBlur={() => setPlaceholder('Enter a Name')}
            />
          </label>

          <label className="fields">
            Program:
            <select name="course" value={course} onChange={handleProgram}>
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

          <button onClick={generateReport} style={{ border: '1px solid var(--text-color)' }}>
            Generate Report
          </button>

          <label className="switch">
            Allow editing
            <input onClick={handleSwitch} type="checkbox" value={isSwitchOn} />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="tables-container tables-right">
        <Table 
          program={program} 
          programName={course} 
          editable={isSwitchOn} 
          setProgramOutcomes={setProgram}
        />

        <Table 
          courses={filteredCourses} 
          editable={isSwitchOn} 
          setFilteredCourses={setFilteredCourses}
        />

{console.log("Length"+coPoMatrixData.length)}
        {coPoMatrixData.length>0 && (
          <CoPoMatrixTable 
            selectedCourse={subject} 
            selectedProgram={course} 
            coPoMatrixData={coPoMatrixData} 
          />
        )}
      </div>
    </main>
  );
};
