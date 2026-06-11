import React, { PureComponent } from "react";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { indexOf } from "../api/helper/calendar";
import { numberFormat } from "../api/helper/string";
import "../../scss/mesin-kasir/struk/print.scss";

export default class Print extends PureComponent {
  render() {
    const { tanggal, bulan, tahun, jam, menit, detik, format } =
      this.props.time;

    const { dataToko } = this.props;

    // Total transaksi
    let total = 0;

    const { operasional, produk, jumlahUang, kembalian } = this.props.strukData;

    // Zoom paper if produk > 15
    if (produk.length >= 15) {
      $(".mesin-kasir .print-struk-container").css({
        zoom: "90%",
      });
    }

    return (
      <div className="print-struk">
        <div className="print-struk-head">
          <h1 className="print-struk-head-office">
            BUMDESMA UNGGUL PERKASA
            <br />
            LIMBANGAN KERSANA
            {/* <br /> */}
            <span>- - - - - - - - - - - - - - - - -</span>
          </h1>
          {/* <p className="print-struk-head-address">
            JL. Raya Bulusari KM-1,5 Desa Bulusari
            <br />
            Bulakamba - Brebes
          </p>
          <p className="print-struk-head-phone">
            <AiOutlineWhatsApp style={{ marginRight: 3 }} size={15} />
            0852 9529 1721 - 0858 6511 4787
          </p> */}
        </div>

        {/* Produk */}
        <div className="print-struk-body">
          {produk && produk.length > 0
            ? produk.map((_d, index) => {
                // Total per-transaksi
                const perTransaksi = parseInt(_d.hargaJual) * parseInt(_d.beli);

                // Increase total transaksi
                total += perTransaksi;

                return (
                  <p key={index} className="print-struk-produk">
                    <span className="print-struk-produk-nama">
                      {_d.namaBarang}
                    </span>
                    <span className="print-struk-produk-qty">{_d.beli}</span>
                    <span className="print-struk-produk-jumlah">
                      {numberFormat(perTransaksi)}
                    </span>
                  </p>
                );
              })
            : null}
        </div>

        {/* Tambahan/ PPN */}
        {parseInt(operasional.biaya) > 0 ? (
          <p className="print-struk-tambahan">
            <span>{operasional.keterangan}</span>
            <span>{numberFormat(operasional.biaya)}</span>
          </p>
        ) : null}

        <p className="print-struk-line"></p>

        {/* Total */}
        <p className="print-struk-total">
          {/* Langsung tambahkan "biaya tambahan" jika ada */}
          <span>TOTAL</span>
          <span>{numberFormat(total + parseInt(operasional.biaya))}</span>
        </p>

        <p className="print-struk-line"></p>

        {/* Jumlah Uang */}
        <p className="print-struk-uang">
          <span>Jumlah Uang</span>
          <span>{numberFormat(jumlahUang)}</span>
        </p>

        {/* Kembalian */}
        <p className="print-struk-kembalian">
          <span>Kembalian</span>
          <span>{parseInt(kembalian) > 0 ? numberFormat(kembalian) : "-"}</span>
        </p>

        <p className="print-struk-line"></p>

        {/* Footer */}
        <div className="print-struk-footer">
          <p className="thanks">- TERIMAKASIH -</p>
          <p className="timestamp">
            {tanggal}/{indexOf(bulan) + 1}/{tahun} - {jam}:{menit}:{detik}{" "}
            {format}
          </p>
        </div>

        {/* Spacer */}
        <p className="print-struk-spacer">.</p>
      </div>
    );
  }
}
