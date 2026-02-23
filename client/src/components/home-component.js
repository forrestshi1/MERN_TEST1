import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Icon,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import CodeIcon from "@mui/icons-material/Code";
import StorageIcon from "@mui/icons-material/Storage";
import SecurityIcon from "@mui/icons-material/Security";

const HomeComponent = () => {
  const navigate = useNavigate();

  const FeatureCard = ({ icon, title, description, buttonText, buttonAction, variant = "contained" }) => (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        textAlign: "center",
        background: variant === 'contained' ? 'linear-gradient(145deg, #6e8efb, #a777e3)' : 'transparent',
        color: variant === 'contained' ? '#fff' : 'inherit',
        border: variant !== 'contained' ? '1px solid #ddd' : 'none'
      }}
    >
      <Box sx={{ fontSize: "3rem", mb: 2 }}>{icon}</Box>
      <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Typography sx={{ flexGrow: 1, mb: 3, opacity: 0.9 }}>
        {description}
      </Typography>
      <Button
        variant={variant === 'contained' ? 'light' : 'contained'}
        size="large"
        onClick={buttonAction}
        sx={{ 
          backgroundColor: variant === 'contained' ? 'rgba(255,255,255,0.9)' : 'primary.main',
          color: variant === 'contained' ? 'primary.main' : '#fff',
          '&:hover': {
            backgroundColor: variant === 'contained' ? '#fff' : 'primary.dark',
          }
        }}
      >
        {buttonText}
      </Button>
    </Paper>
  );

  const TechItem = ({ icon, title, description }) => (
    <Box textAlign="center">
      <Icon color="primary" sx={{ fontSize: 40, mb: 1 }}>{icon}</Icon>
      <Typography variant="h6" component="strong">{title}</Typography>
      <Typography variant="body2" color="text.secondary">{description}</Typography>
    </Box>
  );

  return (
    <Box component="main" sx={{ flexGrow: 1, py: 6, backgroundColor: '#f9f9f9' }}>
      <Container maxWidth="lg">
        {/* Hero Section */}
        <Box
          sx={{
            textAlign: "center",
            py: 10,
            mb: 8,
            borderRadius: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: "#fff",
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
          }}
        >
          <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
            📚 学习系统
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4, maxWidth: "700px", mx: "auto", opacity: 0.9 }}>
            本系统使用 <strong>React.js</strong> 作为前端框架，
            <strong>Node.js</strong>、<strong>MongoDB</strong> 作为后端服务器。
            这种项目称为 <strong>MERN</strong> 项目，是创建现代网站最流行的方式之一。
          </Typography>
          <Button
            variant="contained"
            size="large"
            startIcon={<RocketLaunchIcon />}
            onClick={() => navigate("/course")}
            sx={{ 
              py: 1.5, 
              px: 4, 
              fontSize: '1.1rem', 
              backgroundColor: '#fff', 
              color: 'primary.main',
              '&:hover': { backgroundColor: '#eee' }
            }}
          >
            开始探索课程
          </Button>
        </Box>

        {/* Feature Cards */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          <Grid item xs={12} md={6}>
            <FeatureCard
              icon={<SchoolIcon sx={{ fontSize: 50 }} />}
              title="作为一个学生"
              description="学生可以注册他们喜欢的课程。本网站仅供练习之用，请勿提供任何个人资料，例如信用卡号码。"
              buttonText="✨ 立即注册或登录"
              buttonAction={() => navigate("/register")}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FeatureCard
              icon={<CastForEducationIcon sx={{ fontSize: 50, color: '#fff' }} />}
              title="作为一个导师"
              description="您可以通过注册成为一名讲师，并开始制作在线课程。本网站仅供练习之用，请勿提供任何个人资料。"
              buttonText="🎯 开始创建课程"
              buttonAction={() => navigate("/postCourse")}
              variant="contained"
            />
          </Grid>
        </Grid>

        {/* Tech Stack Section */}
        <Box sx={{ mb: 8 }}>
          <Typography variant="h4" component="h3" fontWeight="bold" textAlign="center" gutterBottom>
            🛠️ 技术栈
          </Typography>
          <Grid container spacing={4} justifyContent="center" sx={{ mt: 2 }}>
            <Grid item xs={6} md={3}><TechItem icon={<CodeIcon />} title="React.js" description="前端框架" /></Grid>
            <Grid item xs={6} md={3}><TechItem icon={<Icon>🟢</Icon>} title="Node.js" description="后端运行环境" /></Grid>
            <Grid item xs={6} md={3}><TechItem icon={<StorageIcon />} title="MongoDB" description="数据库" /></Grid>
            <Grid item xs={6} md={3}><TechItem icon={<SecurityIcon />} title="JWT" description="身份认证" /></Grid>
          </Grid>
        </Box>

        {/* Footer */}
        <Box component="footer" sx={{ pt: 4, mt: 5, textAlign: "center", borderTop: "1px solid #ddd" }}>
          <Typography variant="body1" fontWeight="bold">
            MERN 学习系统
          </Typography>
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} forrest. 本网站仅供学习练习使用。
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default HomeComponent;