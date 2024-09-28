import { useState } from "react";
import PropTypes from 'prop-types';
import bsc_cs from '../json/bsc_cs.json';
import bsc_it from '../json/bsc_it.json';
import msc_it from '../json/msc_it.json';

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
  classes: PropTypes.array.isRequired
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
    setYear('');
    setSemester('');
    setSubject('');
    setFilteredCourses([]);
    setSubjectOptions([]);
  };

  const handleYear = (e) => {
    setYear(e.target.value);
    setSemester('');
    setSubject('');
    setFilteredCourses([]);
    setSubjectOptions([]);
  };

  const handleSemester = (e) => {
    setSemester(e.target.value);
    filterCourses(e.target.value);
  };

  const filterCourses = (semester) => {
    let programData;

    if (course && year) { // Check if course and year are selected
        // Find the correct syllabus based on syllabus year
        const syllabus = msc_it.syllabi.find(s => s.syllabus_year === "2015-2016"); // Replace with the appropriate syllabus year if necessary
        
        if (syllabus) {
            switch (course) {
                case 'BSc CS':
                    programData = bsc_cs.program.find((program) => program.year === year && program.semester === semester);
                    break;
                case 'BSc IT':
                    programData = bsc_it.program.find((program) => program.year === year && program.semester === semester);
                    break;
                case 'MSc IT':
                    programData = syllabus.program.find((program) => program.year === year && program.semester === semester);
                    break;
                default:
                    programData = null;
            }
        }
    }

    if (programData) {
        setFilteredCourses(programData.courses);
        setSubjectOptions(programData.courses.map(course => course.name));
    } else {
        setFilteredCourses([]); 
        setSubjectOptions([]);
    }
};

  const handleSubject = (e) => {
    setSubject(e.target.value);
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
  courses: PropTypes.array.isRequired
};
