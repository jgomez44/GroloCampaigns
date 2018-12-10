import React from "react";
import { Route, withRouter } from "react-router-dom";
import CampaignContainer from "./CampaignContainer";
import "./Campaign.scss";
import CampaignForm from "./CampaignForm";
import CampaignInfo from "./CampaignInfo";

function Campaigns(props) {
  const prefix = props.match.path;

  return (
    <React.Fragment>
      <Route exact path={prefix} component={CampaignContainer} />
      <Route exact path={prefix + "/:campaignId(\\d+)"} component={CampaignInfo} />
      <Route exact path={prefix + "/create/:businessId(\\d+)"} component={CampaignForm} />
    </React.Fragment>
  );
}

export default withRouter(Campaigns);
