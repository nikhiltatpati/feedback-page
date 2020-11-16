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
      Swal.fire(`Option name successfully updates to ${optionName}`);

      const itemsRef = firebase.database().ref("items");
      itemsRef.child(item.id).set({
        count: item.count,
        option: optionName,
      });
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    const itemsRef = firebase.database().ref("items");
    const item = {
      option: this.state.currentOption,
      count: 0,
    };
    itemsRef.push(item);
    this.setState({
      currentOption: "",
      count: "",
    });
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
        });
      }
      this.setState({
        items: newState,
      });
    });
  }

  removeItem(itemId) {
    const itemRef = firebase.database().ref(`/items/${itemId}`);
    itemRef.remove();
  }


  
  render() {
    return (
      <div>
        <div className="container">
          <section className="add-item">
            <h3>Add Option</h3>
            <form onSubmit={this.handleSubmit}>
              <input
                type="text"
                name="currentOption"
                placeholder="Add new option"
                onChange={this.handleChange}
                value={this.state.currentOption}
              />
              <button>Add Option</button>
            </form>
          </section>
          <section className="display-item">
            <div className="wrapper">
              <ul>
                {this.state.items.map((item) => {
                  return (
                    <li key={item.id}>
                      <h3>
                        {item.option}
                        <i
                          class="fa fa-pencil"
                          style={{ margin: "10px", cursor: "pointer" }}
                          aria-hidden="true"
                          onClick={() => {
                            this.openModal(item);
                          }}
                        ></i>
                      </h3>
                      <p>
                        Count: {item.count}
                        <button onClick={() => this.removeItem(item.id)}>
                          Remove Option
                        </button>
                      </p>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </div>
      </div>
    );
  }
}
export default Admin;
