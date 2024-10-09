import { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";

export const CourseProgramManager = ({ course, semester, subject, setFilteredCourses, setSubjectOptions }) => {
  const [programOutcomes, setProgramOutcomes] = useState([]);
  const [courseOutcomes, setCourseOutcomes] = useState({});

  useEffect(() => {
    if (course && semester && subject) {
      fetchCourseOutcomes();
      fetchProgramOutcomes();
    }
  }, [course, semester, subject]);

  const fetchCourseOutcomes = async () => {
    try {
      const response = await axios.get(`/get_course/${subject}`);
      if (response.data) {
        setCourseOutcomes(response.data);
      }
    } catch (error) {
      console.error("Error fetching course outcomes:", error);
    }
  };

  const fetchProgramOutcomes = async () => {
    try {
      const response = await axios.get(`/get_program/${course}`);
      if (response.data) {
        setProgramOutcomes(response.data);
      }
    } catch (error) {
      console.error("Error fetching program outcomes:", error);
    }
  };

  return (
    <div>
      <h2>Program Outcomes for {course}</h2>
      <ul>
        {programOutcomes.map((po, index) => (
          <li key={index}>{po}</li>
        ))}
      </ul>

      <h2>Course Outcomes for {subject}</h2>
      <ul>
        {courseOutcomes.outcomes && courseOutcomes.outcomes.map((co, index) => (
          <li key={index}>{co}</li>
        ))}
      </ul>
    </div>
  );
};

CourseProgramManager.propTypes = {
    course: PropTypes.string.isRequired,
    semester: PropTypes.string.isRequired,
    subject: PropTypes.string.isRequired,
    setFilteredCourses: PropTypes.func.isRequired,
    setSubjectOptions: PropTypes.func.isRequired,
  };