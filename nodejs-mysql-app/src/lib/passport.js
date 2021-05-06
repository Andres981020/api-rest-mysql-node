const pass = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

pass.use('local.login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done)=>{
    console.log(req.body);
    const rows = await pool.query('select * from users where username = ?', [username]);
    if (rows.length > 0){
        const user = rows[0];
        const valid = helpers.matchPassword(password, user.password);
        if(valid){
            done(null, user, req.flash('success','Welcome'+user.username)); 
        } else{
            done(null, false, req.flash('message','Incorrect password'))
        }
    }else{
        return done(null, false, req.flash('message','The username does not exists'));
    }
}));

pass.use('local.signup', new LocalStrategy({
    usernameField:  'username',
    passwordField: 'password',
    passReqToCallback: 'true'
}, async (req, username, password, done)=>{
    console.log(req.body);

    const { fullname } = req.body;
    const newUser = {
        username,
        password,
        fullname
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await pool.query('insert into users set ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
}));

pass.serializeUser((user, done)=>{
    done(null, user.id);
});

pass.deserializeUser(async (id, done)=>{
    const rows = await pool.query('select * from users where id = ?', [id]);
    done(null, rows[0]);
})