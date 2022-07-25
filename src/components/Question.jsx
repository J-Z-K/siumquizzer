import { FormControl, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import { ref, set } from 'firebase/database';
import * as React from 'react';
import { useContext } from 'react';
import { bazy } from '../common';
import { Context } from '../context/Context';
import { auth, database } from '../utils/firebaseConf';
import ButtonRow from './ButtonRow';

function Question({ question, next }) {
  const { answers, correct } = question;
  const { userSession, repo } = useContext(Context);
  const [error, setError] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState();
  const [showCorrect, setShowCorrect] = React.useState(false);

  const nextQuestion = () => {
    setError(false);
    setShowCorrect(false);
    next();
    setSelectedIndex(null);
  };

  const handleSubmit = (event, index) => {
    event?.preventDefault();

    setShowCorrect(true);
    if (auth.currentUser) {
      const qid = question.id;
      const { uid } = auth.currentUser;
      const { path } = bazy[repo.selectedRepo];
      if (userSession?.started) {
        if (parseInt(index, 10) === correct[0]) {
          set(ref(database, `users/${uid}/session/${path}/correct/_${qid}/correct`), true);
          setError(false);
        } else {
          const counter = userSession[path]?.incorrect[`_${qid}`]?.counter || 0;
          set(ref(database, `users/${uid}/session/${path}/incorrect/_${qid}/`), { correct: false, counter: counter + 1 });
          setError(true);
        }
      }
    }
  };

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    handleSubmit(null, index);
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <FormControl error={error} sx={{ width: '100%' }}>
          <List component="nav" aria-label="main mailbox folders">
            <Stack spacing={1}>
              {answers?.map((el, i) => (
                <Item
                  key={el}
                  className={`listItem ${selectedIndex === i ? 'selectedAnswer' : ''} ${i === correct[0] && showCorrect ? 'correct' : 'aaa'} listItem ${selectedIndex === i && showCorrect && i !== correct[0] ? 'wrong' : ''}`}
                >
                  <ListItemButton
                    disabled={showCorrect}
                    selected={selectedIndex === i}
                    onClick={(event) => handleListItemClick(event, i)}
                    className="button"
                  >
                    <ListItemText primary={el} />
                  </ListItemButton>
                </Item>
              ))}
            </Stack>
          </List>
          <ButtonRow next={nextQuestion} />
        </FormControl>

      </form>
    </Box>
  );
}

export default Question;
