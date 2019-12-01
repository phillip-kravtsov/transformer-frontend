import React from 'react';
import ReactDOM from 'react-dom';
import MyEditor from './editor.js';
import FiddleGroup from './opts.js';
import { makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

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

class PromptAndResponse extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: props.classes,
      value: "",
      size: "1.5B",
      search: "Beam",
	  topk: 10,
	  topp: 1.0,
	  temperature: 1.0,
	  timeout: 1.0,
    };
    // this.onClick = this.onClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
	this.handleTopkChange = this.handleTopkChange.bind(this);
	this.handleToppChange = this.handleToppChange.bind(this);
	this.handleTemperatureChange = this.handleTemperatureChange.bind(this);
	this.handleTimeoutChange = this.handleTimeoutChange.bind(this);
	this.getConfig = this.getConfig.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  };
  
  handleSizeChange(event) {
    this.setState({'size': event.target.value});
  };

  handleSearchChange(event) {
    this.setState({'search': event.target.value});
  };

  handleToppChange(event, newValue) {
	this.setState({'topp': newValue});
  };

  handleTopkChange(event, newValue) {
	this.setState({'topk': newValue});
  };

  handleTemperatureChange(event, newValue) {
	this.setState({'temperature': newValue});
  };

  handleTimeoutChange(event, newValue) {
	this.setState({'timeout': newValue});
  };


  getConfig() {
	return {'size': this.state.size,
			'search': this.state.search,
			'top_k': this.state.topk,
			'top_p': this.state.topp,
			'temperature': this.state.temperature,
			'timeout': this.state.timeout,
			'length': 10,};
    }

  render() {
    return (
      <Grid container direction="column" justify="center" alignItems="center" spacing={2}>
        <Grid item>
          <FiddleGroup 
			hcsearch={this.handleSearchChange}
			hcsize={this.handleSizeChange}
			topk={this.handleTopkChange}
			topp={this.handleToppChange}
			temperature={this.handleTemperatureChange}
			timeout={this.handleTimeoutChange}
			/>
        </Grid>
        <Grid item className={this.state.classes.textField}>
	      <Paper>
			<MyEditor getConfig={this.getConfig} />
		  </Paper>
        </Grid>
        <Grid item>
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

function App() {
  const classes = useStyles();
  return (
	<Grid container direction="column" alignItems="center" spacing={2}>
	  <Grid item>
		<Typography variant="h3" className={classes.title}>
		  Transformer Playground
		</Typography>
	  </Grid>
	  <Grid item>
		<PromptAndResponse classes={classes} />
	  </Grid>
	</Grid>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
