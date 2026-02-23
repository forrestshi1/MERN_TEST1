import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";

// MUI Imports
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";

const NavComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthService.logout();
    window.alert("登出成功!现在您会被导向到首页。");
    setCurrentUser(null);
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primary">
        <Toolbar>
          <SchoolIcon sx={{ mr: 2 }} />
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, color: "inherit", textDecoration: "none" }}
          >
            学习系统
          </Typography>

          <Button color="inherit" component={Link} to="/">
            首页
          </Button>

          {!currentUser && (
            <>
              <Button color="inherit" component={Link} to="/register">
                注册会员
              </Button>
              <Button color="inherit" component={Link} to="/login">
                会员登录
              </Button>
            </>
          )}

          {currentUser && (
            <>
              <Button color="inherit" component={Link} to="/profile">
                个人页面
              </Button>
              <Button color="inherit" component={Link} to="/course">
                课程页面
              </Button>
              {currentUser.user.role === "instructor" && (
                <Button color="inherit" component={Link} to="/postCourse">
                  新增课程
                </Button>
              )}
              {currentUser.user.role === "student" && (
                <Button color="inherit" component={Link} to="/enroll">
                  注册课程
                </Button>
              )}
              <Button color="inherit" onClick={handleLogout}>
                登出
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavComponent;