import { useState } from "react";
import bsc_cs from "../json/bsc_cs.json";
import bsc_it from "../json/bsc_it.json";
import msc_it from "../json/msc_it.json";
import programData from "../json/program.json";
import { CoPoMatrixTable } from "./CoPoMatrixTable";
import { generateExcel, generateDoc, generatePDF } from "./reportGenerator"; 
import PropTypes from 'prop-types';

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
    
    if (e.target.value) {
      const selectedProgramOutcomes = programData.program_outcomes[e.target.value] || [];
      setProgram(selectedProgramOutcomes);
    } else {
      setProgram([]); 
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
            .flatMap(course => course.outcomes) 
            .filter(outcome => outcome !== null); 

        if (!programOutcomes.length || !courseOutcomes.length) {
            console.error('Missing program or course outcomes');
            return; 
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
       await setCoPoMatrixData(mappingData.mapping);

    } catch (error) {
        console.error('Error while fetching CO-PO Mapping:', error);
    }
};


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
      programName:course,
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
          <button onClick={handleOutcomesSubmit} style={{border: '1px solid var(--text-color)' }}>
        Remap Outcomes
      </button>
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

const Table = ({ courses = [], program = [], programName = "", editable, setProgramOutcomes, setFilteredCourses }) => {
  const handleProgramChange = (e, index) => {
    console.log("Change detected");
    const updatedProgram = [...program];
    updatedProgram[index] = e.target.value;
    setProgramOutcomes(updatedProgram); 
  };

  const handleCourseOutcomeChange = (e, courseIndex, outcomeIndex) => {
    const updatedCourses = [...courses];
    updatedCourses[courseIndex].outcomes[outcomeIndex] = e.target.value;
    setFilteredCourses(updatedCourses); 
  };


  return (
    <>
      {courses.length > 0 && (
        <table className="course-table">
          <thead>
            <tr>
              {courses.length !== 1 && <th>Sr no</th>}
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Outcomes</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={course.id} style={{width: "fit-content"}}>
                {courses.length > 1 && <td style={{ textAlign: "center" }}>{index + 1}</td>}
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>
                  <ul>
                    {course.outcomes.map((outcome, outcomeIdx) => (
                      editable ? (
                        <li key={outcomeIdx} style={{listStyle: 'none'}}>
                          <input
                            value={outcome}
                            onChange={(e) => handleCourseOutcomeChange(e, index, outcomeIdx)}
                            className='editable-input'
                          />
                        </li>
                      ) : (
                        <li className='static-outcome' key={outcomeIdx}>
                          {outcome}
                        </li>
                      )
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {program.length > 0 && (
        <table className="program-table">
          <thead>
            <tr>
              <th style={{width: '10%'}}>Sr no</th>
              <th>{programName} Program Outcomes</th>
            </tr>
          </thead>
          <tbody>
          {program.map((outcome, index) => (
            <tr key={index}>
              <td style={{ textAlign: "center" }}>{index + 1}</td>
              <td>
                {editable ? (
                  <input
                    className="editable-input"
                    value={outcome}
                    onChange={(e) => handleProgramChange(e, index)}
                  />
                ) : (
                  <span className="static-outcome" style={{display: "block"}}>{outcome}</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      )}
    </>
  );
};

Table.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      outcomes: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ),
  program: PropTypes.arrayOf(PropTypes.string),
  programName: PropTypes.string,
  editable: PropTypes.bool.isRequired,
  setProgramOutcomes: PropTypes.func,
  setFilteredCourses: PropTypes.func
};

