import React from 'react';

export default class CustomDataField extends React.Component {

  state = {
    error: null,
    data: this.stringify( this.props.value || '{}', null, 2 )
  };

  stringify( json ) {
    return JSON.stringify( json, null, 2 ).replace( /^\"/, '' ).replace( /\"$/, '' );
  }

  onChange = (e) => {
    this.setState({ error: undefined });
    this.setState({ data: e.target.value });
  }

  onBlur = () => {
    try {
      let json = JSON.parse( this.state.data.replace( "\n","" ) );
      this.props.onChange({ target: { value: json } });
    }
    catch(err) {
      console.error( err );
      this.setState({ error: 'Invalid JSON' });
    }
  }

  render() {
    return(
      <div>
	<textarea style={{width: '100%'}} className="form-control" rows={this.props.rows || 5} value={this.state.data} onChange={this.onChange} onBlur={this.onBlur}/>
	{this.state.error ? (
	   <p className="alert alert-danger"><span>{this.state.error}</span></p>
	) : null }
      </div>
    );
  }
}
