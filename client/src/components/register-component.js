import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

// MUI Imports
import {
  Container,
  Box,
  Paper,
  Avatar,
  Typography,
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Alert,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const RegisterComponent = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Default to student
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    setLoading(true);
    setMessage("");
    AuthService.register(username, email, password, role)
      .then(() => {
        window.alert("注册成功。您现在将被导向到登录页面");
        navigate("/login");
      })
      .catch((e) => {
        setMessage(e.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          注册会员
        </Typography>
        <Box component="form" noValidate sx={{ mt: 3 }}>
          {message && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {message}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="用户名称"
            name="username"
            autoComplete="username"
            autoFocus
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="电子邮箱"
            name="email"
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="密码"
            type="password"
            id="password"
            autoComplete="new-password"
            helperText="长度至少超过6个英文或数字"
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControl component="fieldset" margin="normal">
            <FormLabel component="legend">身份</FormLabel>
            <RadioGroup
              row
              aria-label="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <FormControlLabel
                value="student"
                control={<Radio />}
                label="学生"
              />
              <FormControlLabel
                value="instructor"
                control={<Radio />}
                label="讲师"
              />
            </RadioGroup>
          </FormControl>
          <Box sx={{ position: "relative" }}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleRegister}
              disabled={loading}
            >
              注册
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
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterComponent;