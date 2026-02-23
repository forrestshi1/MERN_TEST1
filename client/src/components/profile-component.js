import React from "react";
import { useNavigate } from "react-router-dom";

// MUI Imports
import {
  Container,
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import EmailIcon from "@mui/icons-material/Email";
import SchoolIcon from "@mui/icons-material/School";

const ProfileComponent = ({ currentUser, setCurrentUser }) => {
  const navigate = useNavigate();

  const handleTakeToLogin = () => {
    navigate("/login");
  };

  return (
    <Container component="main" maxWidth="md" sx={{ py: 5 }}>
      {!currentUser && (
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h5" gutterBottom>
            在获取您的个人资料之前，您必须先登录。
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
      )}
      {currentUser && (
        <Card sx={{ boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom>
              个人档案
            </Typography>
            <List>
              <ListItem>
                <ListItemIcon>
                  <AccountCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="姓名"
                  secondary={currentUser.user.username}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <VpnKeyIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="用户ID"
                  secondary={currentUser.user._id}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <EmailIcon color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="电子邮箱"
                  secondary={currentUser.user.email}
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <SchoolIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary="身份" secondary={currentUser.user.role} />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default ProfileComponent;