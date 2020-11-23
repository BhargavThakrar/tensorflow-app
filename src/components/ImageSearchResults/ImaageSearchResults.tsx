import React, { useRef, useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

import useImageSearch from '../../hooks/useImageSearch';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    results: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing(5),
      padding: theme.spacing(0, 1),
    },
    resultsTitle: {
      width: '100%',
      padding: theme.spacing(1),
      backgroundColor: '#fff',
      textAlign: 'center',
      position: 'sticky',
      top: 0,
    },
    resultImage: {
      height: '20vh',
      padding: theme.spacing(2),
      
      [theme.breakpoints.down(700)]: {
        width: '45%',
        padding: theme.spacing(1),  
      },

      '& > img': {
        objectFit: 'cover',

        [theme.breakpoints.down(700)]: {
          maxWidth: '100%',
          height: 'auto',
        },

        minWidth: '100%',
        maxHeight: '20vh',

        verticalAlign: 'bottom',
        borderRadius: theme.spacing(1),

        '&:hover': {
          boxShadow: '2px 2px 6px 2px #ccc',
        },

        [theme.breakpoints.up(700)]: {
          border: '1px solid #d9d9d9',
          padding: theme.spacing(1),
        },
      },
    },
    error: {
      padding: theme.spacing(1),
      color: '#fff',
      backgroundColor: theme.palette.error.main,
    },
  }),
);

function ImageSearchResults() {
  const classes = useStyles();

  const {imageResults, error, lazyLoadImages, isLoading} = useImageSearch();
  const { images, searchResultsFor } = imageResults || {};
  const resImg = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lazyLoadImages(resImg.current);

    if (resImg.current && resImg.current.scrollIntoView) {
      resImg.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [imageResults, error, lazyLoadImages]);
  
  return (
    <>
      <div className={classes.results} ref={resImg}>
        {error && (
          <Paper className={classes.error} role="alert">
            <Typography variant="subtitle1">{error}</Typography>
          </Paper>
        )}
        {isLoading && 'Loading images...'}
        {images && images.length > 0 && (
          <>
            <Typography variant="h4" className={classes.resultsTitle}>Similar images of "{searchResultsFor}"</Typography>
            {images.map((image: string) => (
              <div className={classes.resultImage} key={image}>
                {/**
                 * Using the same alt text for all images.
                 * But we could use dynamic one if we have human readable imaage texts from API
                 */}
                <img className="lazy" alt="dog breed" src="./images/loading-img.jpg" data-src={image} />
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default ImageSearchResults;
