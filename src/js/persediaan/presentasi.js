import { DaftarPupukSubsidi } from "./pupuk-subsidi";
import { DaftarPupuk } from "./pupuk";
import { DaftarObat } from "./obat";
import React, { Component } from "react";

export default class Presentasi extends Component {
  render() {
    return (
      <div className="presentasi">
        <DaftarPupukSubsidi
          {...this.props}
          data={this.props.data.pupukSubsidi}
        />
        <DaftarPupuk {...this.props} data={this.props.data.pupuk} />
        <DaftarObat {...this.props} data={this.props.data.obatPertanian} />
      </div>
    );
  }
}
