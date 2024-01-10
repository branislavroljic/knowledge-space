import { FC, useState } from 'react';
import {
  Fab,
  Drawer,
  Grid,
  Divider,
  styled,
  IconButton,
  Typography,
  Tooltip,
  Stack,
} from '@mui/material';
import Box, { BoxProps } from '@mui/material/Box';
import { IconX, IconSettings, IconCheck } from '@tabler/icons-react';
import WbSunnyTwoToneIcon from '@mui/icons-material/WbSunnyTwoTone';
import DarkModeTwoToneIcon from '@mui/icons-material/DarkModeTwoTone';
import ViewSidebarTwoToneIcon from '@mui/icons-material/ViewSidebarTwoTone';
import WebAssetTwoToneIcon from '@mui/icons-material/WebAssetTwoTone';
import { AppState, useDispatch, useSelector } from '../../../../store/Store';
import {
  setDarkMode,
  // setTheme,
  toggleSidebar,
} from '../../../../store/customizer/CustomizerSlice';
import Scrollbar from '@ui/custom-scroll/Scrollbar';
import { useCustomizerStore } from '@stores/customizerStore';
import { useTranslation } from 'react-i18next';

const SidebarWidth = '320px';
interface colors {
  id: number;
  bgColor: string;
  disp?: string;
}
const Customizer: FC = () => {
  const [showDrawer, setShowDrawer] = useState(false);
  const customizer = useCustomizerStore();
  const { t } = useTranslation();
  // const dispatch = useDispatch();
  // const open = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setShowDrawer(true);
  };

  // const handleClose = () => {
  //   setAnchorEl(null);
  // };

  // const dispatch = useDispatch();

  const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
    boxShadow: theme.shadows[8],
    padding: '20px',
    cursor: 'pointer',
    justifyContent: 'center',
    display: 'flex',
    transition: '0.1s ease-in',
    border: '1px solid rgba(145, 158, 171, 0.12)',
    '&:hover': {
      transform: 'scale(1.05)',
    },
  }));

  const thColors: colors[] = [
    {
      id: 1,
      bgColor: '#5D87FF',
      disp: 'BLUE_THEME',
    },
  ];

  return (
    <div>
      {/* ------------------------------------------- */}
      {/* --Floating Button to open customizer ------ */}
      {/* ------------------------------------------- */}
      {/* <Tooltip title="Settings">
        <Fab
          color="primary"
          aria-label="settings"
          sx={{ position: 'fixed', right: '25px', bottom: '15px' }}
          onClick={() => setShowDrawer(true)}
        >
          <IconSettings />
        </Fab>
      </Tooltip> */}
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? 'long-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <IconSettings />
      </IconButton>
      <Drawer
        anchor="right"
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
        PaperProps={{
          sx: {
            width: SidebarWidth,
          },
        }}
      >
        {/* ------------------------------------------- */}
        {/* ------------ Customizer Sidebar ------------- */}
        {/* ------------------------------------------- */}
        <Scrollbar sx={{ height: 'calc(100vh - 5px)' }}>
          <Box
            p={2}
            display="flex"
            justifyContent={'space-between'}
            alignItems="center"
          >
            <Typography variant="h4">{t('ui.settings')}</Typography>

            <IconButton color="inherit" onClick={() => setShowDrawer(false)}>
              <IconX />
            </IconButton>
          </Box>
          <Divider />
          <Box p={3}>
            {/* ------------------------------------------- */}
            {/* ------------ Dark light theme setting ------------- */}
            {/* ------------------------------------------- */}
            <Typography variant="h6" gutterBottom>
              {t('ui.themeOption')}
            </Typography>
            <Stack direction={'row'} gap={2} my={2}>
              <StyledBox
                onClick={() => customizer.setDarkMode('light')}
                display="flex"
                gap={1}
              >
                <WbSunnyTwoToneIcon
                  color={
                    customizer.activeMode === 'light' ? 'primary' : 'inherit'
                  }
                />
                Light
              </StyledBox>
              <StyledBox
                onClick={() => customizer.setDarkMode('dark')}
                display="flex"
                gap={1}
              >
                <DarkModeTwoToneIcon
                  color={
                    customizer.activeMode === 'dark' ? 'primary' : 'inherit'
                  }
                />
                Dark
              </StyledBox>
            </Stack>

            {/* <Box pt={3} /> */}
            {/* ------------------------------------------- */}
            {/* ------------ RTL theme setting -------------*/}
            {/* ------------------------------------------- */}
            {/* <Typography variant="h6" gutterBottom>
              Theme Direction
            </Typography>
            <Stack direction={'row'} gap={2} my={2}>
              <StyledBox
                onClick={() => dispatch(setDir('ltr'))}
                display="flex"
                gap={1}
              >
                <SwipeLeftAltTwoToneIcon
                  color={customizer.activeDir === 'ltr' ? 'primary' : 'inherit'}
                />{' '}
                LTR
              </StyledBox>
              <StyledBox
                onClick={() => dispatch(setDir('rtl'))}
                display="flex"
                gap={1}
              >
                <SwipeRightAltTwoToneIcon
                  color={customizer.activeDir === 'rtl' ? 'primary' : 'inherit'}
                />{' '}
                RTL
              </StyledBox>
            </Stack> */}

            <Box pt={3} />
            {/* ------------------------------------------- */}
            {/* ------------ Theme Color setting ------------- */}
            {/* ------------------------------------------- */}
            {/* <Typography variant="h6" gutterBottom>
              Theme Colors
            </Typography> */}
            {/* <Grid container spacing={2}>
              {thColors.map((thcolor) => (
                <Grid item xs={4} key={thcolor.id}>
                  <StyledBox onClick={() => dispatch(setTheme(thcolor.disp))}>
                    <Tooltip title={`${thcolor.disp}`} placement="top">
                      <Box
                        sx={{
                          backgroundColor: thcolor.bgColor,
                          width: '25px',
                          height: '25px',
                          borderRadius: '60px',
                          alignItems: 'center',
                          justifyContent: 'center',
                          display: 'flex',
                          color: 'white',
                        }}
                        aria-label={`${thcolor.bgColor}`}
                      >
                        {customizer.activeTheme === thcolor.disp ? (
                          <IconCheck />
                        ) : (
                          ''
                        )}
                      </Box>
                    </Tooltip>
                  </StyledBox>
                </Grid>
              ))} */}
            {/* </Grid> */}
            <Box pt={4} />
            {/* ------------------------------------------- */}
            {/* ------------ Layout Horizontal / Vertical ------------- */}
            {/* ------------------------------------------- */}
            {/* <Typography variant="h6" gutterBottom>
              Layout Type
            </Typography>
            <Stack direction={'row'} gap={2} my={2}>
              <StyledBox
                onClick={() => dispatch(toggleHorizontal(false))}
                display="flex"
                gap={1}
              >
                <ViewComfyTwoTone color={'primary'} />
                Vertical
              </StyledBox>
            </Stack> */}
            <Box pt={4} />
            {/* ------------------------------------------- */}
            {/* ------------ Layout Boxed / Full ------------- */}
            {/* ------------------------------------------- */}
            {/* <Typography variant="h6" gutterBottom>
              Container Option
            </Typography>
            <Stack direction={'row'} gap={2} my={2}>
              <StyledBox
                onClick={() => dispatch(toggleLayout('boxed'))}
                display="flex"
                gap={1}
              >
                <CallToActionTwoToneIcon
                  color={
                    customizer.isLayout === 'boxed' ? 'primary' : 'inherit'
                  }
                />
                Boxed
              </StyledBox>
              <StyledBox
                onClick={() => dispatch(toggleLayout('full'))}
                display="flex"
                gap={1}
              >
                <AspectRatioTwoToneIcon
                  color={customizer.isLayout === 'full' ? 'primary' : 'inherit'}
                />
                Full
              </StyledBox>
            </Stack>
            <Box pt={4} /> */}
            {/* ------------------------------------------- */}
            {/* ------------ Sidebar Color setting ------------- */}
            {/* ------------------------------------------- */}

            {/* ------------------------------------------- */}
            {/* ------------ Theme Color setting ------------- */}
            {/* ------------------------------------------- */}
            {
              // <>
              //   <Typography variant="h6" gutterBottom>
              //     Sidebar Type
              //   </Typography>
              //   <Stack direction={'row'} gap={2} my={2}>
              //     <StyledBox
              //       onClick={() => dispatch(toggleSidebar())}
              //       display="flex"
              //       gap={1}
              //     >
              //       <WebAssetTwoToneIcon
              //         color={!customizer.isCollapse ? 'primary' : 'inherit'}
              //       />
              //       Full
              //     </StyledBox>
              //     <StyledBox
              //       onClick={() => dispatch(toggleSidebar())}
              //       display="flex"
              //       gap={1}
              //     >
              //       <ViewSidebarTwoToneIcon
              //         color={customizer.isCollapse ? 'primary' : 'inherit'}
              //       />
              //       mini
              //     </StyledBox>
              //   </Stack>
              // </>
            }
            {/* <Box pt={4} />
            <Typography variant="h6" gutterBottom>
              Card With
            </Typography>
            <Stack direction={'row'} gap={2} my={2}>
              <StyledBox
                onClick={() => dispatch(setCardShadow(false))}
                display="flex"
                gap={1}
              >
                <BorderOuter
                  color={!customizer.isCardShadow ? 'primary' : 'inherit'}
                />
                Border
              </StyledBox>
              <StyledBox
                onClick={() => dispatch(setCardShadow(true))}
                display="flex"
                gap={1}
              >
                <CallToActionTwoToneIcon
                  color={customizer.isCardShadow ? 'primary' : 'inherit'}
                />
                Shadow
              </StyledBox>
            </Stack> */}
            {/* <Box pt={4} /> */}
            {/* ------------------------------------------- */}
            {/* ------------ Theme Color setting ------------- */}
            {/* ------------------------------------------- */}
            {/* <Typography variant="h6" gutterBottom>
              Theme Border Radius
            </Typography>

            <Slider
              size="small"
              value={customizer.borderRadius}
              aria-label="Small"
              min={4}
              max={24}
              onChange={(event: any) =>
                dispatch(setBorderRadius(event.target.value))
              }
              valueLabelDisplay="auto"
            /> */}
          </Box>
        </Scrollbar>
      </Drawer>
    </div>
  );
};

export default Customizer;
