import React from "react";
import { withRouter } from "react-router-dom";
import { getByCampaignId, getPostsByCampaignId } from "../../services/campaign.service.js";
import { VerticalTimeline } from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { Button, Card } from "reactstrap";
import CampaignTimeline from "./CampaignTimeline";
import CampaignForm from "./CampaignForm";
import AddPostModal from "./AddPostModal.js";
import PostForm from "../posts/PostForm";

class CampaignMoreInfo extends React.Component {
  state = {
    success: false,
    error: false,

    businessId: undefined,
    businessName: undefined,
    campaignName: "",
    description: "",
    startDate: undefined,
    endDate: undefined,

    businesses: [],

    campaignId: undefined,

    readOnly: true,

    timelinePosts: [],

    ascending: true,

    noPosts: undefined,

    addPostModal: true,

    loading: false,

    intervalId: 0
  };

  componentDidMount() {
    const { campaignId } = this.props.match.params;
    if (campaignId) {
      this.setState({ loading: true });
      getByCampaignId(campaignId).then(response => {
        let startDate = moment(response.data.item.startDate);
        let endDate = moment(response.data.item.endDate);
        this.setState({
          campaignName: response.data.item.name,
          businessId: response.data.item.businessId,
          businessName: response.data.item.businessName,
          startDate,
          endDate,
          description: response.data.item.description,
          campaignId,
          loading: false
        });
        this.handlePrintPostsToTimeline(campaignId);
      });
    }
  }

  onChangeStartDate = startDate => {
    this.setState({ startDate });
  };

  onChangeEndDate = endDate => {
    this.setState({ endDate });
  };

  onChange = e => {
    const value = e.target.value;
    this.setState({ [e.target.name]: value });
  };

  handleCampaignsList = () => {
    this.props.history.push("/admin/campaigns");
  };

  handlePrintPostsToTimeline = campaignId => {
    this.setState({ loading: true });
    getPostsByCampaignId(campaignId)
      .then(response => {
        this.setState({
          error: false,
          success: true,
          timelinePosts: response.data.items,
          loading: false
        });
        if (response.data.items.length < 1) {
          this.setState({ noPosts: true });
        }
        if (response.data.items.length > 0) {
          this.setState({ noPosts: false });
        }
        this.orderPosts();
      })
      .catch(response =>
        this.setState({
          error: true,
          success: true
        })
      );
  };

  orderPosts = () => {
    if (!this.state.ascending) {
      let orderPosts = this.state.timelinePosts.sort(function(post1, post2) {
        post1 = new Date(post1.startDate);
        post2 = new Date(post2.startDate);
        return post1 > post2 ? -1 : post1 < post2 ? 1 : 0;
      });
      this.setState({ timelinePosts: orderPosts, ascending: true });
    } else {
      let orderPosts = this.state.timelinePosts.sort(function(post1, post2) {
        let post1StartDate = new Date(post1.startDate);
        let post2StartDate = new Date(post2.startDate);

        if (post1StartDate < post2StartDate) {
          return -1;
        } else if (post1StartDate === post2StartDate) {
          return 0;
        } else {
          return 1;
        }
      });
      this.setState({ timelinePosts: orderPosts, ascending: false });
    }
  };

  redirectToPostPage = () => {
    this.props.history.push("/admin/posts");
  };

  onVideoError = postId => {
    const timelinePosts = [...this.state.timelinePosts]; //makes a copy of an array first and then look through it; filter the copy
    const postToDisable = timelinePosts.filter(post => {
      return post.postId === postId;
    })[0];
    postToDisable.disable = true;
    this.setState({ timelinePosts });
  };

  handleRedirectToPosts = () => {
    this.props.history.push("/admin/posts/create/" + this.state.campaignId);
  };

  handleRedirectToEditPosts = postId => {
    this.props.history.push("/admin/posts/" + postId + "/campaigns/" + this.state.campaignId);
  };

  render() {
    const { campaignId } = this.props.match.params;

    return (
      <div>
        <div>
          <Card>
            <CampaignForm>
              <br />
              <div>
                <Button
                  type="button"
                  className="btn btn-primary mr-1"
                  onClick={this.handleRedirectToPosts}
                >
                  Create Post
                </Button>
              </div>
            </CampaignForm>
            <AddPostModal redirectToPostPage={this.redirectToPostPage}>
              <PostForm
                campaignId={this.state.campaignId}
                campaignName={this.state.campaignName}
                addPostModal={this.state.addPostModal}
              />
            </AddPostModal>
          </Card>
          {this.state.loading ? (
            <div className="_miSpinnerS" />
          ) : campaignId && this.state.noPosts === false ? (
            <section>
              <Button className="btn btn-primary" onClick={this.orderPosts}>
                {!this.state.ascending ? "Descending Order" : "Ascending Order"}
              </Button>
              <h1 className="text-center">Timeline</h1>
              <div className="gray">
                <VerticalTimeline className="text-center">
                  <CampaignTimeline
                    handleRedirectToEditPosts={this.handleRedirectToEditPosts}
                    timelinePosts={this.state.timelinePosts}
                    campaignId={this.state.campaignId}
                    onVideoError={this.onVideoError}
                  />
                </VerticalTimeline>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    );
  }
}

export default withRouter(CampaignMoreInfo);
