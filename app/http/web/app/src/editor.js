import React from 'react';
import ReactDOM from 'react-dom';
import {Editor, EditorState} from 'draft-js';
import './Draft.css'

const styles = {
  editor: {
    border: '1px solid gray',
    minHeight: '6em'
  }
};

export default class myEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {editorState:EditorState.createEmpty()};
    this.onChange = (editorState) => this.setState({editorState});
    this.setEditor = (editor) => {
      this.editor = editor;
    };
    this.focusEditor = () => {
      if (this.editor) {
        this.editor.focus();
      }
    };
  };
  componentDidMount() {
    this.focusEditor();
  }
  render() {
    return (
	  <div style={styles.editor} onClick={this.focusEditor}>
		<Editor ref={this.setEditor} editorState={this.state.editorState} onChange={this.onChange} />
	  </div>
    );
  };
}
