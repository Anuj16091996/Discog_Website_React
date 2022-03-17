import React from "react";

class Playlist extends React.Component {
  constructor(props) {
    super(props);
    // set initial state
    // do not use setState in constructor, write state directly
    this.state = {
      music_albums: [], // will contain dresses data array from server
      music_index: 0, // the index of the dress currently shown, start at first in array
      music_count: 0, // how many dresses in data array from server
      isLoaded: false, // will be true after data have been received from server
      error: null, // no errors yet !
      server_messgae: "",
      discog_albums: [],
      playlist_album: [],
      dropdownValue: 0,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({ dropdownValue: e.target.value });
  }

  componentDidMount() {
    fetch("https://localhost:8000/track").then((response) => {
      console.log(response);
      if (response.ok) {
        response.json().then((json_response) => {
          console.log(json_response.track);
          this.setState({
            music_albums: json_response.track,
            music_count: Object.keys(json_response.track).length,
            music_index: 0,
            isLoaded: true,
            error: null,
          });
        });
      } else {
        response.json().then((json_response) => {
          this.setState({
            isLoaded: false,
          });
        });
      }
    });
  }

  DeleteData = (id) => {
    //this.setState({[event.target.name]:event.target.value})

    let url = "https://localhost:8000/track/" + id;

    fetch(url, {
      method: "delete",
    }).then((response) => {
      if (response.ok) {
        this.setState({ server_messgae: "Data Deleted" });
        this.componentDidMount();
      } else {
        this.setState({ server_messgae: "Data can not be deleted" });
      }
    });
  };

  AddDataToPlayList = (id) => {
    this.setState({ "": this.state.discog_albums.splice(id, 1) });

    let playlist_id = this.state.dropdownValue;

    let title = this.state.discog_albums[id].title;

    let uri = "http://www.discogs.com" + this.state.discog_albums[id].uri;

    let master_id = this.state.discog_albums[id].master_id;

    let playlist = {
      title: title,
      playlist_id: playlist_id,
      uri: uri,
      master_id: master_id,
    };

    console.log(playlist);
    fetch("https://localhost:8000/track", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(playlist),
    }).then((response) => {
      if (response.ok) {
        this.setState({ server_messgae: "Data Inserted" });
        this.componentDidMount();
      } else {
        this.setState({ server_messgae: "Data Error" });
      }
    });
  };

  SearchDataThroughAPI = () => {
    let key = "ZyZwXQsAyfGdBUukMtkc";
    let secret = "ltXEwZDWSKFvbcZwFxqldAcSSyjSlDel";
    let search = document.getElementById("Artist_Name").value;
    document.getElementById("Artist_Name").value = "";

    let url =
      "https://api.discogs.com/database/search?key=" +
      key +
      "&secret=" +
      secret +
      "&artist=" +
      search +
      "&country=canada";
    console.log(url);
    fetch(url, {
      method: "get",
    }).then((response) => {
      if (response.ok) {
        response.json().then((json_response) => {
          if (Object.keys(json_response.results).length === 0) {
            this.setState({ server_messgae: "Not Found" });
          } else {
            this.setState({
              discog_albums: json_response.results,
            });
            console.log(json_response.results);
          }
        });
      } else {
        this.setState({ server_messgae: "API error" });
      }
    });

    fetch("https://localhost:8000/playlist").then((response) => {
      if (response.ok) {
        response.json().then((json_response) => {
          this.setState({
            playlist_album: json_response.track,
          });
        });
      }
    });
  };

  render() {
    let dataBaseArrayItems = this.state.music_albums.map((data, index) => {
      return (
        <tbody key={index}>
          <td>
            {data.title} <br />
            ID: {data.id}
            <br />
            Playlist :{data.playlist_title}
            <br />
            <a href={data.uri}> {data.uri} </a>
          </td>

          <td>
            <button onClick={() => this.DeleteData(data.id)}>Delete </button>
          </td>
        </tbody>
      );
    });

    let SelectItems = this.state.playlist_album.map((data, index) => {
      return (
        <option key={index} value={data.id}>
          {" "}
          {data.title}
        </option>
      );
    });

    let discordArrayItems = this.state.discog_albums.map((data, index) => {
      return (
        <tbody key={index}>
          <td>
            <b>{data.title}</b> <br />
            <img
              src={data.cover_image}
              alt="Cover_Image"
              height="200px"
              width="200px"
            />
            <br />
            Style :{data.style}
            <br />
            Format:{data.format}
            <br />
            ID: {data.id}
            <br />
            {data.country}-{data.year}
            <br />
            Master ID-{data.master_id}
            <br />
            <a href={data.uri}> {data.uri} </a>
            <br />
            <a href={"http://www.discogs.com" + data.uri}> More Information </a>
          </td>

          <td>
            Select your genre
            <br />
            <select
              value={this.state.dropdownValue}
              onChange={this.handleChange}
            >
              {SelectItems}
            </select>
          </td>

          <td>
            <button onClick={() => this.AddDataToPlayList(index)}> Add </button>
          </td>
        </tbody>
      );
    });
    return (
      <div>
        <p>Server Message: {this.state.server_messgae}</p>
        <div className="DisplayContent">
          <div className="Playlist">
            <h4>My Playlist</h4>
            <div className="">
              <table>{dataBaseArrayItems}</table>
              {console.log(dataBaseArrayItems)}
            </div>
          </div>

          <div className="API">
            <h4>Music Provided By Discogs.com </h4>
            <pre>
              <b>Search By Artist</b> <input type="text" id="Artist_Name" />
              <b> Candian releases only </b>
            </pre>

            <button onClick={() => this.SearchDataThroughAPI()}>Search </button>
            <br />

            <div>{discordArrayItems}</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Playlist;
