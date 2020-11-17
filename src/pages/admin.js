import React, { Component } from "react";
import firebase from "../firebase.js";
import Swal from "sweetalert2";

class Admin extends Component {
  constructor() {
    super();
    this.state = {
      currentOption: "",
      items: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkError = this.checkError.bind(this);
  }
  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value,
    });
  }

  async openModal(item) {
    const { value: optionName } = await Swal.fire({
      title: "Update the option name",
      input: "text",
      inputValue: item.option,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });

    if (optionName) {
      if (!this.checkError(optionName)) {
        Swal.fire(`Option name successfully updates to ${optionName}`);

        const itemsRef = firebase.database().ref("items");
        itemsRef.child(item.id).set({
          count: item.count,
          option: optionName,
        });
      }
    }
  }

  checkError(optionName) {
    let error = false;
    this.state.items.map((item) => {
      if (item.option === optionName) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Option with same name is already present",
        });
        error = true;
        this.setState({
          currentOption: "",
        });
      }
    });
    return error;
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.checkError(this.state.currentOption)) {
      const itemsRef = firebase.database().ref("items");
      const item = {
        option: this.state.currentOption,
        count: 0,
        deleted: false,
      };
      itemsRef.push(item);
      this.setState({
        currentOption: "",
      });
    }
  }

  componentDidMount() {
    const itemsRef = firebase.database().ref("items");
    itemsRef.on("value", (snapshot) => {
      let items = snapshot.val();
      let newState = [];
      for (let item in items) {
        newState.push({
          id: item,
          option: items[item].option,
          count: items[item].count,
          deleted: items[item].deleted,
        });
      }
      this.setState({
        items: newState,
      });
    });
  }

  removeItem(itemId) {
    const itemsRef = firebase.database().ref("items");
    itemsRef.child(itemId).update({
      deleted: true,
    });
  }

  reset(itemId) {
    const itemsRef = firebase.database().ref("items");
    itemsRef.child(itemId).update({
      deleted: false,
    });
  }

  render() {
    return (
      <div>
        <div>
          <div
            style={{
              margin: 20,
              background: "#d3d3d3",
              padding: 50,
            }}
          >
            <h3>Add Option</h3>
            <form onSubmit={this.handleSubmit}>
              <div class="input-group mb-3">
                <input
                  className="form-control"
                  placeholder="Add new option"
                  aria-label="Add new option"
                  aria-describedby="basic-addon1"
                  type="text"
                  name="currentOption"
                  onChange={this.handleChange}
                  value={this.state.currentOption}
                />
              </div>
              <button
                type="button"
                className="btn btn-primary"
                type="submit"
                style={{
                  width: "2vw",
                }}
              >
                Submit
              </button>
            </form>
          </div>
          <section>
            <div className="container">
              {this.state.items.map((item) => {
                return (
                  <div
                    className="card"
                    style={{
                      display: "inline-block",
                      width: "300px",
                      margin: 20,
                    }}
                    key={item.id}
                  >
                    <div className="card-body">
                      <h3 className="card-title">
                        <b>{item.option}</b>
                        <i
                          class="fa fa-pencil"
                          style={{ margin: "10px", cursor: "pointer" }}
                          aria-hidden="true"
                          onClick={() => {
                            this.openModal(item);
                          }}
                        ></i>
                      </h3>

                      <p className="card-text">
                        <b>Count: </b>
                        {item.count}
                      </p>
                      {!item.deleted && (
                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            this.removeItem(item.id);
                          }}
                        >
                          Remove Option
                        </button>
                      )}
                      {item.deleted && (
                        <div className="btn btn-info">Deleted</div>
                      )}
                      {item.deleted && (
                        <button
                          className="btn btn-warning"
                          style={{
                            margin: 10,
                          }}
                          onClick={() => {
                            this.reset(item.id);
                          }}
                        >
                          Undo
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    );
  }
}
export default Admin;
