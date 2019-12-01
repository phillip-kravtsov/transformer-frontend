import React from 'react';
import ReactDOM from 'react-dom';
import now from 'performance-now';
import MyEditor from './editor.js';
import FiddleGroup from './opts.js';
import { makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';


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
	  topk: '10',
    };
    // this.onClick = this.onClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
	this.handleTopkChange = this.handleTopkChange.bind(this);
	this.getConfig = this.getConfig.bind(this);
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

  handleTopkChange(event, newValue) {
	console.log(newValue);
	this.setState({'topk': newValue});
  };

  /*
  async onClick() {
    
    var t0 = now();
    const data = {'context': this.state.value,
                  'config': {
                    'size': this.state.size,
                    'search': this.state.search,
                    'top_k': this.state.topk,
                    'top_p': 0.9,
                    'temperature': 1.2,
                    'timeout': 2.0,
                  }};
    const resp = await postData('http://ec2-18-144-35-237.us-west-1.compute.amazonaws.com:4200/predict', data); //Calls postData above
    //const resp = await postData('http://127.0.0.1:4200/predict', data);
    const comp = resp['completion'];
    var t1 = now();
    console.log(t1-t0);
    console.log(comp);
    this.setState({'value': this.state.value.concat(comp)});
    console.log(resp);
  };*/

  getConfig() {
	return {'size': this.state.size,
			'search': this.state.search,
			'top_k': this.state.topk,
			'top_p': 1.0,
			'temperature': 1.2,
			'timeout': 0.8,
			'length': 6,};
    }

  render() {
    return (
      <Grid container direction="column" justify="center" alignItems="center" spacing={2}>
        <Grid item>
          <FiddleGroup 
			hcsearch={this.handleSearchChange}
			hcsize={this.handleSizeChange}
			topk={this.handleTopkChange}/>
        </Grid>
        <Grid item className={this.state.classes.textField}>
		  <MyEditor getConfig={this.getConfig} />
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
