import React, { useEffect, useState } from 'react';
import './CourseCatalog.css';


const Course = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Replace with your API endpoint
        fetch('/api/courses')
            .then((res) => res.json())
            .then((data) => {
                setCourses(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return <div>Loading courses...</div>;
    }

    return (
        <div>
            <h1>Courses</h1>
            {courses.length === 0 ? (
                <p>No courses available.</p>
            ) : (
                <ul>
                    {courses.map((course) => (
                        <li key={course.id}>
                            <h2>{course.title}</h2>
                            <p>{course.description}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Course;