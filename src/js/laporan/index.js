import { GetLaporan, reformatNumber } from "../api/laporan";
import { numberFormat } from "../api/helper/string";
import { FiCheck, FiX } from "react-icons/fi";
import * as request from "../api/request";
import ReactToPrint from "react-to-print";
import { GetNeraca } from "../api/neraca";
import React, { Component } from "react";
import "../../scss/laporan/index.scss";
import Chart from "./table/cart";
import Data from "./table/data";
import Print from "./print";

export default class Laporan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tanggal: "- - -",

      // Total omset (sampai saat ini)
      totalOmset: 0,

      // Total margin (sampai saat ini)
      totalMargin: 0,

      // Total biaya (sampai saat ini)
      totalBiaya: 0,

      pendapatan: {
        bulanLalu: {
          obatPertanian: 0,
          pupuk: 0,
          pupukSubsidi: 0,
        },
        bulanIni: {
          obatPertanian: 0,
          pupuk: 0,
          pupukSubsidi: 0,
        },
        bulanDepan: {
          obatPertanian: 0,
          pupuk: 0,
          pupukSubsidi: 0,
        },
      },
      biaya: {
        bulanLalu: {
          honor: 0,
          transport: 0,
          lainnya: 0,
        },
        bulanIni: {
          honor: 0,
          transport: 0,
          lainnya: 0,
        },
        bulanDepan: {
          honor: 0,
          transport: 0,
          lainnya: 0,
        },
      },

      total: {
        bulanLalu: 0,
        bulanIni: 0,
        bulanDepan: 0,
      },

      // Data visualisasi
      chart: {
        options: {
          chart: {
            background: "#eee",

            // Download button
            toolbar: {
              show: false,
            },
          },

          // Line direction
          plotOptions: {
            bar: {
              horizontal: false,
            },
          },

          // Judul data visualisasi
          title: {
            text: "Data Visual",
            align: "center",
            margin: 20,
            offsetY: 20,
            style: {
              fontSize: 17,
            },
          },

          // Vertical
          yaxis: [
            {
              labels: {
                formatter: function (value) {
                  return "Rp " + numberFormat(value);
                },
              },
            },
          ],

          // Horizontal
          xaxis: {
            categories: [
              "Januari",
              "Februari",
              "Maret",
              "April",
              "Mei",
              "Juni",
              "Juli",
              "Agustus",
              "September",
              "Oktober",
              "November",
              "Desember",
            ],
          },

          // Line color - Updated 14-6-2026
          colors: [
            "#42daf5", // Omset
            "#34eb5e", // Pendapatan/ Margin
            "#eb3468", // Biaya
          ],

          // Label jumlah pada garis
          dataLabels: {
            enabled: false,
            formatter: (val) => "Rp " + numberFormat(val),
          },
        },

        // Data
        series: [
          {
            name: "Omset",
            hidden: true, // Updated 10-6-2026
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          {
            name: "Margin",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          {
            name: "Biaya",
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
        ],

        // Tipe chart
        type: "bar",

        // Dimension
        width: 520,
      },

      neraca: {
        aktiva: {
          kas: 0,
          persediaan: {
            pupuk: 0,
            pupukSubsidi: 0,
            obatPertanian: 0,
            total: 0,
          },
          inventaris: 0,
          selisih: 0,
          total: 0,
        },
        pasiva: {
          modal: 0,
          rugiLaba: 0,
          total: 0,
        },
      },

      // Print state
      _isPrinting: false,
    };

    // Mounted component
    this.__mounted__ = false;

    this.PageRef = {
      Pdf: React.createRef(),
    };
  }

  async componentDidMount() {
    this.__mounted__ = true;

    // Set worktime (to auto/ now)
    const { tanggal, bulanIni, tahun } = this.props.workTime;
    // Update 10-6-2026 - Line 227, penambahan tanggal (awalnya hanya bulan dan tahun)
    this.__mounted__ &&
      this.setState({ tanggal: `${tanggal} ${bulanIni} ${tahun}` });

    // Get neraca
    const neraca = await GetNeraca(this.props.workTime);
    this.__mounted__ && this.setState({ neraca });

    // Load data
    await this.loadData();
  }

  componentWillUnmount() {
    this.__mounted__ = false;
  }

  loadData = async () => {
    // Data
    const {
      pendapatan,
      biaya,
      total,
      chart,
      totalMargin,
      totalOmset,
      totalBiaya,
    } = await GetLaporan(this.props.workTime);

    this.__mounted__ &&
      this.setState({
        // Omset (sampai saat ini)
        totalOmset,

        // Margin (sampai saat ini)
        totalMargin,

        // Biaya (sampai saat ini)
        totalBiaya,

        // Table
        pendapatan,
        biaya,
        total,

        // Data visual
        chart: {
          ...this.state.chart,
          options: {
            ...this.state.chart.options,

            // Chart title
            title: {
              ...this.state.chart.options.title,
              text: this.props.workTime.tahun,
            },

            // Chart | Bulan
            xaxis: { categories: [...chart.months] },
          },

          // Chart | Data per-bulan dan title
          series: [...chart.series],
        },
      });
  };

  openPrintingPage = () =>
    this.__mounted__ && this.setState({ _isPrinting: true });

  removePrintingPage = () =>
    this.__mounted__ && this.setState({ _isPrinting: false });

  render() {
    const { dataToko } = this.props;
    const { chart } = this.state;

    return (
      <div className="laporan">
        <div className="judul">
          <h1 style={{ color: this.props.theme }}>
            LAPORAN BULANAN DAN VISUALISASI DATA
          </h1>
          <h2 style={{ color: this.props.theme }}>
            {dataToko.nama} {dataToko.alamat}
          </h2>
          <p>Pemantauan data s/d {this.state.tanggal}</p>
        </div>

        <div className="tabel">
          <Data
            pendapatan={this.state.pendapatan}
            biaya={this.state.biaya}
            total={this.state.total}
            chart={this.state.chart}
          />
          <Chart chart={this.state.chart} />
        </div>

        <div
          className={
            this.state._isPrinting
              ? "print-preview print-preview-active"
              : "print-preview"
          }
        >
          <div className="print-preview-box" ref={this.PageRef.Pdf}>
            <Print
              ref={(el) => (this.componentRef = el)}
              pendapatan={this.state.pendapatan}
              chart={this.state.chart}
              biaya={this.state.biaya}
              total={this.state.total}
              neraca={this.state.neraca}
              workTime={this.props.workTime}
              // Update 2025
              dataToko={dataToko}
            />
          </div>
        </div>

        <div className="laporan-bottom">
          <div className="laporan-action">
            <ReactToPrint
              trigger={() => {
                return (
                  <button style={{ backgroundColor: this.props.theme }}>
                    Cetak
                  </button>
                );
              }}
              content={() => this.componentRef}
              onBeforeGetContent={this.openPrintingPage}
              onAfterPrint={this.removePrintingPage}
            />
          </div>

          <div className="total-container">
            {/* Omset */}
            {this.state.totalOmset > 0 && (
              <p
                className="total-form-label"
                title={numberFormat(this.state.totalOmset)}
              >
                <span style={{ backgroundColor: "#34eb5e" }}></span>
                {"Rp " + reformatNumber(this.state.totalOmset)}
              </p>
            )}

            {/* Margin */}
            {this.state.totalMargin > 0 && (
              <p
                className="total-form-label"
                title={numberFormat(this.state.totalMargin)}
              >
                <span style={{ backgroundColor: "#42daf5" }}></span>
                {"Rp " + reformatNumber(this.state.totalMargin)}
              </p>
            )}

            {/* Biaya */}
            {this.state.totalBiaya > 0 && (
              <p
                className="total-form-label"
                title={numberFormat(this.state.totalBiaya)}
              >
                <span style={{ backgroundColor: "#eb3468" }}></span>
                {"Rp " + reformatNumber(this.state.totalBiaya)}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}
