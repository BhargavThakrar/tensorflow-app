import React, { useState, useRef, useEffect, useReducer } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs-backend-cpu';

import useImageSearch from '../../hooks/useImageSearch';
import { delay } from '../../utils/common';
import {
  UPLOADING,
  IDENTIFYING,
  CLEAR,
  initialLoaderState,
  loaderReducer
} from './loaderReducer';
import { BREEDS_API_HOST } from '../../constants/breeds';
import Prediction from './PredictionModel';
import { formatPredictions, formatBreedNameForApiSearch } from '../../utils/breeds';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    primaryImage: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    avatar: {
      width: 'auto',
      textAlign: 'center',
      padding: theme.spacing(2),

      '& > img': {
        maxWidth: '100%',
        height: 'auto',
      }
    },
    imagePreview: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      border: '2px dashed',
      width: 200,
      minHeight: 200,
      marginBottom: theme.spacing(2),
      color: '#A9A9A9',
    },
    imageDescription: {
      textAlign: 'center',
      marginBottom: theme.spacing(2),
    },
    uploadButton: {
      margin: theme.spacing(2,0,1,0),
    },
    strong: {
      fontWeight: 'bold'
    },
    link: {
      cursor: 'pointer',
      color: theme.palette.success.main,
      padding: 0,
      textTransform: 'inherit',
      fontSize: 12,

      '&:hover': {
        textDecoration: 'underline',
        backgroundColor: 'transparent',
      }
    },
    footerTexts: {
      textAlign: 'center',
      padding: theme.spacing(1),

      '& > span': {
        marginBottom: theme.spacing(1),
        display: 'block',
      },
    },
  }),
);

const ACCEPTED_FILES = ['image/jpeg', 'image/jpg', 'image/png'];

function ImageUpload() {
  const classes = useStyles();

  const [{ isLoading, loadingText }, dispatchLoading] = useReducer(loaderReducer, initialLoaderState);
  
  const [file, setFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [model, setModel] = useState<mobilenet.MobileNet | null>(null);
  const [breeds, setBreeds] = useState<Prediction[] | null>(null);

  const { searchImages, resetSearch } = useImageSearch();
  const imgEl = useRef<HTMLImageElement>(null);
  
  const reset = () => {
    setFile(null);
    setBreeds(null);
    setError(null);
    resetSearch();
  }

  const isValidImage = (file: File): boolean => {
    return ACCEPTED_FILES.includes(file.type);
  }

  const onImageUpload = async (event: React.FormEvent<HTMLInputElement>): Promise<void> => {
    const files = event.currentTarget.files;

    if (files && files[0]) {
      reset();

      if (!isValidImage(files[0])) {
        const filesAllowed = ACCEPTED_FILES.map((mimeType: string) => (
          mimeType.substr(mimeType.indexOf('/') + 1, mimeType.length)
        ));
        setError(`Invalid file. Only these files are allowed - ${filesAllowed.join(', ')}`);
        return;
      }
      
      dispatchLoading({ type: UPLOADING });

      await delay(500);
      setFile(URL.createObjectURL(files[0]));
    }
  }

  const previewImageLoaded = async () => {
    dispatchLoading({ type: IDENTIFYING });

    // Classify the image
    if (imgEl.current && model) {
      const predictions: Prediction[] = await model.classify(imgEl.current);
      
      setBreeds(formatPredictions(predictions));
      dispatchLoading({ type: CLEAR });
    }
  }

  const handleBreedSearch = (breedName: string) => () => {
    searchImages(breedName, `${BREEDS_API_HOST}/${formatBreedNameForApiSearch(breedName)}/images`);
  }

  useEffect(() => {
    (async () => {
      // Load the model
      /**
       * It by default loads all the models and will detects all types of images.
       * But, in the interest of time I have not researched on that part but, I'm pretty sure
       * we can load specific models and detect only specific category of images.
       */
      setModel(await mobilenet.load({
        version: 2,
        alpha: 0.50,
      }));
      dispatchLoading({ type: CLEAR });
    })();
  }, []);

  return (
    <>
      <div className={classes.primaryImage}>
        <div className={classes.imagePreview}>
          {file ? (
              <div className={classes.avatar}>
                <img ref={imgEl} alt="dog breed preview" src={file} onLoad={previewImageLoaded} /> 
              </div>
          ) : (<Typography>Image preview</Typography>)}
        </div> 
        {breeds && breeds.length > 0 && (
          <>
            <Typography className={classes.strong}>Predictions</Typography>
            <List dense disablePadding>
              {breeds.map(({ className, probability }) => (
                <ListItem key={`${className}${probability}`}>
                  <ListItemText
                    primary={`${className} (${probability}%)`}
                    secondary={(
                      <Button role="link" className={classes.link} onClick={handleBreedSearch(className)}>Find similar images</Button>
                    )}
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}
        <Button disabled={isLoading} color="primary" variant="contained" component="label" className={classes.uploadButton}>
          {loadingText ? loadingText : 'Upload image'}
          <input type="file" hidden onChange={onImageUpload} />
        </Button>
        <div className={classes.footerTexts}>
          <Typography variant="caption">Upload any dog image and let system predict the breed!</Typography>
          <Typography variant="caption">
            <span className={classes.strong}>
              Note: It detects all types of images but, if you need to further search for similar images then, please upload dog images only.
            </span>
          </Typography>
          {error && (
            <Typography variant="subtitle1" color="error">{error}</Typography>
          )}
        </div>
      </div>
    </>
  );
}

export default ImageUpload;
