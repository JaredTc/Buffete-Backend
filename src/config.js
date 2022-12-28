 const PORT = process.env.PORT || 9090
 const DB_HOST = process.env.DB_HOST || 'localhost'
 const DB_USER = process.env.DB_USER || 'root'
 const DB_PASSWORD = process.env.DB_PASSWORD || ""
 const DB_NAME = process.env.DB_NAME || 'buffette'

//  module.exports = PORT;
 module.exports = {
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
    PORT
 }
//  module.exportsHost = DB_HOST;
//  module.exportsUsr = DB_USER;
//  module.exportsPass = DB_PASSWORD;
//  module.exportsNam = DB_NAME;