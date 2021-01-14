import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import { Link } from "react-router-dom";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";

export default class HomePage extends Component {
  static defaultProps = {
    votesToSkip: 2,
    guestCanPause: true,
    update: false,
    roomCode: null,
    updateCallback: () => {},
    successMsg: "",
    errorMsg: "",
  };
  constructor(props) {
    super(props);
    this.state = {
      guestCanPause: this.props.guestCanPause,
      votesToSkip: this.props.votesToSkip,
    };

    this.handleRoomButtonPress = this.handleRoomButtonPress.bind(this);
    this.handleVotesChange = this.handleVotesChange.bind(this);
    this.handleGuestCanPauseChange = this.handleGuestCanPauseChange.bind(this);
    this.renderUpdate = this.renderUpdate.bind(this);
    this.renderCreate = this.renderCreate.bind(this);

    this.handleUpdateButtonPress = this.handleUpdateButtonPress.bind(this);
  }

  handleVotesChange(e) {
    this.setState({ votesToSkip: e.target.value });
  }

  handleGuestCanPauseChange(e) {
    this.setState({ guestCanPause: e.target.value === "true" ? true : false });
  }
  handleRoomButtonPress() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
      }),
    };
    fetch("/api/create-room", requestOptions)
      .then((response) => response.json())
      .then((data) => this.props.history.push("/room/" + data.code));
  }

  handleUpdateButtonPress() {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        votes_to_skip: this.state.votesToSkip,
        guest_can_pause: this.state.guestCanPause,
        code: this.props.roomCode,
      }),
    };
    fetch("/api/update-room", requestOptions).then((response) => {
      if (response.ok) {
        this.setState({
          successMsg: "Room updated!",
        });
      } else {
        this.setState({
          errorMsg: "Error update",
        });
      }
      this.props.updateCallback();
    });
  }

  renderCreate() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="secondary"
            variant="contained"
            onClick={this.handleRoomButtonPress}
          >
            Create a Room
          </Button>
        </Grid>
        <Grid item xs={12} align="center">
          <Button color="Primary" variant="contained" to="/" component={Link}>
            Back
          </Button>
        </Grid>
      </Grid>
    );
  }

  renderUpdate() {
    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Button
            color="secondary"
            variant="contained"
            onClick={this.handleUpdateButtonPress}
          >
            Update Room
          </Button>
        </Grid>
      </Grid>
    );
  }

  render() {
    const title = this.props.update ? "Update a room" : "Create a room";

    return (
      <Grid container spacing={1}>
        <Grid item xs={12} align="center">
          <Collapse
            in={this.state.errorMsg != "" || this.state.successMsg != ""}
          >
            {this.state.successMsg != "" ? (
              <Alert
                severity="success"
                onClose={() => {
                  this.setState({ successMsg: "" });
                }}
              >
                {this.state.successMsg}
              </Alert>
            ) : (
              <Alert
                severity="error"
                onClose={() => {
                  this.setState({ errorMsg: "" });
                }}
              >
                {this.state.errorMsg}
              </Alert>
            )}
          </Collapse>
        </Grid>
        <Grid item xs={12} align="center">
          <Typography component="h4" variant="h4">
            {title}
          </Typography>
        </Grid>

        <Grid itme xs={12} align="center">
          <FormControl component="fieldset">
            <FormHelperText>
              <div align="center">Guest Control of Playback state</div>
              <RadioGroup
                row
                defaultValue={this.props.guestCanPause.toString()}
                onChange={this.handleGuestCanPauseChange}
              >
                <FormControlLabel
                  value="true"
                  control={<Radio color="primary" />}
                  label="Play/Pause"
                  labelPlacement="bottom"
                />
                <FormControlLabel
                  value="false"
                  control={<Radio color="secondary" />}
                  label="No control"
                  labelPlacement="bottom"
                />
              </RadioGroup>
            </FormHelperText>
          </FormControl>
          <Grid item xs={12} align="center">
            <FormControl>
              <TextField
                onChange={this.handleVotesChange}
                required={true}
                type="number"
                defaultValue={this.props.votesToSkip}
                inputProps={{ min: 1, style: { textAlign: "center" } }}
              />
              <FormHelperText>
                <div align="center">Votes Required to skip</div>
              </FormHelperText>
            </FormControl>
          </Grid>
          {this.props.update ? this.renderUpdate() : this.renderCreate()}
        </Grid>
      </Grid>
    );
  }
}
