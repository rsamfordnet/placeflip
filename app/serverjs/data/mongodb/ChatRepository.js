/* function */ const callback = require('./Callback.js');

/* class  */ function ChatRepository(mdb)
{
    /* public void */ this.createRoom = function(room, success, error)
    {
        mdb.collection("rooms").insertOne(
            room,
            callback(success, error)
        ); 
    }

    /* public void */ this.getRooms = function(success, error)
    {
        mdb.collection("rooms").find({}).toArray( 
            callback(success, error)
        );
    }
}

// =>
module.exports = ChatRepository;