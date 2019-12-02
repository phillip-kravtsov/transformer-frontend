import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
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
function Fiddle(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(props.options[0]);
    const handleChange = event => {
      setValue(event.target.value);
      props.handleChange(event);
    };

    const buttons = []
    for (const [index, value] of props.options.entries()) {
      buttons.push(<div key={index}> <FormControlLabel value={value} key={index} control={<Radio />} label={value}/> </div>)
    }
    return (
      <FormControl component="fieldset" className={classes.formControl}>
      <FormLabel component="legend">{props.label}</FormLabel>
      <RadioGroup aria-label={props.label} name="search1" value={value} onChange={handleChange}>
        <div> {buttons} </div>
      </RadioGroup>
      </FormControl>
  );
}

export default function FiddleGroup(props) {
  const topkMarks = [
    {
      value: 1,
      label:'1'
    },
    {
      value: 100,
      label:'All'
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
  const classes = useStyles();
  return (
    <Grid container item direction="row" spacing={2}>
      {/*
      <Grid item>
        <Fiddle handleChange={props.hcsearch} options={['Beam Search', 'Random Sampling']} label='Search Method'/>
      </Grid>
      <Grid item>
        <Fiddle handleChange={props.hcsize} options={['1.5B', '774M', '345M' ]} label='Model Size'/>
      </Grid>
      */}
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
              onChange={props.topk}
            />
          </Grid>
        </Grid>
        <Grid container item direction="row" spacing={4}>
          <Grid item className={classes.sliders}>
            <Typography id="temperature" gutterBottom>
              Temperature
            </Typography>
            <Slider
              defaultValue={1.0}
              aria-labelledby="temperature"
              valueLabelDisplay="auto"
              step={0.001}
              min={0.2}
              max={3.0} 
              onChange={props.temperature}
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
              onChange={props.timeout}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

