import { useContext } from 'react';
import { Context } from '../context/Context';
import Exercise from './Exercise';
import TopAppBar from './TopAppBar';

function Main() {
  const context = useContext(Context);

  return (
    <>
      <TopAppBar />
      {
        context.userInfoLoaded ? <Exercise /> : null
      }
    </>
  );
}

export default Main;
