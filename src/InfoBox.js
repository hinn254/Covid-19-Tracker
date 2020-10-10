import React from "react";
import { Card, CardContent, Typography } from "@material-ui/core";
import "./infobox.css";
const InfoBox = ({ active, isRed, title, cases, total, ...props }) => {
  return (
    <Card
      onClick={props.onClick}
      className={`infobox ${active && "infoBox--selected"} ${
        isRed && "infoBox--red"
      }`}
    >
      <CardContent>
        {/* title */}
        <Typography className="infoBox__title" color="textSecondary">
          {title}
        </Typography>
        {/* no of cases */}
        <h2 className={`infoBox__cases ${!isRed && "infoBox__cases--green"}`}>
          {cases}
        </h2>
        {/* total */}
        <Typography className="infoBox__total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoBox;
