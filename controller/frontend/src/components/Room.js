import React, { Component } from "react";
import { Grid, Button, Typography } from "@material-ui/core";
import { Link } from "react-dom";
import CreateRoomPage from "./CreateRoomPage";

export default class Room extends Component {
  constructor(props) {
    super(props);

    this.state = {
      guestCanPause: true,
      votesToSkip: 2,
      isHost: false,
      isValid: true,
      showSetting: false,
    };

    this.roomCode = this.props.match.params.roomCode;
    this.getRoomDetails();
    this.leaveButtonPressed = this.leaveButtonPressed.bind(this);
    this.getRoomDetails = this.getRoomDetails.bind(this);
    this.getBack = this.getBack.bind(this);
    this.updateShowSetting = this.updateShowSetting.bind(this);
    this.renderSetting = this.renderSetting.bind(this);
    this.renderSettingButton = this.renderSettingButton.bind(this);
  }

  updateShowSetting(value) {
    this.setState({
      showSetting: value,
    });
  }

  renderSettingButton() {
    return (
      <Grid item xs={12} align="center">
        <Button
          variant="contained"
          color="primary"
          onClick={() => this.updateShowSetting(true)}
        >
          Settings
        </Button>
      </Grid>
    );
  }

  renderSetting() {
    return (
      <Grid container spacing={3}>
        <Grid item xs={12} align="center">
          <CreateRoomPage
            update={true}
            votesToSkip={this.state.votesToSkip}
            guestCanPause={this.state.guestCanPause}
            roomCode={this.roomCode}
            updateCallback={this.getRoomDetails}
          ></CreateRoomPage>
        </Grid>
        <Grid item xs={12} align="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => this.updateShowSetting(false)}
          >
            close
          </Button>
        </Grid>
      </Grid>
    );
  }

  getBack() {
    this.props.history.push("/");
  }

  getRoomDetails() {
    fetch("/api/get-room" + "?code=" + this.roomCode).then((response) => {
      if (response.ok) {
        response.json().then((data) => {
          this.setState({
            votesToSkip: data.votes_to_skip,
            guestCanPause: data.guest_can_pause,
            isHost: data.is_host,
            isValid: true,
          });
        });
      } else {
        this.props.leaveRoomCallBack();
        this.setState({ isValid: false });
      }
    });
  }
  leaveButtonPressed() {
    const requestOptions = {
      method: "POST",
      header: { "Content-Type": "application/json" },
    };
    fetch("/api/leave-room", requestOptions).then((response) => {
      console.log("Leaving room");
      this.props.leaveRoomCallBack();
      this.props.history.push("/");
    });
  }

  render() {
    if (!this.state.isValid) {
      return (
        <Grid container spacing={1}>
          <Grid item xs={12} align="center">
            <Typography variant="h4" component="h4">
              Room not exist
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <Button
              variant="contained"
              color="secondary"
              onClick={this.getBack}
            >
              Back
            </Button>
          </Grid>
        </Grid>
      );
    }
    if(this.state.showSetting){
      return this.renderSetting()
    }

    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Typography variant="h4" component="h4">
            Code: {this.roomCode}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h4">
            Votes: {this.state.votesToSkip}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h4">
            guestCanPause: {this.state.guestCanPause.toString()}
          </Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography variant="h6" component="h4">
            isHost: {this.state.isHost.toString()}
          </Typography>
        </Grid>
        {this.state.isHost ? this.renderSettingButton() : null}
        <Grid item xs={12} align="center">
          <Button
            color="secondary"
            variant="contained"
            onClick={this.leaveButtonPressed}
          >
            Leave
          </Button>
        </Grid>
      </Grid>
    );
  }
}
/*
<div>
        <h3>{this.roomCode}</h3>
        <p>Votes: {this.state.votesToSkip}</p>
        <p>guestCanPause: {this.state.guestCanPause.toString()}</p>
        <p>isHost: {this.state.isHost.toString()}</p>
      </div>
  */
