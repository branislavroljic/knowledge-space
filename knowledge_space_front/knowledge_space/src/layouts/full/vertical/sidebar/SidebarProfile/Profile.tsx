import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  useMediaQuery,
} from "@mui/material";

import ProfileImg from "/src/assets/images/user-1.jpg";
import { IconPower } from "@tabler/icons-react";
import useAuthStore from "@stores/authStore";
import { USER_KEY } from "@api/auth";
import { useCustomizerStore } from "@stores/customizerStore";

export const Profile = () => {
  const { user, deleteUser } = useAuthStore((state) => state);

  const customizer = useCustomizerStore((state) => state);
  const lgUp = useMediaQuery((theme: any) => theme.breakpoints.up("lg"));
  const hideMenu = lgUp
    ? customizer.isCollapse && !customizer.isSidebarHover
    : "";

  const handleLogout = () => {
    {
      deleteUser();
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(USER_KEY);
    }
  };

  return (
    <Box
      display={"flex"}
      alignItems="center"
      gap={2}
      sx={{ m: 3, p: 2, bgcolor: `${"secondary.light"}` }}
    >
      {!hideMenu ? (
        <>
          <Avatar src={ProfileImg} alt={ProfileImg} />

          <Box>
            <Typography variant="h6">
              {user?.role == "PROFESSOR" ? "Professor" : "Student"}{" "}
            </Typography>
          </Box>
          <Box sx={{ ml: "auto" }}>
            <Tooltip title={"Logout"} placement="top">
              <IconButton
                color="primary"
                onClick={handleLogout}
                aria-label="logout"
                size="small"
              >
                <IconPower size="20" />
              </IconButton>
            </Tooltip>
          </Box>
        </>
      ) : (
        ""
      )}
    </Box>
  );
};
