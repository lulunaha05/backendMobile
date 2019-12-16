const Pool = require("pg").Pool;
const pool = new Pool({
  user: "xodcpesnvrotee",
  host: "ec2-174-129-253-113.compute-1.amazonaws.com",
  database: "d86k5scvbco33e",
  password: "a65b2119c250578af373aa13eea77115aadcdb0c095a462b56b781e07dc216ed",
  port: 5432,
  ssl: true
});

const panti = (request, response) => {
  pool.query(
    "SELECT * FROM tbl_panti INNER JOIN tbl_gambar ON tbl_panti.gambar_id= tbl_gambar.gambar_id",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const panti_owner = (request, response) => {
  pool.query(
    "SELECT * FROM tbl_panti INNER JOIN tbl_owner ON tbl_panti.owner_kode  = tbl_owner.owner_kode",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const kategori_panti = (request, response) => {
  const id = request.params.id;
  pool.query(
    "SELECT * FROM tbl_panti WHERE kategori_panti = $1",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const new_user = (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  const first_name = request.body.first_name;
  const last_name = request.body.last_name;

  pool.query(
    "INSERT INTO tbl_user (user_first_name, user_last_name, user_email,user_password) VALUES ($1,$2,$3,$4)",
    [first_name, last_name, email, password],
    (error, results) => {
      console.log(results.rows);
      if (error) {
        throw error;
      } else {
        return response.status(200).send({
          success: true,
          signup: true
        });
      }
    }
  );
};

const new_owner = (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  const first_name = request.body.first_name;
  const last_name = request.body.last_name;
  const alamat = request.body.alamat;
  const telepon = request.body.telepon;

  pool.query(
    "INSERT INTO tbl_owner (owner_alamat, owner_telepon, owner_firstname, owner_lastname, owner_email, owner_password) VALUES ($1,$2,$3,$4,$5,$6)",
    [alamat, telepon, first_name, last_name, email, password],
    (error, results) => {
      console.log(results.rows);
      if (error) {
        throw error;
      } else {
        return response.status(200).send({
          success: true,
          signup: true
        });
      }
    }
  );
};

const login_user = (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  console.log("ini email", request.body.email);

  if (!email || !password) {
    return response.status(200).json({
      success: false,
      login: false,
      massage: "Please fill all required fields!"
    });
  } else if (email.length > 0 && password.length > 0) {
    pool.query(
      "SELECT * FROM tbl_user WHERE user_email = $1",
      [email],
      (error, results) => {
        console.log(results.rows);
        if (error) {
          throw error;
        }
        return response.status(200).json({
          success: true,
          login: true,
          data: results.rows
        });
      }
    );
  }
};

const login_owner = (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  console.log("ini email", request.body.email);

  if (!email || !password) {
    return response.status(200).json({
      success: false,
      auth: false,
      massage: "Please fill all required fields!"
    });
  } else if (email.length > 0 && password.length > 0) {
    pool.query(
      "SELECT * FROM tbl_owner WHERE owner_email = $1",
      [email],
      (error, results) => {
        console.log(results.rows);
        if (error) {
          throw error;
        }
        return response.status(200).json({
          success: true,
          login: true,
          data: results.rows
        });
      }
    );
  }
};

const detail_panti = (request, response) => {
  const id = request.params.id;
  pool.query(
    " SELECT * FROM tbl_panti AS panti INNER JOIN tbl_gambar AS gambar ON gambar.gambar_id = panti.gambar_id INNER JOIN tbl_location AS loc ON loc.id_location = panti.id_location WHERE panti_id = $1;",
    [id],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const bookmarked_panti = (request, response) => {
  // const id = request.params.id;
  pool.query(
    "select panti_id, panti_nama, kontak_panti from tbl_panti where isbookmarked=true",
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

const update_bookmarked = (request, response) => {
  const id = request.body.id;
  pool.query(
    "update tbl_panti set isbookmarked = true where panti_id=$1",
    [id],
    (error, results) => {
      console.log(results.rows);
      if (error) {
        throw error;
      }
      response.status(200).json({
        success: true
      });
    }
  );
};

module.exports = {
  panti,
  panti_owner,
  kategori_panti,
  login_user,
  new_user,
  new_owner,
  login_owner,
  detail_panti,
  bookmarked_panti,
  update_bookmarked
};

//post tapi bodynya banyak
// var {param1, param2} = request.body
//get
//const _param = request.params.id

// pool.query(
//   "SELECT * FROM tbl_panti WHERE id_panti = $1",
//   [id],
//   [nama],
//   (error, results) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).json(results.rows);
//   }
// );
