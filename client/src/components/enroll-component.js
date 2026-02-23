import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

// MUI Imports
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Card,
  CardContent,
  CardActions,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const EnrollComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTakeToLogin = () => {
    navigate("/login");
  };

  const handleSearch = () => {
    if (!searchInput) return;
    setLoading(true);
    CourseService.getCourseByName(searchInput)
      .then((data) => {
        setSearchResult(data.data);
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleEnroll = (e) => {
    CourseService.enroll(e.currentTarget.id)
      .then(() => {
        window.alert("课程注册成功!! 即将重新导向到课程页面。");
        navigate("/course");
      })
      .catch((e) => {
        console.log(e);
        window.alert(e.response.data || "注册失败，请稍后再试。");
      });
  };

  const renderNotLoggedIn = () => (
    <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        您必须先登录才能开始注册课程。
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="large"
        onClick={handleTakeToLogin}
      >
        回到登录页面
      </Button>
    </Paper>
  );

  const renderNotStudent = () => (
    <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h5">只有学生才能注册课程。</Typography>
    </Paper>
  );

  const renderSearch = () => (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        注册课程
      </Typography>
      <TextField
        fullWidth
        label="搜索课程名称"
        variant="outlined"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch} edge="end">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );

  const renderSearchResult = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        搜索结果
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : searchResult && searchResult.length > 0 ? (
        <Grid container spacing={4}>
          {searchResult.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 3 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="h2">
                    {course.title}
                  </Typography>
                  <Typography color="text.secondary" paragraph>
                    {course.description}
                  </Typography>
                  <Typography variant="body2">
                    <strong>讲师:</strong> {course.instructor.username}
                  </Typography>
                  <Typography variant="body2">
                    <strong>学生人数:</strong> {course.students.length}
                  </Typography>
                  <Typography variant="body2">
                    <strong>课程价格:</strong> ${course.price}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    variant="contained"
                    id={course._id}
                    onClick={handleEnroll}
                  >
                    注册课程
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>没有找到课程。</Typography>
      )}
    </Box>
  );

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 5 }}>
      {!currentUser
        ? renderNotLoggedIn()
        : currentUser.user.role !== "student"
        ? renderNotStudent()
        : (
          <>
            {renderSearch()}
            {searchResult !== null && renderSearchResult()}
          </>
        )}
    </Container>
  );
};

export default EnrollComponent;