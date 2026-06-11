import { numberFormat } from "../../../api/helper/string";
import "../../../../scss/mesin-kasir/produk/pupuk-subsidi.scss";
import { FiSearch } from "react-icons/fi";
import { BsDot } from "react-icons/bs";
import Loading from "react-loading";
import React, { Component } from "react";

export default class Main extends Component {
  render() {
    return (
      <div className="pupuk-subsidi">
        <h1 style={{ backgroundColor: this.props.theme }}>
          <span>PUPUK SUBSIDI</span>
          <span className="title-indicator">
            Harga
            <BsDot width={5} height={5} color="#eee" />
            Stok
          </span>
        </h1>
        <div className="list">
          {this.props._isLoading ? (
            <div className="loading">
              <Loading width={50} height={50} type="bubbles" color="grey" />
            </div>
          ) : null}
          {this.props.pupukSubsidi.map((data, index) => {
            const stok = parseInt(data.stok);
            return (
              <p
                key={index}
                className="item"
                onClick={() =>
                  this.props.chooseProduct({
                    id: "PupukSubsidi",
                    data: data.id,
                  })
                }
                // Update 2025
                title={`
${data.namaBarang.length > 22 ? data.namaBarang : ""}
Harga Pokok = Rp ${numberFormat(data.hargaPokok)}
`}
              >
                <span>{data.namaBarang.substring(0, 22)}</span>
                {stok < 1 ? <span className="empty-stok">Habis</span> : null}
                <span className="item-indicator">
                  Rp {numberFormat(data.hargaJual)}
                  <BsDot width={5} height={5} color={this.props.theme} />
                  {numberFormat(stok)}
                </span>
              </p>
            );
          })}
          {this.props.pupukSubsidi.length == 0 ? (
            <p className="empty-data">Masih Kosong</p>
          ) : null}
        </div>
        <form className="search-container" onSubmit={(e) => e.preventDefault()}>
          <FiSearch className="search-icon" width={12} height={12} />
          <input
            type="search"
            placeholder="Cari pupuk"
            className="search-product"
            onChange={({ target: { value } }) =>
              this.props.searchData("PupukSubsidi", value)
            }
          />
        </form>
      </div>
    );
  }
}
