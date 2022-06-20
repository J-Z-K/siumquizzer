import { Typography } from '@mui/material';
import { onValue, ref } from 'firebase/database';
import { useContext, useEffect, useState } from 'react';
import { bazy } from '../common';
import { Context } from '../context/Context';
import { auth, database } from '../utils/firebaseConf';
import Question from './Question';

function Exercise() {
  const [exercise, setExercise] = useState();
  const [nextExercise, setNextExercise] = useState();
  const [nextIndex, setNextIndex] = useState();

  const context = useContext(Context);

  const getBaza = () => {
    const repo = bazy[context?.repo?.selectedRepo];
    if (repo) return repo;
    return bazy[0];
  };

  const getRandomWithExclude = (max, excludeArray) => {
    const randomNumber = Math.floor(Math.random() * (max + 1 - excludeArray.length));
    const res = randomNumber + excludeArray.sort((a, b) => a - b)
      .reduce((acc, element) => (randomNumber >= element - acc ? acc + 1 : acc), 0);
    return res;
  };

  const random = () => {
    const { path, leng } = getBaza();
    if (auth.currentUser && context?.userSession && context?.userSession[path]?.correct) {
      return getRandomWithExclude(leng - 1, Object.keys(context?.userSession[path]?.correct));
    }

    return Math.floor(Math.random() * (leng));
  };

  const getNextExercise = () => {
    const repo = getBaza().path;
    const id = random();
    const { path } = getBaza();
    const postNext = ref(database, `${path}/${id}`);
    onValue(postNext, (snapshot) => {
      setNextIndex(`${path}`);
      setNextExercise({ ...snapshot.val(), id });
    }, { onlyOnce: true });
  };

  const next = () => {
    const { path } = getBaza();
    if (nextIndex === path) {
      setExercise(nextExercise);
    } else {
      const id = random();
      const postNext = ref(database, `${path}/${id}`);
      onValue(postNext, (snapshot) => {
        setNextIndex(`${path}`);
        setExercise({ ...snapshot.val(), id });
      }, { onlyOnce: true });
    }

    getNextExercise();
  };

  useEffect(() => {
    const id = 0;
    const post = ref(database, `${getBaza().path}/${id}`);
    onValue(post, (snapshot) => {
      setExercise({ ...snapshot.val(), id });
    }, { onlyOnce: true });
    getNextExercise();
  }, []);

  return (
    <div className="Exercise">
      {
        exercise ? (
          <div>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className="question">
              <div>{exercise.question}</div>
            </Typography>
            <Typography variant="caption" display="block" gutterBottom>
              {`id: ${exercise.id}`}
            </Typography>
            <Question question={exercise} next={next} />
          </div>
        ) : 'loading...'
      }
    </div>
  );
}
export default Exercise;
