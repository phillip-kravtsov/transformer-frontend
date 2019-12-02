import React from 'react';
import {OrderedSet} from 'immutable';
import now from 'performance-now';
import {Editor, EditorState, getDefaultKeyBinding, Modifier, SelectionState} from 'draft-js';
import Autosuggest from 'react-autosuggest';
import './Draft.css'

const styles = {
  editor: {
    minHeight: '12em',
	padding: 10,
	justify: 'center',
	width: 600,
  }
};

function keyBindingFn(e) {
  if (e.key === 'Tab') {
	return 'complete'
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

function myBlockRenderer(contentBlock) {
  const type = contentBlock.getType();
}

export default class myEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState:EditorState.createEmpty(),
				  lastCompletionSelection: false,
	};
    this.onChange = (editorState) => this.setState({editorState});
    this.setEditor = (editor) => {
      this.editor = editor;
    };
    this.focusEditor = () => {
      if (this.editor) {
        this.editor.focus();
      }
    };
	this.handleKeyCommand = this.handleKeyCommand.bind(this);
  };
 
  updateStateWithCompletion(completion, contentState) {
	const currSelection = this.state.editorState.getSelection();
	if (!currSelection.isCollapsed()) return;
	const nextContentState = Modifier.insertText(contentState,
												 currSelection,
												 completion,
											     OrderedSet.of('BOLD'));
	let nextEditorState = EditorState.push(
		  this.state.editorState,
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
    const resp = await postData('http://ec2-18-144-35-237.us-west-1.compute.amazonaws.com:4200/predict', data); //Calls postData above
    //const resp = await postData('http://127.0.0.1:4200/predict', data);
    const comp = resp['completion'];
    var t1 = now();
    console.log(t1-t0);
    console.log(comp);
	return comp;
  }	

  async handleKeyCommand(command) {
	if (command === 'complete') {
	  // Do the thing here
	  const contentState = this.state.editorState.getCurrentContent();
	  if (!(this.state.lastCompletionSelection === false)) {
		console.log("No falsehoods here");
		console.log(this.state.lastCompletionSelection);
		const endKey = this.state.lastCompletionSelection.getEndKey();
		const emptySelection = SelectionState.createEmpty(endKey);
		const offset = this.state.lastCompletionSelection.getEndOffset();
		const endSelection = emptySelection.merge({
		  focusKey: endKey,
		  anchorOffset: offset,
		  focusOffset: offset,
		  hasFocus: true,
		});
		const ncs = Modifier.removeInlineStyle(contentState, this.state.lastCompletionSelection, 'BOLD');
		var nextEditorState = EditorState.push(this.state.editorState, ncs, 'change-inline-style');
		nextEditorState = EditorState.forceSelection(nextEditorState, endSelection);
		this.onChange(nextEditorState);
		this.setState({'lastCompletionSelection': false});
		return;
	  }
	  const context = contentState.getPlainText('\n');
	  console.log(context);
	  const completion = await this.getCompletion(context);
	  console.log(completion)
	  this.updateStateWithCompletion(completion, contentState);
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
	  <div style={styles.editor} onClick={this.focusEditor}>
		<Editor placeholder="Enter something, and hit tab to get a neural network's predictions"
				ref={this.setEditor}
				customStyleMap={this.styleMap}
				editorState={this.state.editorState}
				handleKeyCommand={this.handleKeyCommand}
				keyBindingFn={keyBindingFn}
				onChange={this.onChange} />
	  </div>
    );
  };
}
