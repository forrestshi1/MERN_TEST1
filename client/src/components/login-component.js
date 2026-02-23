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
  Alert,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const LoginComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setMessage("");
    AuthService.login(email, password)
      .then((response) => {
        localStorage.setItem("user", JSON.stringify(response.data));
        window.alert("登录成功。您现在将被重定向到个人资料页面。");
        setCurrentUser(AuthService.getCurrentUser());
        navigate("/profile");
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
          会员登录
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
            id="email"
            label="电子邮箱"
            name="email"
            autoComplete="email"
            autoFocus
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
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Box sx={{ position: "relative" }}>
            <Button
              type="button"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
              disabled={loading}
            >
              登录
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

export default LoginComponent;