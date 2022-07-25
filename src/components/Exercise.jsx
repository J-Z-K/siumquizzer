import { Typography } from '@mui/material';
import { onValue, ref } from 'firebase/database';
import { useContext, useEffect, useState } from 'react';
import { bazy } from '../common';
import { Context } from '../context/Context';
import { auth, database } from '../utils/firebaseConf';
import Question from './Question';

function Exercise() {
  const { getExercise, exercise, end } = useContext(Context);

  const next = () => {
    getExercise();
  };

  useEffect(() => {
    getExercise(true);
  }, []);

  return (
    <div className="Exercise">
      {
        exercise ? (
          <div>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} className="question">
              <div>{exercise.question}</div>
            </Typography>
            {!exercise.end
              && (
              <>
                <Typography variant="caption" display="block" gutterBottom>
                  {`id: ${exercise.id}`}
                </Typography>
                <Question question={exercise} next={next} />

              </>
              )}
          </div>
        ) : 'loading...'
      }
    </div>
  );
}
export default Exercise;
