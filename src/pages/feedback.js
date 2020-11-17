import React from "react";
import firebase from "../firebase.js";
import Swal from "sweetalert2";

export default class Feedback extends React.Component {
  constructor() {
    super();
    this.setItems = this.setItems.bind(this);
  }
  state = {
    items: [],
  };

  setItems(items) {
    this.setState({ items });
  }

  componentDidMount() {}

  openDialog = async () => {
    let data = {};
    const inputOptions = new Promise((resolve) => {
      const itemsRef = firebase.database().ref("items");
      itemsRef.on("value", (snapshot) => {
        let items = snapshot.val();
        let newState = [];

        for (let item in items) {
          if (!items[item].deleted) {
            newState.push({
              id: item,
              option: items[item].option,
              count: items[item].count,
            });
          }
        }
        this.setState({ items: newState });
        newState.map((item) => (data[item.id] = item.option));

        resolve(data);
      });
    });

    const { value: option } = await Swal.fire({
      title: "Give Feedback!!!",
      input: "radio",
      inputOptions: inputOptions,
      inputValidator: (value) => {
        if (!value) {
          return "You need to choose something!";
        }
      },
    });

    if (option) {
      Swal.fire({ html: `You selected: ${data[option]}` }).then(() => {
        window.location.href = "/";
      });
      const element = this.state.items.filter((item) => item.id === option);
      const itemsRef = firebase.database().ref("items");
      itemsRef.child(option).set({
        count: element[0].count + 1,
        option: data[option],
        deleted: false,
      });
    }
  };
  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100vh",
        }}
      >
        <button onClick={this.openDialog}>Uninstall</button>
      </div>
    );
  }
}
