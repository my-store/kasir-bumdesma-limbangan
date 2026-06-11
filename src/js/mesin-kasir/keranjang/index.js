import { FiShoppingCart, FiTrash, FiMinus, FiPlus } from "react-icons/fi";
import "../../../scss/mesin-kasir/keranjang/index.scss";
import { numberFormat } from "../../api/helper/string";
import React, { Component } from "react";

export default class Main extends Component {
  setChange = async (_val) => {
    await this.props.reformatNumber(_val, "input-jumlah-uang");
    this.props.setChange(_val.replace(/\,/gi, ""));
  };

  render() {
    return (
      <form
        id="keranjang"
        className="keranjang"
        onSubmit={(e) => e.preventDefault()}
      >
        <h1 className="title" style={{ backgroundColor: this.props.theme }}>
          <span>KERANJANG</span>
          <FiShoppingCart size={16} />
        </h1>

        <div
          className="list"
          style={
            // Updated 2025
            this.props.openedOperationalForm && this.props.openedTimestampForm // Keduanya terbuka
              ? { height: 184, minHeight: 184 }
              : this.props.openedOperationalForm // Biaya operasional terbuka
                ? { height: 232, minHeight: 232 }
                : this.props.openedTimestampForm // Timestamp terbuka
                  ? { height: 217, minHeight: 217 }
                  : // Tak satupun terbuka
                    { height: 265, minHeight: 265 }
          }
        >
          {this.props.keranjang.daftar.length > 0 ? (
            this.props.keranjang.daftar.map((data, index) => {
              return (
                <div className="list-item" key={index}>
                  <p className="list-item-head">
                    <span>{data.namaBarang}</span>
                    <span className="list-action">
                      <FiMinus
                        title="Kurangi"
                        size={15}
                        style={{ cursor: "pointer" }}
                        onClick={() => this.props.decreaseAmount(data.id)}
                      />
                      <FiPlus
                        title="Tambah"
                        size={15}
                        style={{ cursor: "pointer", marginLeft: 5 }}
                        onClick={() => this.props.increaseAmount(data.id)}
                      />
                      <FiTrash
                        title="Hapus"
                        size={15}
                        style={{ cursor: "pointer", marginLeft: 5 }}
                        onClick={() => this.props.removeFromCart(data.id)}
                      />
                    </span>
                  </p>
                  <p className="list-item-price">
                    <span>Rp {numberFormat(data.hargaJual)}</span>
                    <span
                      title="Ubah jumlah pembelian"
                      onClick={() => this.props.openInputAmount(data.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {/* x{data.beli} {data.satuan} */}x
                      {numberFormat(data.beli)}
                    </span>
                    <span>Rp {numberFormat(data.hargaJual * data.beli)}</span>
                  </p>
                </div>
              );
            })
          ) : (
            <p className="empty-data">Masih Kosong</p>
          )}
        </div>

        <div className="tagihan">
          <p className="placeholder-total">
            {this.props.keranjang.total > 0
              ? "Rp " + numberFormat(this.props.keranjang.total)
              : "Rp 0"}
          </p>

          <p className="actual-total">
            {this.props.keranjang.total > 0 ? (
              numberFormat(
                this.props.keranjang.total + this.props.keranjang.operasional,
              )
            ) : (
              <span style={{ fontWeight: "normal" }}>-</span>
            )}
          </p>

          <p className="operasional-total">
            {this.props.keranjang.operasional > 0
              ? "Rp " + numberFormat(this.props.keranjang.operasional)
              : "Rp 0"}
          </p>
        </div>

        <div className="action">
          <div className="operasional">
            <div className="form-group">
              <input
                type="checkbox"
                disabled={this.props.keranjang.daftar.length > 0 ? false : true}
                onClick={this.props.openOperationalForm}
                className="check-biaya-operasional"
                style={
                  this.props.keranjang.daftar.length > 0
                    ? { cursor: "pointer" }
                    : null
                }
              />
              <label>Biaya Tambahan</label>
            </div>
            <div className="form-group form">
              <div
                className={
                  this.props.openedOperationalForm
                    ? "operational-form operational-form-active"
                    : "operational-form"
                }
              >
                <input
                  type="text"
                  className="input-keterangan-operasional"
                  placeholder="Keterangan"
                />
                <div className="spacer"></div>
                <input
                  type="text"
                  className="input-biaya-operasional"
                  placeholder="Total Biaya"
                  onChange={({ target: { value } }) =>
                    this.props.reformatNumber(value, "input-biaya-operasional")
                  }
                />
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <div className="timestamp-container">
            <div className="timestamp-btn">
              <input
                type="checkbox"
                disabled={this.props.keranjang.daftar.length > 0 ? false : true}
                onClick={this.props.openTimestamp}
                className="check-timestamp"
                style={
                  this.props.keranjang.daftar.length > 0
                    ? { cursor: "pointer" }
                    : null
                }
              />
              <label>Ubah Waktu</label>
            </div>
            <div
              className={
                this.props.openedTimestampForm
                  ? "hidden-timestamp hidden-timestamp-active"
                  : "hidden-timestamp"
              }
            >
              <div className="timestamp-input">
                <input
                  type="number"
                  onChange={this.props.setTimestamp}
                  placeholder="Tanggal"
                />
                <div className="spacer"></div>
                <input
                  type="number"
                  onChange={this.props.setTimestamp}
                  placeholder="Bulan"
                />
                <div className="spacer"></div>
                <input
                  type="number"
                  onChange={this.props.setTimestamp}
                  placeholder="Tahun"
                />
              </div>
              <p className="timestamp-preview">
                {
                  // Hari
                  this.props.timestamp.hari != "" &&
                  this.props.timestamp.tanggal != "" &&
                  this.props.timestamp.bulan != "" &&
                  this.props.timestamp.tahun.length > 3
                    ? this.props.timestamp.hari + ", "
                    : null
                }
                {
                  // Tanggal
                  this.props.timestamp.hari != "" &&
                  this.props.timestamp.tanggal != "" &&
                  this.props.timestamp.bulan != "" &&
                  this.props.timestamp.tahun.length > 3
                    ? this.props.timestamp.tanggal + " "
                    : "-"
                }
                {
                  // Bulan
                  this.props.timestamp.hari != "" &&
                  this.props.timestamp.tanggal != "" &&
                  this.props.timestamp.bulan != "" &&
                  this.props.timestamp.tahun.length > 3
                    ? this.props.timestamp.bulan + " "
                    : " - "
                }
                {
                  // Tahun
                  this.props.timestamp.hari != "" &&
                  this.props.timestamp.tanggal != "" &&
                  this.props.timestamp.bulan != "" &&
                  this.props.timestamp.tahun.length > 3
                    ? this.props.timestamp.tahun
                    : "-"
                }
              </p>
            </div>
          </div>
          <div className="kembalian">
            <div className="form-group">
              <div className="jumlah-uang">
                <label>Jumlah Uang</label>
                <input
                  className="input-jumlah-uang"
                  type="text"
                  placeholder="Rp"
                  disabled={
                    this.props.keranjang.daftar.length > 0 ? false : true
                  }
                  onChange={({ target: { value } }) => this.setChange(value)}
                />
              </div>
              <div className="spacer"></div>
              <div className="uang-kembalian">
                <label>Uang Kembalian</label>
                <p
                  className="jumlah-kembalian"
                  style={
                    this.props.keranjang.kembalian > 0
                      ? { color: "rgb(172, 0, 0)", background: "white" }
                      : { color: "rgb(129, 129, 129)", background: null }
                  }
                >
                  Rp{" "}
                  {this.props.keranjang.kembalian > 0
                    ? numberFormat(this.props.keranjang.kembalian)
                    : null}
                </p>
              </div>
            </div>
          </div>
          <div className="checkout">
            <div className="form-group">
              <button
                type="button"
                className="checkout-y"
                onClick={this.props.getTransaction}
                style={{ backgroundColor: this.props.theme }}
              >
                Bayar
              </button>
              <div className="spacer"></div>
              <button
                type="button"
                className="checkout-n"
                onClick={this.props.resetForm}
                style={{ backgroundColor: this.props.theme }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }
}
