import React from "react";
import PropTypes from "prop-types";
import { 
  Container, 
  Row, 
  Col, 
  Card,
  CardBody,
  CardFooter,
  Badge,
  Button } from "shards-react";

import PageTitle from "./../components/common/PageTitle";
import SmallStats from "./../components/common/SmallStats";
import UsersOverview from "./../components/blog/UsersOverview";
import UsersByDevice from "./../components/blog/UsersByDevice";
import Discussions from "./../components/blog/Discussions";
import TopReferrals from "./../components/common/TopReferrals";

import{
  getFromStorage,
  setInStorage
} from "./../utils/storage";

import backgroundImage from "./../images/Logo3.png";

class BlogOverview extends React.Component {
  constructor(props){
    super(props)
    console.log(props)
    this.state={
      smallStats:  [
        {
          label: "Page Hits",
          value: "2,390",
          percentage: "4.7%",
          increase: true,
          chartLabels: [null, null, null, null, null, null, null],
          attrs: { md: "6", sm: "6" },
          datasets: [
            {
              label: "Today",
              fill: "start",
              borderWidth: 1.5,
              backgroundColor: "rgba(0, 184, 216, 0.1)",
              borderColor: "rgb(0, 184, 216)",
              data: [1, 2, 1, 3, 5, 4, 7]
            }
          ]
        },
        {
          label: "Ideas",
          value: "182",
          percentage: "12.4",
          increase: true,
          chartLabels: [null, null, null, null, null, null, null],
          attrs: { md: "6", sm: "6" },
          datasets: [
            {
              label: "Today",
              fill: "start",
              borderWidth: 1.5,
              backgroundColor: "rgba(23,198,113,0.1)",
              borderColor: "rgb(23,198,113)",
              data: [1, 2, 3, 3, 3, 4, 4]
            }
          ]
        },
        {
          label: "Registrations",
          value: "8,147",
          percentage: "3.8%",
          increase: false,
          decrease: true,
          chartLabels: [null, null, null, null, null, null, null],
          attrs: { md: "4", sm: "6" },
          datasets: [
            {
              label: "Today",
              fill: "start",
              borderWidth: 1.5,
              backgroundColor: "rgba(255,180,0,0.1)",
              borderColor: "rgb(255,180,0)",
              data: [2, 3, 3, 3, 4, 3, 3]
            }
          ]
        },
        {
          label: "New Users",
          value: "29",
          percentage: "2.71%",
          increase: false,
          decrease: true,
          chartLabels: [null, null, null, null, null, null, null],
          attrs: { md: "4", sm: "6" },
          datasets: [
            {
              label: "Today",
              fill: "start",
              borderWidth: 1.5,
              backgroundColor: "rgba(255,65,105,0.1)",
              borderColor: "rgb(255,65,105)",
              data: [1, 7, 1, 3, 1, 4, 8]
            }
          ]
        },
        {
          label: "Contributions",
          value: "17,281",
          percentage: "2.4%",
          increase: false,
          decrease: true,
          chartLabels: [null, null, null, null, null, null, null],
          attrs: { md: "4", sm: "6" },
          datasets: [
            {
              label: "Today",
              fill: "start",
              borderWidth: 1.5,
              backgroundColor: "rgb(0,123,255,0.1)",
              borderColor: "rgb(0,123,255)",
              data: [3, 2, 3, 2, 4, 5, 4]
            }
          ]
        }
      ],
      PostsListOne: [
        {
          backgroundImage: require("../images/Logo3.png"),
          category: "Aviation",
          categoryTheme: "dark",
          author: "Abdul Rashid ",
          authorAvatar: require("../images/avatars/1.jpg"),
          title: "Conduct at an replied removal an amongst",
          description:
            "However venture pursuit he am mr cordial. Forming musical am hearing studied be luckily. But in for determine what would see...",
          date: "28 February 2019"
        },
        {
          backgroundImage: require("../images/Logo5.png"),
          category: "Automobile",
          categoryTheme: "info",
          author: "Hassan Izz-Al-Din",
          authorAvatar: require("../images/avatars/2.jpg"),
          title: "Off tears are day blind smile alone had ready",
          description:
            "Is at purse tried jokes china ready decay an. Small its shy way had woody downs power. To denoting admitted speaking learning my...",
          date: "29 February 2019"
        },
        {
          backgroundImage: require("../images/Logo3.png"),
          category: "Chemicals",
          categoryTheme: "royal-blue",
          author: "Osama bin Laden",
          authorAvatar: require("../images/avatars/2.jpg"),
          title: "Difficult in delivered extensive at direction",
          description:
            "Is at purse tried jokes china ready decay an. Small its shy way had woody downs power. To denoting admitted speaking learning my...",
          date: "29 February 2019"
        },
        {
          backgroundImage: require("../images/Logo5.png"),
          category:"Defence",
          categoryTheme: "warning",
          author: "Khalid Sheikh Mohammed",
          authorAvatar: require("../images/avatars/3.jpg"),
          title: "It so numerous if he may outlived disposal",
          description:
            "How but sons mrs lady when. Her especially are unpleasant out alteration continuing unreserved ready road market resolution...",
          date: "29 February 2019"
        }
      ]
    }

  }

  componentDidMount() {
    fetch('http://localhost:5000/api/fundraiser/allFundraisers', {
      method: 'GET',
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(json => {
      console.log('json', json);
      if(json){
        this.setState({
          PostsListOne: json.docs
        });
      }
      else{
        this.setState({
          addError: "Bhavika is crazy",
          isLoading: false,
          isSubmitted: false
        });
      }
    })
  }

  render(){
    return(
      <Container fluid className="main-content-container px-4">
        {/* Page Header */}
        <Row noGutters className="page-header py-4">
          <PageTitle title="Dashboard" subtitle="Trending fundraisers and activities" className="text-sm-left mb-3" />
        </Row>

        <Row>
          {this.state.PostsListOne.map((post, idx) => {
            if (idx >= 4) {
              return 
            }
            console.log(post._id)
            return (
            <Col lg="3" md="6" sm="12" className="mb-4" key={idx}>
              <Card small className="card-post card-post--1">
                <div
                  className="card-post__image"
                  style={{ backgroundImage: `url('${backgroundImage}')` }}
                >
                  <Badge
                    pill
                    className={`card-post__category bg-${post.categoryTheme}`}
                  >
                    {post.sector}
                  </Badge>
                  <div className="card-post__author d-flex">
                    <a
                      href="/"
                      className="card-post__author-avatar card-post__author-avatar--small"
                      style={{ backgroundImage: `url('../images/avatars/2.jpg')` }}
                    >
                      Written by {post.author}
                    </a>
                  </div>
                </div>
                <CardBody>
                  <h5 className="card-title">
                    <a href="/fundraiser/{post_id}" className="text-fiord-blue">
                      {post.title.substring(0, 40)}
                    </a>
                  </h5>
                  {/* <p className="card-text d-inline-block mb-3"> */}
                    {post.description.substring(0, 100).concat("....")}
                    <a href="/fundraiser/{post_id}" className="e">Read more
                    </a>
                  <br></br>
                  <span className="text-muted">{"Rs. "+post.amount}</span>
                </CardBody>
              </Card>
            </Col>
            )
          })
        }
        </Row>

        <Row>
          {/* Discussions */}
          <Col lg="8" md="12" sm="12" className="mb-4">
            <Discussions />
          </Col>

          {/* Top Referrals */}
          <Col lg="4" md="12" sm="12" className="mb-4">
            <TopReferrals />
          </Col>

          {/* Users Overview */}
          <Col lg="8" md="12" sm="12" className="mb-4">
            <UsersOverview />
          </Col>

          {/* Users by Device */}
          <Col lg="4" md="6" sm="12" className="mb-4">
            <UsersByDevice />
          </Col>
        </Row>

        {/* Small Stats Blocks */}
        <Row>
          {this.state.smallStats.map((stats, idx) => (
            <Col className="col-lg mb-4" key={idx} {...stats.attrs}>
              <SmallStats
                id={`small-stats-${idx}`}
                variation="1"
                chartData={stats.datasets}
                chartLabels={stats.chartLabels}
                label={stats.label}
                value={stats.value}
                percentage={stats.percentage}
                increase={stats.increase}
                decrease={stats.decrease}
              />
            </Col>
          ))}
        </Row>


      </Container>
    )
  }
}

BlogOverview.propTypes = {
  /**
   * The small stats dataset.
   */
  smallStats: PropTypes.array,
  PostsListOne: PropTypes.array
};

BlogOverview.defaultProps = {
  
};

export default BlogOverview;
