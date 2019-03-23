import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import utils from '../lib/utils';

export default class AccountPicker extends React.Component {

  getOptions = ( input, cb ) => {
    utils.makeRequest( '/accounts/select_list', { q: input } ).then( (list) => {
      cb( null, list );
    }).fail((err) => {
      cb( err );
    });
  }

  render() {
    return(
      <Select.Async {...this.props} loadOptions={this.getOptions} autoload={true} />
    );
  }
  
}
