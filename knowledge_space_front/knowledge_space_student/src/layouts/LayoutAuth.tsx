import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import {
  Box,
  CssBaseline,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  styled,
} from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import useAuthStore from "@stores/authStore";
import { AccountCircle } from "@mui/icons-material";
import { useNotificationStore } from "@stores/notificationStore";
import Notification from "@ui/Notification";
import { USER_KEY } from "@api/auth";
const drawerWidth = 240;

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function LayoutAuth() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const { isOpen, data, closeNotification } = useNotificationStore();

  const { isValid, deleteUser } = useAuthStore((state) => state);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    {
      deleteUser();
      localStorage.removeItem(USER_KEY);
      sessionStorage.removeItem(USER_KEY);
    }
  };
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => closeNotification(), 3000);
    }
  }, [isOpen]);

  if (!isValid) {
    return <Navigate to={"/login"} replace={true} />;
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar
          sx={{
            pr: "24px",
          }}
        >
          <Typography variant="h6" noWrap component="h1" color="inherit">
            KST
          </Typography>
          <Box component="div" sx={{ ml: "auto" }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {/* content */}
        <Outlet />
        <Notification
          isShowing={isOpen}
          primaryText={data.primaryText}
          secondaryText={data.secondaryText}
          isError={data.isError}
          closeNotification={closeNotification}
        />
      </Box>
    </Box>
  );
}
