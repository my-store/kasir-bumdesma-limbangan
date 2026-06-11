import { numberFormat } from "../../../api/helper/string";
import "../../../../scss/mesin-kasir/produk/obat.scss";
import { FiSearch } from "react-icons/fi";
import { BsDot } from "react-icons/bs";
import Loading from "react-loading";
import React, { Component } from "react";

export default class Main extends Component {
  chooseProduct = (id) => {
    this.props.chooseProduct({
      id: "Obat",
      data: id,
    });
  };

  render() {
    return (
      <div className="obatPertanian">
        <h1 style={{ backgroundColor: this.props.theme }}>
          <span>OBAT PERTANIAN</span>
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
          ) : this.props.obatPertanian.length > 0 ? (
            this.props.obatPertanian.map((data, index) => {
              const stok = parseInt(data.stok);
              return (
                <p
                  key={index}
                  onClick={() => this.chooseProduct(data.id)}
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
            })
          ) : (
            <p className="empty-data">Masih Kosong</p>
          )}
        </div>
        <form className="search-container" onSubmit={(e) => e.preventDefault()}>
          <FiSearch className="search-icon" width={12} height={12} />
          <input
            type="search"
            placeholder="Cari obat"
            className="search-product"
            onChange={({ target: { value } }) =>
              this.props.searchData("Obat", value)
            }
          />
        </form>
      </div>
    );
  }
}
