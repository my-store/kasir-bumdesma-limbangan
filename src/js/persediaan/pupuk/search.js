import { FiX } from "react-icons/fi";
import React, { Component } from "react";

export default class Search extends Component {
  render() {
    return (
      <form className="search-pupuk">
        <label>
          <span>Pencarian</span>
          <FiX
            onClick={this.props.close}
            size={15}
            style={{ cursor: "pointer" }}
            title="Tutup"
          />
        </label>
        <input
          onChange={({ target: { value } }) =>
            this.props.search(value, "Pupuk")
          }
          type="text"
          autoComplete="off"
          className="search-pupuk-input"
          placeholder="Cari pupuk"
        />
      </form>
    );
  }
}
