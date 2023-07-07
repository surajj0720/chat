const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const registerLoad = async (req, res, next) => {
    try {
        return res.render('register')
    } catch (error) {
        console.log(error.message);
    }
};

const register = async (req, res, next) => {
    try {
        const passwordHash = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            name: req.body.name,
            email: req.body.email,
            image: 'images/' + req.file.filename,
            password: passwordHash

        });

        await user.save();

        return res.render('register', {
            message: 'Registration Successfully'
        })

    } catch (error) {
        console.log(error.message);
    }
};


const loadLogin = async (req, res, next) => {
    try {
        return res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

const login = async (req, res, next) => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({
            email: email
        });

        if (!userData) {
            return res.render('login', {
                message: 'Email and Password is incorrect'
            });
        }

        const passwordMatch = await bcrypt.compare(password, userData.password);

        if (!passwordMatch) {
            return res.render('login', {
                message: 'Email and Password is incorrect'
            });
        }

        req.session.user = userData;
        return res.redirect('/dashboard')

    } catch (error) {
        console.log(error.message);
    }
}

const logout = async (req, res, next) => {
    try {
        req.session.destroy();
        return res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
}

const loadDashboard = async (req, res, next) => {
    try {

        const users = await User.find({
            _id: {
                $nin: [req.session.user._id]
            }
        })

        return res.render('dashboard', {
            user: req.session.user,
            users: users
        })


    } catch (error) {
        console.log(error.message);
    }
}

const notFound = async (req, res, next) => {
    try {
        return res.render('notFound')
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    registerLoad,
    register,
    loadLogin,
    login,
    logout,
    loadDashboard,
    notFound

}