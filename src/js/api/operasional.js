import { indexOf } from "./helper/calendar";
import * as request from "./request";

export const GetOperasional = async (workTime) => {
  const _getData = await request.post("/db/get", {
    db: "Operasional",
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
  let response = {
    data: [],
    perolehanBulanIni: 0, // Total bulan ini (worktime)
    perolehan: 0, // Total s/d bulan ini (worktime)
  };

  for (let data of _getData) {
    // Tahun ini
    if (data.timestamp.tahun == workTime.tahun) {
      // Produk lebih baru daripada worktime (beda bulan)
      const step1 = indexOf(data.timestamp.bulan) > indexOf(workTime.bulanIni);
      if (step1) {
        continue;
      } else {
        // Poduk ditambahkan bulan ini
        if (data.timestamp.bulan == workTime.bulanIni) {
          // Tapi tanggal lebih baru dari worktime
          const step2 = data.timestamp.tanggal > workTime.tanggal;
          if (step2) {
            // Maka lewati saja
            continue;
          }
          // Tanggal lebih lama dari workTime, maka ambil data
          response.perolehanBulanIni += parseInt(data.jumlah);
        }
      }
    }

    // Push data
    await response.data.push(data);

    // Increase perolehan
    response.perolehan += parseInt(data.jumlah);
  }

  // Return the response
  return response;
};

export const GetWhereOperasional = async (options) =>
  await request.post("/db/get", { db: "Operasional", options });

// Insert data
export const InsertOperasional = async (data) =>
  await request.post("/db/insert", { db: "Operasional", data });

// Delete data
export const DeleteOperasional = async (data) =>
  await request.post("/db/delete", { db: "Operasional", data });

// Update data
export const UpdateOperasional = async (data) =>
  await request.post("/db/update", { db: "Operasional", data });

// Get one data
export const GetOneOperasional = async (options) =>
  await request.post("/db/getone", { db: "Operasional", options });
