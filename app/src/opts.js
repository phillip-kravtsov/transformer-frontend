import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'grid',
    flexWrap: 'wrap',
  },
  formControl: {
    color: 'lightBlue',
    height: '100px',
    margin: theme.spacing(3),
  },
  sliders: {
    flexGrow: 1,
    width: 150,
  },
  button: {
    background: 'lightBlue', 
  },

}));

export default function FiddleGroup(props) {
  const topkMarks = [
    {
      value: 1,
      label:'1'
    },
    {
      value: 100,
      label:'100'
    },
  ];
  const lengthMarks = [
    {
      value: 1,
      label:'1'
    },
    {
      value: 32,
      label:'32'
    },
  ];
  const toppMarks = [
    {
      value: 0.5,
      label:'0.5'
    },
    {
      value: 1.0,
      label:'1.0'
    },
  ];
  const tempMarks = [
    {
      value: 0.2,
      label:'0.2'
    },
    {
      value: 1.2,
      label:'1.2'
    },
    {
      value: 3.0,
      label:'3.0'
    },
  ];
  const countMarks = [
    {
      value: 1,
      label:'1'
    },
    {
      value: 8,
      label:'8'
    },
  ];
  const timeoutMarks = [
    {
      value: 0.1,
      label:'0.1'
    },
    {
      value: 5.0,
      label:'5.0'
    },
  ];
  const classes = useStyles();
  return (
    <Grid container item direction="row" spacing={2}>
      <Grid container item direction="column" spacing={2}>
        <Grid container item direction="row" spacing={4}>
          <Grid item className={classes.sliders}>
            <Typography id="top-p" gutterBottom>
              Top p
            </Typography>
            <Slider
              defaultValue={1.0}
              aria-labelledby="top-p"
              valueLabelDisplay="auto"
              step={0.001}
              marks={toppMarks}
              min={0.5}
              max={1.0} 
              onChange={props.topp}
            />
          </Grid>
          <Grid item className={classes.sliders}>
            <Typography fontSize={classes.sliders.fontSize} id="top-k" gutterBottom>
              Top K
            </Typography>
            <Slider
              defaultValue={10}
              aria-labelledby="top-k"
              valueLabelDisplay="auto"
              step={1}
              marks={topkMarks}
              min={1}
              max={100} 
              onChange={props.length}
            />
          </Grid>
          <Grid item className={classes.sliders}>
            <Typography fontSize={classes.sliders.fontSize} id="length" gutterBottom>
              Length
            </Typography>
            <Slider
              defaultValue={8}
              aria-labelledby="length"
              valueLabelDisplay="auto"
              step={1}
              marks={lengthMarks}
              min={1}
              max={32} 
              onChange={props.length}
            />
          </Grid>
        </Grid>
        <Grid container item direction="row" spacing={4}>
          <Grid item className={classes.sliders}>
            <Typography id="temperature" gutterBottom>
              Temperature
            </Typography>
            <Slider
              defaultValue={1.2}
              aria-labelledby="temperature"
              valueLabelDisplay="auto"
              step={0.001}
              min={0.2}
              max={3.0} 
              marks={tempMarks}
              onChange={props.temperature}
            />
          </Grid>
          <Grid item className={classes.sliders}>
            <Typography fontSize={classes.sliders.fontSize} id="count" gutterBottom>
              Count
            </Typography>
            <Slider
              defaultValue={1.0}
              aria-labelledby="count"
              valueLabelDisplay="auto"
              step={1}
              min={1}
              max={8} 
              marks={countMarks}
              onChange={props.count}
            />
          </Grid>
          <Grid item className={classes.sliders}>
            <Typography fontSize={classes.sliders.fontSize} id="timeout" gutterBottom>
              Timeout
            </Typography>
            <Slider
              defaultValue={1.0}
              aria-labelledby="timeout"
              valueLabelDisplay="auto"
              step={0.05}
              min={0.1}
              max={5.0} 
              marks={timeoutMarks}
              onChange={props.timeout}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

