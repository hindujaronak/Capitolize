import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-bootstrap-modal';
import FileUpload from 'react-fileupload';

export default class ImportUsersModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filename: null,
      processing: false,
      finished: false,
      error: null,
      ignoreHeaders: true,
      disableNewUserWorkflow: false,
    };
  }

  componentDidMount() {
    this.view = ReactDOM.findDOMNode( this );
  }

  // We want the final upload button on the footer of the modal, but the react-fileupload
  // gizmo wants the button within its own children.  So we set the FileUpload uploadBtn to
  // be invisible, and programmatically click it for the user here.
  doImport = () => {
    var realBtn = this.refs[ 'uploadBtn' ];
    $(realBtn).click();
  }

  myHide() {
    // Clear out the state, then call the caller's hide.
    this.setState({ processing: false, finished: true, error: null, filename: null });
    if ( this.props.onHide ) this.props.onHide();
  }

  handleImportUsers = () => {
    this.doImport();
  }

  checkBox = ( field, e ) => {
    let v = {};
    v[ field ] = e.target.checked;
    this.setState( v );
  }

  render() {
    var btnLabel = 'Import';
    if ( this.state.processing ) btnLabel = 'Importing...';

    var fuOptions = {
      baseUrl: '/users/import',
      dataType: 'text',
      fileFieldName: 'file',
      textBeforeFiles: true,  // to send the non-file fields before the actual file
      paramAddToField: () => {
        return {
	  ignoreHeaders: this.state.ignoreHeaders,
	  disableNewUserWorkflow: this.state.disableNewUserWorkflow,
	  accountId: this.props.accountId,
	};
      },
      chooseFile: (files) => {
        // Show the selected file name
        var filename = ( typeof files == 'string' ? files : files[0].name );
        this.setState({ filename: filename });
      },
      beforeUpload: ( files ) => {
        // can do validation here, return false to cancel the upload

        if ( ! files ) {
          this.setState({ processing: false, finished: false, error: 'Please choose a file to import' });
          return false;
        }

        this.setState({ processing: true, finished: false, error: null });
        return true;
      },
      uploadSuccess: ( res ) => {
        this.setState({ processing: false, finished: true, error: null, filename: null });
        this.props.success( res );
      },
      uploadError: ( err ) => {
        this.setState({ processing: false, finished: true, error: err });
      },
      uploadFail: ( err ) => {
        this.setState({ processing: false, finished: true, error: err });
      }
    };

    return(
      <Modal
        show={this.props.show}
        onHide={this.myHide.bind(this)}
        aria-labelledby="ModalHeader"
        >
        <Modal.Header closeButton>
          <Modal.Title>Import Users</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Upload a CSV file with names and emails to invite users in bulk.  Use <a href="/import-users-example.csv">this template</a> as a starting point to create your CSV file.
          </p>
	  <div>
	    <input type="checkbox" name="ignoreHeaders" checked={this.state.ignoreHeaders} onChange={this.checkBox.bind(this,'ignoreHeaders')}/>The first row is a header row.
	  </div>
	  <div>
	    <input type="checkbox" name="disableNewUserWorkflow" checked={this.state.disableNewUserWorkflow} onChange={this.checkBox.bind(this,'disableNewUserWorkflow')}/>Do not send new user invite emails.
	  </div>
	  <div>&nbsp;</div>
          <FileUpload className="fu" options={fuOptions}>
            <button ref="chooseBtn" className="btn btn-primary">Choose file</button><span>{this.state.filename}</span>
            <button ref="uploadBtn" style={{visibility: 'hidden'}}></button>
          </FileUpload>
          {this.state.error ? (
             <div className="alert alert-danger" role="alert" style={{marginTop: '8px'}}>{this.state.error}</div>
           ) : null }
        </Modal.Body>
        <Modal.Footer>
          <Modal.Dismiss className='btn btn-default'>Cancel</Modal.Dismiss>
          <button className="btn btn-primary"
		  onClick={this.handleImportUsers}
		  disabled={!this.state.filename}>
            {btnLabel}
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

