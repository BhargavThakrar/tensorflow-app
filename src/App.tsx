import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import ImageSearchProvider from './providers/ImageSearchProvider';
import ImageUpload from './components/ImageUpload';
import ImageSearchResults from './components/ImageSearchResults';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    header: {
      textAlign: 'center',
      marginTop: theme.spacing(2),
    },
    content: {
      marginTop: theme.spacing(4),
    },
  }),
);

function App() {
  const classes = useStyles();

  return (
    <ImageSearchProvider>
      <header className={classes.header}>
        <Typography variant="h3">Tensorflow app</Typography>
      </header>
      <main className={classes.content}>
        <ImageUpload />
        <ImageSearchResults />
      </main>
    </ImageSearchProvider>
  );
}

export default App;
