import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

// MUI Imports
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CircularProgress,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";

const CourseComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleTakeToLogin = () => {
    navigate("/login");
  };

  useEffect(() => {
    let _id;
    if (currentUser) {
      _id = currentUser.user._id;
      const service =
        currentUser.user.role === "instructor"
          ? CourseService.get(_id)
          : CourseService.getEnrolledCourses(_id);

      service
        .then((data) => {
          setCourseData(data.data);
        })
        .catch((e) => {
          console.error(e); // Use console.error for errors
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const renderNotLoggedIn = () => (
    <Box textAlign="center" mt={10}>
      <Typography variant="h4" gutterBottom>
        您必須先登入才能看到課程。
      </Typography>
      <Button variant="contained" color="primary" size="large" onClick={handleTakeToLogin}>
        回到登入頁面
      </Button>
    </Box>
  );

  const renderWelcomeMessage = () => (
    <Box display="flex" alignItems="center" mb={4}>
      {currentUser.user.role === "instructor" ? (
        <SchoolIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
      ) : (
        <PersonIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
      )}
      <Typography variant="h4">
        {currentUser.user.role === "instructor"
          ? "歡迎來到講師的課程頁面"
          : "歡迎來到學生的課程頁面"}
      </Typography>
    </Box>
  );

  const renderCourseGrid = () => (
    <Grid container spacing={4}>
      {courseData.map((course) => (
        <Grid item xs={12} sm={6} md={4} key={course._id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography gutterBottom variant="h5" component="h2">
                {course.title}
              </Typography>
              <Typography color="text.secondary" paragraph>
                {course.description}
              </Typography>
              <Box mt={2}>
                <Typography variant="body2">
                  <strong>學生人數:</strong> {course.students.length}
                </Typography>
                <Typography variant="body2">
                  <strong>課程價格:</strong> ${course.price}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {!currentUser ? (
        renderNotLoggedIn()
      ) : (
        <>
          {renderWelcomeMessage()}
          {courseData && courseData.length > 0 ? (
            renderCourseGrid()
          ) : (
            <Typography variant="subtitle1" mt={4}>
              目前沒有任何課程。
            </Typography>
          )}
        </>
      )}
    </Container>
  );
};

export default CourseComponent;