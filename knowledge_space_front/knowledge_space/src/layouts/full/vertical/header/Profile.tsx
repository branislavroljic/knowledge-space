import { useState } from "react";
import {
  Box,
  Menu,
  Avatar,
  Typography,
  Divider,
  Button,
  IconButton,
  Stack,
  Tooltip,
} from "@mui/material";

import { IconMail } from "@tabler/icons-react";

import ProfileImg from "/src/assets/images/user-1.jpg";
import { USER_KEY } from "@api/auth";
import useAuthStore from "@stores/authStore";

const Profile = () => {
  const [anchorEl2, setAnchorEl2] = useState(null);
  const { user, deleteUser } = useAuthStore((state: any) => state);

  const handleClick2 = (event: any) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const handleLogout = () => {
    {
      deleteUser();
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(USER_KEY);
    }
  };

  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show_notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === "object" && {
            color: "primary.main",
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={ProfileImg}
          alt={ProfileImg}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        sx={{
          "& .MuiMenu-paper": {
            width: "360px",
            p: 4,
          },
        }}
      >
        <Typography variant="h5">{"User profile"}</Typography>
        <Stack direction="row" py={3} spacing={2} alignItems="center">
          <Avatar
            src={ProfileImg}
            alt={user?.firstname}
            sx={{ width: 95, height: 95 }}
          />
          <Box>
            <Tooltip title={user?.email} enterDelay={500}>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                display="flex"
                alignItems="center"
                gap={1}
                style={{ wordWrap: "break-word" }}
              >
                <IconMail />
                {user?.email}
              </Typography>
            </Tooltip>
          </Box>
        </Stack>
        <Divider />
        <Box mt={2}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleLogout}
            fullWidth
          >
            {"Logout"}
          </Button>
        </Box>
      </Menu>
    </Box>
  );
};

export default Profile;
