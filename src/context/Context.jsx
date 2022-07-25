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
  const [selectedRepo, _setSelectedRepo] = useState(0);
  const [nextExercise, setNextExercise] = useState();
  const [exercise, setExercise] = useState();

  const getRandomWithExclude = (max, excludeArray) => {
    const randomNumber = Math.floor(Math.random() * (max - excludeArray.length));
    const res = randomNumber + excludeArray.sort((a, b) => a - b)
      .reduce((acc, element) => (randomNumber >= element - acc ? acc + 1 : acc), 0);
    return res;
  };
  const getRepo = (i) => repo[i || selectedRepo];

  const random = (array) => {
    const { path, leng } = getRepo();
    if (Array.isArray(array)) {
      return getRandomWithExclude(leng, array);
    }
    return Math.floor(Math.random() * (leng));
  };

  const getExercise = (clean, i) => {
    const { path, leng } = i ? getRepo(i) : getRepo();
    let toExclude = null;
    if (userSession && userSession.started && userSession[path] && userSession[path].correct) {
      toExclude = Object.keys(userSession[path].correct).map((el) => parseInt(el.slice(1), 10));
      if (leng === Object.keys(userSession[path].correct).length) {
        setExercise({ question: 'Brawo!!! Przejdź do innej bazy lub zakończ sesje', end: true });
        return;
      }
    }
    let idNext = random(toExclude);
    while (
      exercise && idNext === nextExercise.id
      && userSession && userSession.started && userSession[path]
      && leng - 1 !== Object.keys(userSession[path].correct).length
    ) {
      idNext = random(toExclude);
    }
    const exerciseRefNext = ref(database, `${path}/${idNext}`);
    if (exercise && !clean) {
      setExercise(nextExercise);
      onValue(exerciseRefNext, (snapshot) => {
        setNextExercise({ ...snapshot.val(), id: idNext });
      }, { onlyOnce: true });
    } else {
      const id = 0;
      const exerciseRef = ref(database, `${path}/${id}`);
      onValue(exerciseRef, (snapshot) => {
        setExercise({ ...snapshot.val(), id });
      }, { onlyOnce: true });
      onValue(exerciseRefNext, (snapshot) => {
        setNextExercise({ ...snapshot.val(), id: idNext });
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

  const setSelectedRepo = (i) => {
    _setSelectedRepo(i);
    getExercise(true, i);
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
      userSessionLoaded,
      repo: { selectedRepo, setSelectedRepo },
      getExercise,
      exercise,
      nextExercise,
    }}
    >
      {children}
    </Context.Provider>
  );
}

export default ContextWrapper;
