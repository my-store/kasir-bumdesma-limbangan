import React, { Component } from "react";
import Pupuk from "./pupuk";
import PupukSubsidi from "./pupuk-subsidi";
import Obat from "./obat";

export default class Main extends Component {
  render() {
    return (
      <div className="produk">
        <PupukSubsidi {...this.props} pupuk={this.props.pupukSubsidi} />
        <Pupuk {...this.props} pupuk={this.props.pupuk} />
        <Obat {...this.props} obatPertanian={this.props.obatPertanian} />
      </div>
    );
  }
}
