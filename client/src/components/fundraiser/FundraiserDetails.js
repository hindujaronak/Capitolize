import React, {Component} from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Row,
  Col,
  Form,
  FormGroup,
  FormInput,
  FormSelect,
  FormTextarea,
  Progress,
  Button
} from "shards-react";
import{
  getFromStorage,
  setInStorage
} from "../../utils/storage";

class UserAccountDetails extends Component{
  constructor(props){
    super(props)
    this.state = {
      title : this.props.title,
      user_id:'5ca2fb9ea5649e4670277662',
      isLoading: true,
      fundraiser_id: '5cb00ab08c079657cc58691c',
      fundraiser : {},
      donate : false,
      donateError:'',
      amount: 0,
      updatefund: 0
    }
    
  }
   handleChange = name => event => {
     console.log(this.state.amount)
    this.setState({[name]: event.target.value})
  }
  onDonateNow(){
      const {
        amount
      } = this.state

      this.setState({
        isLoading : true
      });
      
      fetch('http://localhost:5000/api/transaction/addTransaction', {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: this.state.amount,
          fundraiser_id: this.state.fundraiser_id,
          user_id: this.state.user_id
        }),
      })
      // .then((res => res.json())
      .then(json => {
        console.log('json', json);
        console.log('Amount is ' + this.state.amount)
        if(json.status === 200){
          this.setState({
            donateError: json.message,
            isLoading: false,
            donate: true
          });
          console.log("Donated")
          const fundraiser = this.state.fundraiser
          console.log(this.state.amount)
          this.state.updatefund =  fundraiser.amount  + parseInt(this.state.amount)
          this.props.setAlert()
        }
        else{
          this.setState({
            donateError: json.message,
            isLoading: false
          });
        }
      }); //add a closing bracket
      if(this.state.donate == true){
        
      }
  }
  componentDidMount(){
    this.setState({isLoading: false})
      console.log(this.state.fundraiser_id)
      fetch('http://localhost:5000/api/fundraiser/' + this.state.fundraiser_id, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        },
      })
      .then(res => res.text())
      .then(res => {

        this.setState({fundraiser : JSON.parse(res)})
        console.log("fundraiser is" + this.state.fundraiser);
        return this.state.fundraiser;
      })
    }


  render(){
    const fundraiser = this.state.fundraiser
    
    if(!this.state.donate){
      this.state.updatefund = fundraiser.amount
    }
    console.log(fundraiser)
    console.log(fundraiser._id)
    const title = this.state.title

    return(
      <div>
        
      <Row>
        <Col md="12">
          <Card small className="mb-4 pt-3">
            <CardHeader className="border-bottom text-center">
              <div className="mb-3 mx-auto">
                <img
                  src={title.avatar}
                  alt=""
                  width="110"
                />
              </div>
              <h4 className="mb-0">{fundraiser.title}</h4>
            </CardHeader>
            <ListGroup flush>
              <ListGroupItem className="p-4">
                <strong className="text-muted d-block mb-2">
                  {title.metaTitle}
                </strong>
                <span>{fundraiser.description}</span>
              </ListGroupItem>
              <ListGroupItem className="px-4">
                <div className="progress-wrapper">
                  <strong className="text-muted d-block mb-2">
                    {title.performanceReportTitle}
                  </strong>
                  <Progress
                    className="progress-sm"
                    value={title.performanceReportValue}
                  >
                    <span className="progress-value">
                      {title.performanceReportValue}%
                    </span>
                  </Progress>
                  <strong className="text-muted d-block mb-2">
                        Amount Needed : {this.state.updatefund}
                  </strong>
                  <Row>
                    <Col md="6">
                      <FormInput 
                      size="lg" 
                      placeholder="Enter the amount" 
                      name="amount" 
                      value={this.state.amount} onChange = {this.handleChange('amount')}/>
                    </Col>
                    <Col md="6">
                      <Button pill outline size="sm" className="mb-2" onClick = {() => this.onDonateNow()}>
                        <i className="material-icons mr-1" size="lg"></i> Donate Now
                      </Button>
                    </Col>
                  </Row>
                  
                </div>
              </ListGroupItem> 
            </ListGroup>
          </Card>
        </Col>
      </Row>        
      </div>
      
    )
  }
}


// UserAccountDetails.propTypes = {
//   /**
//    * The component's title.
//    */
//   title: PropTypes.string
// };

UserAccountDetails.defaultProps = {
  title: {
    avatar: require("./../../images/avatars/1.svg"),
    performanceReportTitle: "Amount raised",
    performanceReportValue: 35,
    metaTitle: "Description"
  }
};

export default UserAccountDetails;
