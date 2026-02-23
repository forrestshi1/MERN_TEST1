import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseService from "../services/course.service";

// MUI Imports
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";

const PostCourseComponent = (props) => {
  let { currentUser, setCurrentUser } = props;
  let [title, setTitle] = useState("");
  let [description, setDescription] = useState("");
  let [price, setPrice] = useState(0);
  let [message, setMessage] = useState("");
  let [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleTakeToLogin = () => {
    navigate("/login");
  };

  const postCourse = () => {
    setLoading(true);
    setMessage("");
    CourseService.post(title, description, price)
      .then(() => {
        window.alert("新课程已创建成功");
        navigate("/course");
      })
      .catch((error) => {
        console.log(error.response);
        setMessage(error.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderNotLoggedIn = () => (
    <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h5" gutterBottom>
        在发布新课程之前，您必须先登录。
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

  const renderNotInstructor = () => (
    <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
      <Typography variant="h5">只有讲师可以发布新课程。</Typography>
    </Paper>
  );

  const renderForm = () => (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
        新增课程
      </Typography>
      {message && (
        <Alert severity="warning" sx={{ width: "100%", mb: 2 }}>
          {message}
        </Alert>
      )}
      <TextField
        margin="normal"
        required
        fullWidth
        id="title"
        label="课程标题"
        name="title"
        autoFocus
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        multiline
        rows={4}
        id="description"
        label="内容"
        name="description"
        onChange={(e) => setDescription(e.target.value)}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="price"
        label="价格"
        type="number"
        id="price"
        onChange={(e) => setPrice(e.target.value)}
      />
      <Box sx={{ position: "relative", mt: 3 }}>
        <Button
          type="button"
          fullWidth
          variant="contained"
          onClick={postCourse}
          disabled={loading}
        >
          提交表单
        </Button>
        {loading && (
          <CircularProgress
            size={24}
            sx={{
              color: "primary.main",
              position: "absolute",
              top: "50%",
              left: "50%",
              marginTop: "-12px",
              marginLeft: "-12px",
            }}
          />
        )}
      </Box>
    </Paper>
  );

  return (
    <Container component="main" maxWidth="md" sx={{ py: 5 }}>
      {!currentUser
        ? renderNotLoggedIn()
        : currentUser.user.role !== "instructor"
        ? renderNotInstructor()
        : renderForm()}
    </Container>
  );
};

export default PostCourseComponent;