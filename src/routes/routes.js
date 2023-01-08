const UserController = require('../controllers/home.controller')
const loginController = require('../controllers/login.controller')
const routes = (app) => {

        app.get('/',  UserController);
        app.post('/sigIn', loginController);
    // app.get('/', )
    // app.post('', UserController);
}


module.exports = routes;