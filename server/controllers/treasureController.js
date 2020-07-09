module.exports={
    dragonTreasure:(req,res)=>{
        const db = req.app.get('db');

        db.get_dragon_treasure(1)
        .then(response=>{
            res.status(200).send(response)
        })
    },
    getUserTreasure:(req,res)=>{
        const db=req.app.get('db');
        console.log(req.session)
        // console.log(req.session.user)
        // const {id} = req.session.user;
        db.get_user_treasure(req.session.user.id)
        .then(result=>{
            res.status(200).send(result)
        })
    },
    addUserTreasure:(req,res)=>{
        const {treasureURL} = req.body;
        const {id}=req.session.user;
        const db =req.app.get('db');

        db.add_user_treasure(treasureURL,id)
        .then(userTreasure=>{
            res.status(200).send(userTreasure)
        })
    },
    getAllTreasure:(req,res)=>{
        const db = req.app.get('db');
        
        db.get_all_treasure()
        .then(allTreasure=>{
            res.status(200).send(allTreasure)
        })
    }
}