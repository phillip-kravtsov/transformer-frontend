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
    margin: theme.spacing(3),
  },
  sliders: {
    flexGrow: 1,
    width: 300,
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
      <Grid container direction="row" justify="center" spacing={2}>
        <Grid item>
          <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">{props.label}</FormLabel>
          <RadioGroup aria-label={props.label} name="search1" value={value} onChange={handleChange}>
            <div> {buttons} </div>
          </RadioGroup>
		  </FormControl>
        </Grid>
      </Grid>
  );
}

export default function FiddleGroup(props) {
  const marks = [
    {
      value: 1,
      label:'1'
    },
    {
      value: 100,
      label:'All'
    },
  ];
  const classes = useStyles();
  return (
    <Grid container item direction="row" spacing={2}>
      <Grid item>
        <Fiddle handleChange={props.hcsearch} options={['Beam Search', 'Random Sampling']} label='Search Method'/>
      </Grid>
      <Grid item>
        <Fiddle handleChange={props.hcsize} options={['1.5B', '774M', '345M' ]} label='Model Size'/>
      </Grid>
	  <Grid item className={classes.sliders}>
        <Typography id="top-k" gutterBottom>
          Top K
        </Typography>
		<Slider
		  defaultValue={10}
		  aria-labelledby="top-k"
		  valueLabelDisplay="auto"
		  step={10}
		  marks={marks}
          min={1}
          max={100} 
          onChange={props.topk}
        />
	  </Grid>
    </Grid>
  );
}

