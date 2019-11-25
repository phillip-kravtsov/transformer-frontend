import React from 'react';
import ReactDOM from 'react-dom';
import { makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'grid',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
	background: "#FFFFFF"
  },
  text: {
    color: theme.palette.text.primary,
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
  },
  title: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
	marginTop: theme.spacing(3),
  },
  formControl: {
	color: 'lightBlue',
    margin: theme.spacing(3),
  },
  root: {
    background: '#F0F0F0',//linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    flexGrow: 1,
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

function FiddleGroup(props) {
  return (
	<Grid container item direction="row" spacing={2}>
	  <Grid item>
		<Fiddle handleChange={props.hcsearch} options={['Beam Search', 'Random Sampling']} label='Search Method'/>
	  </Grid>
	  <Grid idtem>
		<Fiddle handleChange={props.hcsize} options={['1.5B', '774M', '345M' ]} label='Model Size'/>
	  </Grid>
	</Grid>
  );
}

async function postData(url = '', data = {}) {
  const response = await fetch(url, {
	method: 'POST',
	cache: 'no-cache',
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json',
		'Access-Control-Allow-Origin': '*',
	},
	body: JSON.stringify(data),
	});
  const content = await response.json();
  return content;
}

class PromptAndResponse extends React.Component {
  constructor(props) {
	super(props);
	this.state = {
	  classes: props.classes,
	  value: "",
	  size: "1.5B",
	  search: "Beam",
	};
	this.onClick = this.onClick.bind(this);
	this.handleChange = this.handleChange.bind(this);
	this.handleSizeChange = this.handleSizeChange.bind(this);
	this.handleSearchChange = this.handleSearchChange.bind(this);
  }

  handleChange(event) {
    console.log(event.target.value);
    this.setState({value: event.target.value});
  };
  
  handleSizeChange(event) {
	this.setState({'size': event.target.value});
  };

  handleSearchChange(event) {
	this.setState({'search': event.target.value});
  };

  async onClick() {
	
	const data = {'x': this.state.value,
				  'size': this.state.size,
				  'search': this.state.search,}
	const resp = await postData('http://localhost:4200/predict', data); //Calls postData above
	const comp = resp['completion']
	console.log(comp)
	this.setState({'value': this.state.value.concat(comp)});
	console.log(resp);
  };

  render() {
	return (
	  <Grid container direction="column" justify="center" alignItems="center" spacing={2}>
		<Grid item className={ this.state.classes.textField}>
		  <Form handleChange={ this.handleChange } classes={ this.state.classes } />
		</Grid>
		<Grid item>
		  <FiddleGroup hcsearch={this.handleSearchChange} hcsize={this.handleSizeChange} />
		</Grid>
		<Grid item>
		  <Button className={ this.state.classes.button } onClick={ this.onClick }>
			Generate
		  </Button>
		</Grid>
		<Grid item>
		  <Paper>
			<Typography variant="subtitle1" className={ this.state.classes.text }>
			  { this.state.value }
			</Typography>
		  </Paper>
		</Grid>
	  </Grid>
	);
  }
}

class Form extends React.Component {
  constructor(props) {
	super(props);
	this.state = {
	  classes: props.classes,
	}
  }
  render() {
	return (
	  <form className={this.state.classes.textField} noValidate autoComplete="off">       
		<div>
		  <TextField
			id="prompt"
			label="Prompt"
			multiline
			rowsMax="10"
			value={this.state.value}
			onChange={this.props.handleChange}
			className={this.state.classes.textField}
			fullWidth={true}
			placeholder="Enter something, and hit GENERATE to get a neural network's predictions."
			margin="dense"
		  />
		</div>
	  </form>
	);
  }
}

function App() {
  const classes = useStyles();
  return (
	<Grid container direction="row" spacing={1}>
	  <Grid container item s={6} direction="column" alignItems="center" spacing={2}>
		<Grid item>
		  <Typography variant="h3" className={classes.title}>
			Transformer Playground
		  </Typography>
		</Grid>
		<Grid item>
		  <PromptAndResponse classes={classes} />
		</Grid>
	  </Grid>
	</Grid>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
