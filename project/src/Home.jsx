import { useState, useCallback, useEffect } from "react";
import { CoPoMatrixTable } from "./CoPoMatrixTable";
import { Table } from "./Table";
import { generateExcel, generateDoc, generatePDF } from "./reportGenerator";

export const Home = () => {
  const [course, setCourse] = useState("");
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [isProgramSelected, setProgramSelected] = useState(false);
  const [docFormat, setDocFormat] = useState("");
  const [placeholder, setPlaceholder] = useState("Enter a Name");
  const [instructorName, setInstructorName] = useState("");
  const [coPoMatrixData, setCoPoMatrixData] = useState([]);
  const [isSwitchOn, toggleSwitch] = useState(true);
  const [programOutcomes, setProgramOutcomes] = useState([]);
  const [filteredProgramOutcomes, setFilteredProgramOutcomes] = useState([]);
  const [filteredCourseOutcomes, setFilteredCourseOutcomes] = useState([]);

  useEffect(() => {
    const fetchProgramOutcomes = async () => {
      if (course) {
        try {
          const response = await fetch(`https://5000-sagar999-copomapper-sasdici9ljh.ws-us116.gitpod.io/get_program/${encodeURIComponent(course)}`);
          if (!response.ok) {
            throw new Error(`Error fetching program data: ${response.statusText}`);
          }
          const data = await response.json();
          setProgramOutcomes(data.outcomes || []);
        } catch (error) {
          console.error(error);
          setProgramOutcomes([]); 
        }
      }
    };

    fetchProgramOutcomes();
  }, [course]);

  const fetchCourseOutcomes = async (subjectName) => {
    if (course && subjectName) {
      try {
        const response = await fetch(`https://5000-sagar999-copomapper-sasdici9ljh.ws-us116.gitpod.io/get_course/${encodeURIComponent(subjectName)}`);
        if (!response.ok) {
          throw new Error(`Error fetching course data: ${response.statusText}`);
        }
        const data = await response.json();
        setFilteredCourseOutcomes(data.outcomes || []);
        setSubjectOptions(data.outcomes.map((course) => course.name));
      } catch (error) {
        console.error(error);
        setFilteredCourseOutcomes([]); // Reset course outcomes on error
        setSubjectOptions([]); // Reset subject options in case of error
      }
    }
  };

  // Use the consolidated function for useEffect when both course and subject are selected
  useEffect(() => {
    if (course && subject) {
      fetchCourseOutcomes(subject);
    }
  }, [course, subject]);

  const handleCourse = (e) => {
    setCourse(e.target.value);
    setSemester("");
    setSubject("");
    setSubjectOptions([]);
    setProgramSelected(!!e.target.value);
  };

  const handleSemester = (e) => {
    setSemester(e.target.value);
    handleFetchCourses(); // Call handleFetchCourses on semester change
  };

  const handleFetchCourses = () => {
    // Only proceed if both course and subject are selected
    if (course && subject) {
      fetchCourseOutcomes(subject);
    }
  };

  const handleSubject = (e) => {
    setSubject(e.target.value);
    fetchCourseOutcomes(e.target.value); // Fetch outcomes when subject is selected
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
      program: programOutcomes,
      courses: filteredCourseOutcomes,
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

  const handleCoPoMatrixData = useCallback((coPoData) => {
    setCoPoMatrixData(coPoData);
  }, []);

  const handleSwitch = () => {
    toggleSwitch(prev => !prev);
  };

  const handleOutcomesSubmit = (courseOutcomes, programOutcomes) => {
    const requestBody = {
      program: course,
      course_outcomes: courseOutcomes,
      program_outcomes: programOutcomes,
    };
    console.log(requestBody);

    fetch(`https://5000-sagar999-copomapper-sasdici9ljh.ws-us116.gitpod.io/map-outcomes/${encodeURIComponent(course)}/${encodeURIComponent(subject)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
    .then((response) => response.json())
    .then((data) => {
      setCoPoMatrixData(data);
      console.log(data);
    })
    .catch((error) => {
      console.error("Error fetching mapping:", error);
    });
  };

  return (
    <main className={`form-container ${isProgramSelected ? 'form-left' : 'form-centered'}`}>
      <div className="main-border">
        <div className="form-fields">
          <label className="fields">
            Instructor&apos;s Name:
            <input
              autoComplete="true"
              name="name"
              type="text"
              value={instructorName}
              onChange={(e) => setInstructorName(e.target.value)}
              placeholder={placeholder}
              onFocus={() => setPlaceholder('')}
              onBlur={() => setPlaceholder('Enter a Name')}
            />
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
          <label className="switch">
            <span>Allow editing</span>
            <input onClick={handleSwitch} name="switch" type="checkbox" value={isSwitchOn} />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      <div className="tables-container">
        <Table
          program={filteredProgramOutcomes}
          courses={filteredCourseOutcomes}
          programName={course}
          isEditable={isSwitchOn}
          onSubmit={handleOutcomesSubmit}
        />
        <CoPoMatrixTable
          program={course}
          semester={semester}
          course={subject}
          data={coPoMatrixData}
          onCoPoMatrixUpdate={handleCoPoMatrixData}
        />
      </div>
    </main>
  );
};
