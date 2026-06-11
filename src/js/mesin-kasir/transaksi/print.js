import "../../../scss/mesin-kasir/transaksi/print.scss";
import { numberFormat } from "../../api/helper/string";
import { GetNeraca } from "../../api/neraca";
import React, { PureComponent } from "react";

const Head = ({ data: { title, time } }) => {
  return (
    <div className="transaksi-print-head">
      <p className="transaksi-print-head-title">{title}</p>
      <p className="transaksi-print-head-sub-title">{time}</p>
    </div>
  );
};

export default class Print extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      kas: 0,
    };
  }

  async componentDidMount() {
    const {
      aktiva: { kas },
    } = await GetNeraca(this.props.workTime);
    this.setState({ kas });
  }

  render() {
    const { list } = this.props._printData;

    // Omset
    let omsetObat = 0;
    let omsetPupuk = 0;
    let omsetTotal = 0;

    // Margin
    let marginObat = 0;
    let marginPupuk = 0;
    let marginTotal = 0;

    return (
      <div className="transaksi-print">
        <Head data={this.props._printData} />

        <div className="transaksi-print-body">
          <div className="transaksi-print-body-left">
            <div className="transaksi-table">
              <div className="transaksi-table-head">
                <p className="transaksi-table-head-title">PENJUALAN</p>
              </div>
              <div className="transaksi-table-body">
                {list.length > 0
                  ? list.map((data, index) => {
                      const { produk, operasional } = data;

                      // Biaya tambahan
                      let { biaya } = operasional;
                      biaya = parseInt(biaya) / produk.length;

                      // Increase omset (total)
                      omsetTotal += parseInt(biaya);
                      // Increase margin (total)
                      marginTotal += parseInt(biaya);

                      return (
                        <p key={index} className="transaksi-table-body-item">
                          {produk.map((_prd, _xPrd) => {
                            const {
                              namaBarang,
                              hargaJual,
                              hargaPokok,
                              beli,
                              satuan,
                              tipeProduk,
                            } = _prd;

                            // Total per produk
                            const totalPerProduk =
                              parseInt(hargaJual) * parseInt(beli);

                            // Margin per produk
                            const marginPerProduk =
                              parseInt(hargaJual) - parseInt(hargaPokok);

                            // Increase omset (total)
                            omsetTotal += totalPerProduk;
                            // Increase margin (total)
                            marginTotal += marginPerProduk * parseInt(beli);

                            // Increase omset & margin (obat)
                            if (tipeProduk == "Obat") {
                              omsetObat += totalPerProduk;
                              marginObat += marginPerProduk * parseInt(beli);
                            }

                            // Increase omset & margin (pupuk)
                            if (tipeProduk == "Pupuk") {
                              omsetPupuk += totalPerProduk;
                              marginPupuk += marginPerProduk * parseInt(beli);
                            }

                            return (
                              <span className="product" key={_xPrd}>
                                <span className="name">
                                  {index + 1}. {namaBarang}
                                </span>
                                <span className="qty">
                                  {numberFormat(beli)} {satuan}
                                </span>
                                <span className="price">
                                  Rp {numberFormat(totalPerProduk)}
                                </span>
                              </span>
                            );
                          })}
                        </p>
                      );
                    })
                  : null}
                <p className="transaksi-table-body-total">
                  <span className="transaksi-table-body-total-label">
                    TOTAL
                  </span>
                  <span className="transaksi-table-body-total-body">
                    Rp {numberFormat(omsetTotal)}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="spacer"></div>

          <div className="transaksi-print-body-right">
            <div className="omset-table">
              <div className="omset-table-head">
                <p className="omset-table-head-title">OMSET</p>
              </div>
              <div className="omset-table-body">
                <div className="omset-table-body-obat">
                  <p className="label">Obat</p>
                  <p className="content">Rp {numberFormat(omsetObat)}</p>
                </div>
                <div className="omset-table-body-pupuk">
                  <p className="label">Pupuk</p>
                  <p className="content">Rp {numberFormat(omsetPupuk)}</p>
                </div>
                <div className="omset-table-body-total">
                  <p className="label">Total</p>
                  <p className="content">Rp {numberFormat(omsetTotal)}</p>
                </div>
              </div>
            </div>
            <div className="margin-table">
              <div className="margin-table-head">
                <p className="margin-table-head-title">MARGIN</p>
              </div>
              <div className="margin-table-body">
                <div className="margin-table-body-obat">
                  <p className="label">Obat</p>
                  <p className="content">Rp {numberFormat(marginObat)}</p>
                </div>
                <div className="margin-table-body-pupuk">
                  <p className="label">Pupuk</p>
                  <p className="content">Rp {numberFormat(marginPupuk)}</p>
                </div>
                <div className="margin-table-body-total">
                  <p className="label">Total</p>
                  <p className="content">Rp {numberFormat(marginTotal)}</p>
                </div>
              </div>
            </div>
            <div className="kas-table">
              <div className="kas-table-head">
                <p className="kas-table-head-title">KAS</p>
              </div>
              <div className="kas-table-body">
                <p className="content">Rp {numberFormat(this.state.kas)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
