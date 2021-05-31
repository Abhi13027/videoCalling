import React, { useState } from "react";
import { Input, Button, Grid, Card } from "@material-ui/core";
import "./Home.css";
import Header from "../Header/Header";
import vcImage from "../../assets/vc.png";

const Home = ({ history }) => {
  const [url, setUrl] = useState("");

  const handleChange = (e) => {
    setUrl(e.target.value);
  };

  const join = () => {
    if (url !== "") {
      var newUrl1 = url.split("/");
      history.push(`/${newUrl1[newUrl1.length - 1]}`);
    } else {
      var newUrl2 = Math.random().toString(36).substring(2, 7);
      history.push(`${newUrl2}`);
    }
  };
  return (
    <div className="container2">
      <Header></Header>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{ height: "80vh" }}
      >
        <Grid item xs={12} md={6} direction="column" justify="center">
          <h1>Video Calling</h1>
          <p>
            A perfect solution for video calling to your friends and colleagues.
            Fast, Free And Reliable.
          </p>
          <Grid container>
            <Grid item xs={12}>
              <img
                alt="dsf"
                src={vcImage}
                style={{ width: "100%", height: "100%" }}
              ></img>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6} style={{ padding: "20px" }}>
          <Card style={{ padding: "40px" }} raised>
            <h2> Call Instantly</h2>
            <Input
              placeholder="Type Custom Link"
              onChange={handleChange}
            ></Input>
            <Button
              variant="contained"
              color="primary"
              style={{ margin: "20px" }}
              onClick={join}
            >
              Join Now
            </Button>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default Home;
