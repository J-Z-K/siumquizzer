import { ThemeProvider, createTheme } from '@mui/material/styles';
import Exercise from './components/Exercise';
import TopAppBar from './components/TopAppBar';
import ContextWrapper from './context/Context';

const darkTheme = createTheme({
  palette: {
    // mode: 'dark',
  },
  // overrides: {
  //   MuiListItemButton: {
  //     root: {
  //       '&$selected': {
  //         backgroundColor: 'red',
  //         '&:hover': {
  //           backgroundColor: 'orange',
  //         },
  //       },
  //     },
  //     button: {
  //       '&:hover': {
  //         backgroundColor: 'yellow',
  //       },
  //     },
  //   },
  // },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <ContextWrapper>
        <div className="App">
          <TopAppBar />
          <Exercise />
        </div>
      </ContextWrapper>
    </ThemeProvider>
  );
}

export default App;
