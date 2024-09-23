import { useState } from "react";
import PropTypes from 'prop-types';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';

const ClassDropdown = ({ selectedClass, onClassChange, classes }) => {
  return (
    <label className="fields">
      Class:
      <select value={selectedClass} onChange={onClassChange}>
        <option value="">Select a class</option>
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
  selectedClass: PropTypes.string.isRequired,
  onClassChange: PropTypes.func.isRequired, 
  classes: PropTypes.array.isRequired
};

export const Home = () => {
  const [username, setUsername] = useState("");
  const [course, setCourse] = useState("");
  const [class1, setClass1] = useState("");
  const [semester, setSemester] = useState("");
  const [program, setProgram] = useState("");
  const navigate = useNavigate();

  const handleCourse = (e) => {
    setCourse(e.target.value);
    setClass1(''); 
  };

  const handleClass = (e) => {
    setClass1(e.target.value);
  };

  const exportToExcel = () => {
    const data = [{
      Username: username,
      Course: course,
      Class: class1,
      Semester: semester,
      Program: program,
    }];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Form Data");
    XLSX.writeFile(wb, "form_data.xlsx");
  };

  const getClassesForCourse = () => {
    switch (course) {
      case 'BSc DS':
        return ['First Year', 'Second Year', 'Third Year'];
      case 'BSc IT':
        return ['First Year', 'Second Year'];
      case 'BSc CS':
        return ['First Year', 'Second Year', 'Third Year'];
      case 'MSc CS':
        return ['First Year', 'Second Year'];
      default:
        return [];
    }
  };

  const classes = getClassesForCourse();

  return (
    <>
      <main>
        <label className="fields">
          Course Instructor:
          <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" />
        </label>
        
        <label className="fields">
          Course Name:
          <select value={course} onChange={handleCourse}>
            <option value="">Select a course</option>
            <option value="BSc DS">BSc DS</option>
            <option value="BSc IT">BSc IT</option>
            <option value="BSc CS">BSc CS</option>
            <option value="MSc CS">MSc CS</option>
          </select>
        </label>
        
        {course && (
          <ClassDropdown 
            selectedClass={class1} 
            onClassChange={handleClass} 
            classes={classes} 
          />
        )}

        <label className="fields">
          Semester:
          <select value={semester} onChange={(e) => setSemester(e.target.value)}>
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
          Program Name:
          <select value={program} onChange={(e) => setProgram(e.target.value)}>
            <option value="">Select a program</option>
            <option value="Java">Java</option>
            <option value="Python">Python</option>
            <option value="CSS">CSS</option>
            <option value="HTML">HTML</option>
          </select>
        </label>

        <div>
          <p>Selected Course: {course}</p>
          <p>Selected Class: {class1}</p>
          <p>Selected Semester: {semester}</p>
          <p>Selected Program: {program}</p>
        </div>
        
        <button onClick={exportToExcel}>Export to Excel</button>
      </main>
      
      <div>
        You can log in to your account for more features.
        <button onClick={() => navigate('/login')} role="button" tabIndex={0}>Log in</button>
      </div>
    </>
  );
};
