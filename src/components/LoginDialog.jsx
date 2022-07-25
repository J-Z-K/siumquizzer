import { FormControl, FormHelperText } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import * as React from 'react';
import { auth, database } from '../utils/firebaseConf';

export default function LoginDialog({ handleClose, open, type }) {
  const [email, setLogin] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const showError = (errorMessage) => {
      setError(true);
      setHelperText(errorMessage.message);
    };

    const handleOk = () => {
      setError(false);
      setHelperText('');
      handleClose();
    };

    if (type === 'Login') {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          handleOk();
        })
        .catch((errorMessage) => {
          showError(errorMessage);
        });
    }
    if (type === 'Register') {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const { user } = userCredential;
          set(ref(database, `users/${user.uid}`), {
            email: user.email,
            uid: user.uid,
            session: {
              started: false,
            },
          });
          handleOk();
        })
        .catch((errorMessage) => {
          showError(errorMessage);
        });
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
          <FormControl error={error}>
            <DialogTitle>{type}</DialogTitle>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
                value={email}
                onChange={(e) => setLogin(e.target.value)}
              />
              <TextField
                autoFocus
                margin="dense"
                id="pasword"
                label="Password"
                type="password"
                fullWidth
                variant="standard"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </DialogContent>
            <FormHelperText>{helperText}</FormHelperText>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit">{type}</Button>
            </DialogActions>
          </FormControl>
        </form>
      </Dialog>
    </div>
  );
}
