import React from 'react';
import Modal from 'react-bootstrap-modal';

export default class RemoveConfirmModal extends React.Component {
  state = {
    confirmed: false,
  };

  onHide = () => {
    this.setState({ confirmed: false });
    this.props.done( false );
  }

  onOk = () => {
    this.setState({ confirmed: false });
    this.props.done( true );
  }

  toggleConfirmed = ( e ) => {
    this.setState({ confirmed: e.target.checked });
  }

  render() {
    let btnClasses = `btn btn-danger btn-confirm ${this.state.confirmed ? '' : 'disabled'}`;
    
    return(
      <Modal
          className="remove-confirm-modal"
          show={this.props.show}
          onHide={this.onHide}
          aria-labelledby="ModalHeader">
        <Modal.Header closeButton>
          <Modal.Title id='ModalHeader'>{this.props.title || 'Confirm'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
	  <p className="text-danger">{this.props.body}</p>
	  <div className="checkbox">
            <label><input type="checkbox" onChange={this.toggleConfirmed} checked={this.state.confirmed ? 'checked' : null}/>
              I understand that this action will <b>permanently</b> remove this item
              from the system.  This action cannot be undone.
            </label>
          </div>
        </Modal.Body>
        <Modal.Footer>
	  <Modal.Dismiss className='btn btn-default'>Cancel</Modal.Dismiss>
          <button onClick={this.onOk} type="button" className={btnClasses}>Commit</button>
        </Modal.Footer>
      </Modal>
    );
  }

}
