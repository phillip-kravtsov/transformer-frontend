import React from 'react';
import {OrderedSet} from 'immutable';
import now from 'performance-now';
import {Editor, EditorState, getDefaultKeyBinding, Modifier, SelectionState} from 'draft-js';
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import './Draft.css'

const styles = {
  editor: {
    minHeight: '12em',
	padding: 10,
	justify: 'center',
	width: 600,
  }
};

//const url = 'http://ec2-18-144-35-237.us-west-1.compute.amazonaws.com:4200/'
const url = 'http://127.0.0.1:4200/'

function keyBindingFn(e) {
  if (e.key === 'Enter') {
	return 'select';
  }
  if (e.key === 'Tab') {
	return 'complete';
  }
  return getDefaultKeyBinding(e);
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

export default class myEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState:EditorState.createEmpty(),
				  lastCompletionSelection: false,
				  await_lock: false,
				  log_likelihood: 0,
	};

    this.setEditor = (editor) => {
      this.editor = editor;
    };
    this.focusEditor = () => {
      if (this.editor) {
        this.editor.focus();
      }
    };
	this.handleKeyCommand = this.handleKeyCommand.bind(this);
	this.onChange = this.onChange.bind(this);
	this.cleanLastSelection = this.cleanLastSelection.bind(this);
	this.selectLastSelection = this.selectLastSelection.bind(this);
	this.completionReady = this.completionReady.bind(this);
	this.onClick = this.onClick.bind(this);
  };

  onChange(editorState) {
	this.setState({editorState});
  }

  completionReady() {
	return this.state.lastCompletionSelection !== false;
  }

  async onClick() {
	const phrase = this.getSelectionText(this.state.editorState);
	const currSelection = this.state.editorState.getSelection();
	let data;
	if (currSelection.isCollapsed()) {
	   data = {'phrase': phrase, 'context': ''};
	} else {
	  const blockMap = this.state.editorState.getCurrentContent().getBlockMap();
	  const endKey = currSelection.getStartKey();
	  
	  var context = ''
	  for (let keyblock of blockMap) {
		const key = keyblock[0];
		const block = keyblock[1];
		let text = block.getText();
		if (key === endKey) {
		  context = context.concat(text.substring(0, currSelection.getStartOffset()));
		  break;
		}
		context = context.concat(text).concat('\n');
	  }
	  data = {'phrase': phrase, 'context': context}
	}
	console.log(data);
    const resp = await postData(url.concat('prob'), data); //Calls postData above
	console.log(resp);
	this.setState({'log_likelihood': resp['log_likelihood']})
  }


  cleanLastSelection(es) {
	const currContent = es.getCurrentContent();
	const ncs = Modifier.replaceText(currContent, this.state.lastCompletionSelection, '');
	let nextEditorState = EditorState.push(
		es,
		ncs,
		'remove-range'
	);
	this.onChange(nextEditorState);
	this.setState({'lastCompletionSelection': false});
  }

  selectLastSelection(editorState) {
	const endKey = this.state.lastCompletionSelection.getEndKey();
	const emptySelection = SelectionState.createEmpty(endKey);
	const offset = this.state.lastCompletionSelection.getEndOffset();
	const endSelection = emptySelection.merge({
	  focusKey: endKey,
	  anchorOffset: offset,
	  focusOffset: offset,
	  hasFocus: true,
	});
	const cs = editorState.getCurrentContent();
	console.log(this.state.lastCompletionSelection);
	if (this.completionReady()) {
	  const ncs = Modifier.removeInlineStyle(cs, this.state.lastCompletionSelection, 'BOLD');
	  let nextEditorState = EditorState.push(editorState, ncs, 'change-inline-style');
	  nextEditorState = EditorState.forceSelection(nextEditorState, endSelection);
	  this.onChange(nextEditorState);
	}
	this.setState({'lastCompletionSelection': false});
	return;
  }
 
  updateStateWithCompletion(completion, editorState) {
	const contentState = editorState.getCurrentContent();
	const currSelection = editorState.getSelection();
	if (!currSelection.isCollapsed()) return;
	const nextContentState = Modifier.insertText(contentState,
												 currSelection,
												 completion,
											     OrderedSet.of('BOLD'));
	let nextEditorState = EditorState.push(
		  editorState,
		  nextContentState,
		  'change-inline-style'
	);
	const nextSelection = nextEditorState.getSelection();
	const currSelectionBlockKey = currSelection.getEndKey();
	const completionSelectionEmpty = SelectionState.createEmpty(currSelectionBlockKey);
	const completionSelectionWithAnchor = completionSelectionEmpty.set('anchorOffset', currSelection.getStartOffset())
	const completionSelection = completionSelectionWithAnchor.set('focusOffset', nextSelection.getStartOffset());
	nextEditorState = EditorState.forceSelection(nextEditorState, currSelection);
	this.onChange(nextEditorState);
	this.setState({'lastCompletionSelection': completionSelection});
  }

  async getCompletion(context) {
    var t0 = now();
	console.log(this.props.getConfig());
    const data = {'context': context,
                  'config': this.props.getConfig(),
	};
	console.log(data);
    const resp = await postData(url.concat('predict'), data); //Calls postData above
    const comp = resp['completion'];
	console.log(resp['all_completions']);
    var t1 = now();
    console.log(t1-t0);
    console.log(comp);
	return comp;
  }	
  
  getSelectionText(editorState) {
	const contentState = editorState.getCurrentContent();
	const selection = editorState.getSelection();
	var startKey;
	if (selection.isCollapsed()) {
	  startKey = contentState.getFirstBlock().getKey();
	} else {
	  startKey = selection.getStartKey();
	}
	const endKey = selection.getEndKey();
	if (startKey === endKey && !selection.isCollapsed()) {
	  const block = contentState.getBlockForKey(startKey);
	  return block.getText().substring(selection.getStartOffset(), selection.getEndOffset());
	}
	// Note: the code below only works if startKey and endKey are different, that is
	// if the selection spans across blocks. The other case is handled above.

	console.log(startKey);
	console.log(endKey);

	let context = "";
	let encounteredFirst = false;
	const blockMap = contentState.getBlockMap();
	
	for (let keyblock of blockMap) {
	  const key = keyblock[0];
	  const block = keyblock[1];
	  let text = block.getText();
	  if (!encounteredFirst) {
		if (key === startKey) {
		  encounteredFirst = true;
		  if (!selection.isCollapsed()) {
			text = text.substring(selection.getStartOffset())
		  }
		} else {
		  continue;
		}
	  }
	  if (key === endKey) {
		context = context.concat(text.substring(0, selection.getEndOffset()));
		break;
	  }
	  context = context.concat(text).concat('\n');
	}
	return context
  }

  async handleKeyCommand(command, editorState) {
	//console.log('kc', command, ' ', this.completionReady());
	if (command === 'select' && this.completionReady()) {
	  this.selectLastSelection(this.state.editorState);
	  return 'handled';
	} else {
	  if (command === 'select') {
		const newContentState = Modifier.insertText(
				editorState.getCurrentContent(),
				editorState.getSelection(),
				"\n"
		);
		const nextEditorState = EditorState.push(
		  editorState,
		  newContentState,
		  "insert-characters"
		);
		this.onChange(nextEditorState);
	  }
	  if (this.completionReady()) {
		console.log('Clean in keycommand');
		this.cleanLastSelection(editorState);
	  }
	}
	if (command === 'complete') {
	  if (this.state.await_lock === true) {
		console.log('Locked!');
		return;
	  }
	  const context = this.getSelectionText(editorState);
	  console.log(context);
	  if (this.completionReady()) {
		console.log('Clean in keycommand');
		this.cleanLastSelection(editorState);
	  }
	  this.setState({'await_lock': true});
	  const completion = await this.getCompletion(context);
	  this.setState({'await_lock': false});
	  console.log(completion)
	  this.updateStateWithCompletion(completion, this.state.editorState);
	  return 'handled';
	}
	return 'not-handled';
  };

  componentDidMount() {
    this.focusEditor();
  };

  styleMap = {
	BOLD: {
	  color: 'rgba(0, 0, 0, 0.5)',
	},
  }
  render() {
    return (
	  <div>
		<div style={styles.editor} onClick={this.focusEditor}>
		  <Editor placeholder="Enter something, and hit tab to get a neural network's predictions. Control the context by selecting a region."
				  ref={this.setEditor}
				  customStyleMap={this.styleMap}
				  editorState={this.state.editorState}
				  handleKeyCommand={this.handleKeyCommand}
				  keyBindingFn={keyBindingFn}
				  onChange={this.onChange} />
		</div>
		<div>
		  <Button onClick={this.onClick}>
			Probabilty 
		  </Button>
		  <Typography variant="h5">
			{this.state.log_likelihood}
		  </Typography>
		</div>
	  </div>
    );
  };
}
