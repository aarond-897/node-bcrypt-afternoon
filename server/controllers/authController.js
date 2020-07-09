const bcrypt = require('bcryptjs');

module.exports={
    register:(req,res)=>{
        const {username, password, isAdmin} =req.body;
        const db = req.app.get('db');

        db.get_user(username).then(data=>{
            console.log(data)
            const existingUser=data[0];
            if (existingUser){
                res.status(409).send('Username taken')
            }else{
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password,salt);
                db.register_user(isAdmin, username, hash).then(result=>{
                    const registeredUser=result;
                    const user = registeredUser[0];
                    req.session.user = {isAdmin:user.is_admin, id: user.id, username: user.username };
                    res.status(201).send(req.session.user)
                })
            }
        })
    },
    login:(req,res)=>{
        const {username, password} = req.body;
        const db = req.app.get('db');
        db.get_user(username).then(data=>{
            const user=data[0];
            if(!user){
                res.status(401).send('User not found. Please register as a new user before logging in.')
            }else{
                const isAuthenticated = bcrypt.compareSync(password, user.hash);
                if (!isAuthenticated){
                    res.status(403).send('Incorrect password.')
                }else{
                    req.session.user= {isAdmin:user.is_admin, id: user.id, username: user.username };
                    res.status(200).send(req.session.user);
                }
            }
        })
    },
    logout:(req,res)=>{
        req.session.destroy();
        res.sendStatus(200)
    }
}