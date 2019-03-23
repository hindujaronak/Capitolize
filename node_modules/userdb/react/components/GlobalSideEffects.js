/*
   This component uses react-side effect to manage side effects like page title and
   theming.  Anything else like this can be added.
 */
var React = require('react'),
    withSideEffect = require('react-side-effect');

function reducePropsToState(propsList) {
  var myProps = {};

  /*
     This takes the list of prop structures from topmost child to leaf, and merges
     the props we care about, letting lower children to override higher children.
     Returns the merged props.
   */
  propsList.forEach( function( innermostProps ) {
    [ 'title', 'theme', 'bodyClass' ].forEach( function( p ) {
      if ( innermostProps[ p ] ) myProps[ p ] = innermostProps[ p ];
    });
  });
  return myProps;
}

function handleStateChangeOnClient( props ) {
  /*
     Apply the props we are looking at
   */
  if ( props ) {
    
    // document title
    if ( props.title ) document.title = props.title;

    // set a theme attribute on the body
    if ( props.theme ) $('body' ).attr( 'theme', props.theme );

    // add a class to the body
    if ( props.bodyClass ) $('body').attr( 'class', props.bodyClass );
  }
}

var GlobalSideEffects = React.createClass({
  render: function render() {
    if (this.props.children) {
      return React.Children.only(this.props.children);
    } else {
      return null;
    }
  }
});

module.exports = withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient
)(GlobalSideEffects);
