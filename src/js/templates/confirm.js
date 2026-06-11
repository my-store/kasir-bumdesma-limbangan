import "../../scss/templates/confirm.scss";
import React, { Component } from "react";

export default class Confirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opened: false,
      title: "",
      detail: "",
      callback: null,
    };
  }

  openConfirmForm = (callback, title = "", detail = "") =>
    this.setState({ opened: true, callback, title, detail });

  closeConfirmForm = () => {
    $("#confirm-form")[0].reset();
    this.setState({ opened: false, detail: "", callback: null });
  };

  render() {
    const { opened, title, detail, callback } = this.state;
    const { theme } = this.props;
    return (
      <div
        className={opened ? "confirm-page confirm-page-active" : "confirm-page"}
      >
        <form id="confirm-form" onSubmit={(e) => e.preventDefault()}>
          <h1 className="form-title" style={{ backgroundColor: theme }}>
            {title}
          </h1>
          <div className="detail-container">
            <p>{detail}</p>
          </div>
          <div className="form-group form-btns">
            <button
              onClick={() => {
                callback();
                this.closeConfirmForm();
              }}
            >
              Iya
            </button>
            <div className="spacer"></div>
            <button onClick={this.closeConfirmForm}>Tidak</button>
          </div>
        </form>
      </div>
    );
  }
}
