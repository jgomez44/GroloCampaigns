import React from "react";
import { withRouter } from "react-router-dom";
import "react-vertical-timeline-component/style.min.css";
import "react-datepicker/dist/react-datepicker.css";
import { VerticalTimelineElement } from "react-vertical-timeline-component";
import ReactPlayer from "react-player";
import moment from "moment";

const CampaignTimeline = props => {
  return props.campaignId
    ? props.timelinePosts.map(post => (
        <VerticalTimelineElement
          key={post.postId}
          className="vertical-timeline-element--work"
          iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
        >
          <div className="timeline-card card border-grey border-lighten-2">
            <div className="card-header">
              <h4 className="card-title mb-0">{moment(post.startDate).format("L")}</h4>
              <div className="card-subtitle text-muted mt-0">
                <span className="font-small-3">Message: {post.message}</span>
              </div>
            </div>
            <div className="card-body">
              {post.photoUrl ? (
                <img
                  className="img-fluid"
                  src={post.photoUrl}
                  alt="Unable to show photograph."
                  height="50px"
                />
              ) : null}
              {post.videoUrl && !post.disable ? (
                <div className="card-block">
                  <div className="embed-responsive embed-responsive-4by3">
                    <ReactPlayer
                      height="50px"
                      url={post.videoUrl}
                      onError={e => props.onVideoError(post.postId)}
                    />
                  </div>
                </div>
              ) : !post.videoUrl ? null : (
                <div>
                  <br />
                  <span>Unable to play video.</span>
                  <br />
                  <br />
                </div>
              )}
              <div className="card-footer px-0 py-0">
                <div className="card-block">
                  <div className="media">
                    <div className="media-left mr-2">
                      <a
                        className="campaignPostEdit"
                        onClick={() => props.handleRedirectToEditPosts(post.postId)}
                      >
                        <i className="fa fa-pencil-square-o warning fa-2x" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </VerticalTimelineElement>
      ))
    : null;
};

export default withRouter(CampaignTimeline);
