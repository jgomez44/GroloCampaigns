import React from "react";
import moment from "moment";
import { CardBody, CardTitle, CardText } from "reactstrap";
import PropTypes from "prop-types";

const CampaignList = props => {
  return props.campaigns
    ? props.campaigns.map(campaign => (
        <div
          key={campaign.id}
          className="card py-2 my-2 border-primary"
          style={{
            display: "block",
            boxShadow: "0 6px 0 0 rgba(0, 0, 0, 0.01), 0 15px 32 px 0 rgba(0, 0, 0, 0.06)",
            border: "0",
            borderLeft: "2px solid green",
            borderRadius: "0.75rem",
            padding: "1.5em"
          }}
        >
          <CardBody>
            <CardTitle>{campaign.campaignName}</CardTitle>

            <CardText>{campaign.startDate && moment(campaign.startDate).format("L")}</CardText>

            <CardText>
              <strong>Description:</strong>{" "}
              {campaign.description.length < 50
                ? campaign.description
                : campaign.description.substring(0, 50) + "..."}
            </CardText>

            <CardText>
              <br />
              <a
                onClick={e => {
                  props.handleCampaignInfo(campaign.id);
                }}
              >
                <i className="fa fa-pencil-square-o fa-2x warning" aria-hidden="true" />
              </a>
            </CardText>
          </CardBody>
        </div>
      ))
    : null;
};
CampaignList.propTypes = {
  campaigns: PropTypes.array,
  search: PropTypes.string,
  pageIndex: PropTypes.number,
  pageSize: PropTypes.number,
  totalCount: PropTypes.number,
  totalPages: PropTypes.number,
  onhandleRedirect: PropTypes.func,
  onChangePageSize: PropTypes.func,
  onSearchChange: PropTypes.func,
  businessCampaigns: PropTypes.func,
  handleCampaignInfo: PropTypes.func
};

export default CampaignList;
