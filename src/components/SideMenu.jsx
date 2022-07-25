import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import {
  Box,
  Divider,
  List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader,
} from '@mui/material';
import { ref, set } from 'firebase/database';
import { useContext } from 'react';
import { bazy } from '../common';
import { Context } from '../context/Context';
import { database } from '../utils/firebaseConf';

function SideMenu({ toggleDrawer }) {
  const { userInfo, userSession, repo } = useContext(Context);

  const handleStartSession = () => {
    set(ref(database, `users/${userInfo.uid}/session/started`), true);
  };

  const handleEndSession = () => {
    set(ref(database, `users/${userInfo.uid}/session/`), { started: false });
  };

  return (
    <div>
      <Box
        role="presentation"
        sx={{ width: 250 }}
        onKeyDown={toggleDrawer(false)}
      >
        {
        userInfo
            && (
            <List>
              <ListSubheader>SiumQuizzer Menu</ListSubheader>
              {!userSession?.started
                ? (
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleStartSession}>
                      <ListItemIcon>
                        <PlayCircleOutlineIcon />
                      </ListItemIcon>
                      <ListItemText primary="Zacznij sessje" />
                    </ListItemButton>
                  </ListItem>
                ) : (
                  <ListItem disablePadding>
                    <ListItemButton onClick={handleEndSession}>
                      <ListItemIcon>
                        <StopCircleIcon />
                      </ListItemIcon>
                      <ListItemText primary="Zakończ sessje" />
                    </ListItemButton>
                  </ListItem>
                )}
              <Divider />
            </List>
            )
        }
        {repo
          && (
          <List>
            <ListSubheader>SiumQuizzer - baza pytań</ListSubheader>
            {bazy.map((el, i) => (
              <ListItemButton
                selected={repo.selectedRepo === i}
                onClick={() => repo.setSelectedRepo(i)}
                className={`button ${repo.selectedRepo === i ? 'selectedAnswer' : ''}`}
                key={el.path}
              >
                <ListItemText primary={el.name} />
              </ListItemButton>
            ))}
          </List>
          )}

      </Box>
    </div>
  );
}

export default SideMenu;
