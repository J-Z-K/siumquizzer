import * as React from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

export default function ButtonRow({ next }) {
  return (
    <ButtonGroup disableElevation variant="contained" size="large" aria-label="outlined primary button group">
      {/* <Button>One</Button>
      <Button type="submit">Check</Button> */}
      <Button onClick={next}>Next</Button>
    </ButtonGroup>
  );
}
