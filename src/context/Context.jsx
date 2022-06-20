import {
  createContext, useEffect, useMemo, useState,
} from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { onValue, ref } from 'firebase/database';
import { auth, database } from '../utils/firebaseConf';
import { bazy as repo } from '../common';

export const Context = createContext({});

function ContextWrapper({ children }) {
  const [userInfo, setUserInfo] = useState(null);
  const [userInfoLoaded, setUserLoaded] = useState(false);
  const [userSession, setUserSession] = useState({});
  const [userSessionLoaded, setUserSessionLoaded] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(0);
  const [nextExercise, setNextExercise] = useState();
  const [exercise, setExercise] = useState();

  const getRandomWithExclude = (max, excludeArray) => {
    const randomNumber = Math.floor(Math.random() * (max - excludeArray.length));
    const res = randomNumber + excludeArray.sort((a, b) => a - b)
      .reduce((acc, element) => (randomNumber >= element - acc ? acc + 1 : acc), 0);
    return res;
  };
  const getRepo = () => repo[selectedRepo];

  const random = (array) => {
    const { path, leng } = getRepo();
    if (array) {
      return getRandomWithExclude(leng, array);
    }
    return Math.floor(Math.random() * (leng));
  };

  const getExercise = () => {
    const { path } = getRepo();
    const exerciseRefNext = ref(database, `${path}/${idNext}`);
    const idNext = random();
    if (exercise) {
      setExercise(nextExercise());
      onValue(exerciseRefNext, (snapshot) => {
        setNextExercise({ ...snapshot.val(), idNext });
      }, { onlyOnce: true });
    } else {
      const id = 0;
      const exerciseRef = ref(database, `${path}/${id}`);
      onValue(exerciseRef, (snapshot) => {
        setExercise({ ...snapshot.val(), id });
      }, { onlyOnce: true });
      onValue(exerciseRefNext, (snapshot) => {
        setNextExercise({ ...snapshot.val(), idNext });
      }, { onlyOnce: true });
    }
  };

  const getUserSession = (uid) => {
    const session = ref(database, `users/${uid}/session`);
    onValue(session, (snapshot) => {
      setUserSession(snapshot.val());
      setUserSessionLoaded(true);
    });
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUserLoaded(true);
      if (user) {
        setUserInfo(user);
        getUserSession(user.uid);
      } else {
        setUserInfo(null);
      }
    });
  }, []);

  // const value = useMemo(() => ({ userInfo, userInfoLoaded }));

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <Context.Provider value={{
      userInfo,
      userInfoLoaded,
      userSession,
      repo: { selectedRepo, setSelectedRepo },
      getExercise,
      exercise,
      setExercise,
      nextExercise,
      setNextExercise,
    }}
    >
      {children}
    </Context.Provider>
  );
}

export default ContextWrapper;
