import { indexOf } from "./helper/calendar";
import * as request from "./request";

export const GetInvestasi = async (workTime) => {
  const _getData = await request.post("/db/get", {
    db: "Investasi",
    options: {
      filter: {
        timestamp: {
          // Ambil data dari tahun ini (workTime) kebawah
          tahun: {
            $lte: workTime.tahun,
          },
        },
      },
      // order: "DESC",
    },
  });

  // Prepare default response data
  let response = { data: [], perolehan: 0 };

  for (let data of _getData) {
    // Tahun ini
    if (data.timestamp.tahun == workTime.tahun) {
      // Produk lebih baru daripada worktime (beda bulan)
      const step1 = indexOf(data.timestamp.bulan) > indexOf(workTime.bulanIni);
      if (step1) {
        continue;
      } else {
        // Poduk ditambahkan bulan ini, tapi tanggal lebih baru dari worktime
        if (data.timestamp.bulan == workTime.bulanIni) {
          const step2 = data.timestamp.tanggal > workTime.tanggal;
          if (step2) {
            continue;
          }
        }
      }
    }

    // Push data
    await response.data.push(data);

    // Icrease perolehan
    response.perolehan += parseInt(data.nominal);
  }

  // Return the response
  return response;
};

// Insert
export const InsertInvestasi = async (data) =>
  await request.post("/db/insert", { db: "Investasi", data });

// Update
export const UpdateInvestasi = async (data) =>
  await request.post("/db/update", { db: "Investasi", data });

// Get one
export const GetOneInvestasi = async (options) =>
  await request.post("/db/getone", {
    db: "Investasi",
    options,
  });

// Delete data
export const DeleteInvestasi = async (data) =>
  await request.post("/db/delete", { db: "Investasi", data });
