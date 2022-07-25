import MenuIcon from '@mui/icons-material/Menu';
import { Drawer } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { signOut } from 'firebase/auth';
import { useContext, useState } from 'react';
import { Context } from '../context/Context';
import { auth } from '../utils/firebaseConf';
import LoginDialog from './LoginDialog';
import SideMenu from './SideMenu';

export default function TopAppBar() {
  const [openLogin, setOpenLogin] = useState(false);
  const [openRegister, setOpenRegister] = useState(false);
  const [drawer, setDrawer] = useState(false);
  // const [selectedIndex, setSelectedIndex] = useState(0);

  const context = useContext(Context);

  window.auth = auth;

  const handleClickLoginOpen = () => {
    setOpenLogin(true);
  };
  const handleLoginClose = () => {
    setOpenLogin(false);
  };

  const handleClickRegisterOpen = () => {
    setOpenRegister(true);
  };
  const handleRegisterClose = () => {
    setOpenRegister(false);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawer(open);
  };

  return (
    <Box sx={{ flexGrow: 1 }} className="TopAppBar">
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            SiumQuizer
          </Typography>
          {
            // eslint-disable-next-line no-nested-ternary
            context?.userInfoLoaded ? !context?.userInfo
              ? (
                <>
                  <Button onClick={handleClickRegisterOpen} color="inherit">Register</Button>
                  <Button onClick={handleClickLoginOpen} color="inherit">Login</Button>
                </>
              )
              : <Button onClick={() => signOut(auth)} color="inherit">Logout</Button>
              : ''
          }
        </Toolbar>
      </AppBar>
      <LoginDialog handleClose={handleLoginClose} open={openLogin} type="Login" />
      <LoginDialog handleClose={handleRegisterClose} open={openRegister} type="Register" />
      <Drawer anchor="left" open={drawer} onClose={toggleDrawer(false)}>
        <SideMenu
          toggleDrawer={toggleDrawer}
        />
      </Drawer>
    </Box>
  );
}
