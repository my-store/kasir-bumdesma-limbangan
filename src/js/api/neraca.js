import { GetPersediaan } from "./persediaan";
import { GetInventaris } from "./inventaris";
import { GetAsetTetap } from "./aset-tetap";
import { GetInvestasi } from "./investasi";
import { GetLaporan } from "./laporan";
import { GetHutang } from "./hutang";
import { GetBank } from "./bank";
import { numberFormat } from "./helper/string";

async function Main(workTime) {
  let aktiva = {
    kas: 0,
    bank: 0,
    persediaan: {
      obatPertanian: 0,
      pupukSubsidi: 0,
      pupuk: 0,
      // Added 11-6-2026
      total: 0,
    },
    inventaris: 0,
    asetTetap: 0,
    hutang: 0,
    selisih: 0,
    total: 0,
  };

  let pasiva = { modal: 0, rugiLaba: 0, total: 0 };

  const getBank = await GetBank(workTime);
  aktiva.bank += getBank.perolehan;

  const getAsetTetap = await GetAsetTetap(workTime);
  aktiva.asetTetap += getAsetTetap.perolehan;

  // Semua data pada database persediaan
  const getPersediaan = await GetPersediaan(workTime);

  // Total Obat Pertanian
  const total_persediaan_obat = getPersediaan.perolehan.obatPertanian;

  // Total Pupuk non-subsidi
  const total_persediaan_pupuk = getPersediaan.perolehan.pupuk;

  // Total Pupuk subsidi
  const total_persediaan_pupuk_subsidi = getPersediaan.perolehan.pupukSubsidi;

  // Total persediaan = Total obat + Total pupuk
  const total_persediaan = getPersediaan.perolehan.semua;

  // Total Inventaris
  const getInventaris = await GetInventaris(workTime); // Ambil data Inventaris dari database
  const total_inventaris = getInventaris.perolehan;

  // Total Investasi/ Modal
  const getInvestasi = await GetInvestasi(workTime); // Ambil data Investasi dari database
  const modal = getInvestasi.perolehan;

  // Hutang (Jika ada)
  let getHutang = await GetHutang(workTime);
  const hutang = getHutang.perolehan;

  // Rugi Laba | Ambil data dari laporan bulanan
  let rugiLaba = await GetLaporan(workTime);
  rugiLaba = rugiLaba.total.bulanDepan; // s/d Bulan ini

  // SET Aktiva / Persediaan / Obat Pertanian
  aktiva.persediaan.obatPertanian = total_persediaan_obat;

  // SET Aktiva / Persediaan / Pupuk
  aktiva.persediaan.pupuk = total_persediaan_pupuk;

  // SET Aktiva / Persediaan / Pupuk subsidi
  aktiva.persediaan.pupukSubsidi = total_persediaan_pupuk_subsidi;

  // SET Aktiva / Persediaan / Total (Obat + Pupuk)
  aktiva.persediaan.total = total_persediaan;

  // SET Aktiva / Inventaris
  aktiva.inventaris = total_inventaris;

  // SET Aktiva / Hutang (Ini juga akan mengurangi jumlah Kas)
  aktiva.hutang = hutang;

  /*
  -------------------------------------------------------------------------------------
  SET Aktiva / Kas
  -------------------------------------------------------------------------------------
  Penghitungan:
    Modal + Rugi Laba
    - Total Persediaan
    - Total Inventaris
    - Total Hutang (Jika ada)
    Jika nilai hutang adalah 0, maka tidak akan mengurangi jumlah kas.
  */
  aktiva.kas += modal; // Naikkan nilai Kas = Modal
  aktiva.kas += rugiLaba; // Kas + Rugi Laba
  aktiva.kas -= total_persediaan; // Kas - Persediaan
  aktiva.kas -= total_inventaris; // Kas - Inventaris
  aktiva.kas -= hutang; // Kas - Hutang (Jika ada)

  /*
  -------------------------------------------------------------------------------------
  SET Aktiva / Total
  -------------------------------------------------------------------------------------
  Penghitungan:
    Kas
    + Total Persediaan
    + Total Inventaris
    + Total Hutang (Jika ada)
  */
  aktiva.total = total_persediaan + total_inventaris + aktiva.kas + hutang;

  /*
  -------------------------------------------------------------------------------------
  SET Pasiva
  -------------------------------------------------------------------------------------
  Penghitungan:
    Modal + Rugi Laba
  */
  pasiva.modal = modal;
  pasiva.rugiLaba = rugiLaba;
  pasiva.total = modal + rugiLaba; // Naikkan nilai pasiva = Modal + Rugi Laba
  /*
  -------------------------------------------------------------------------------------
  SET Aktiva / Selisih (Balencing)
  -------------------------------------------------------------------------------------
  Nilainya adalah 0, namun akan bertambah jika nilai aktiva dan pasiva berbeda
  atau tidak balance.
  */
  if (pasiva.total > aktiva.total) {
    aktiva.selisih = pasiva.total - aktiva.total;
  } else {
    aktiva.selisih = aktiva.total - pasiva.total;
  }

  // Biarkan disini, jangan diubah !!! - Updated at 11-6-2026
  // Pengurangan jumlah kas = kas -= bank
  aktiva.kas -= aktiva.bank;
  // Peungurangan jumlah kas = kas -= asetTetap
  aktiva.kas -= aktiva.asetTetap;

  // Response
  return { aktiva, pasiva };
}

export const GetNeraca = async (workTime) => await Main(workTime);

// Dipanggil setiap kali ada barang masuk (persediaan/insert)
export const CekModal = async (workTime, data) => {
  // Uang kas
  const {
    aktiva: { kas },
  } = await Main(workTime);

  // Data = kurangan, status = true | false
  const a = parseInt(data.a); // Harga pembelian
  const b = parseInt(data.b); // Jumlah pembelian
  const result = parseInt(kas) - a * b;

  // Response
  return {
    status: result > 0,
    kurangan: result, // Hapus minus (-)
  };
};
