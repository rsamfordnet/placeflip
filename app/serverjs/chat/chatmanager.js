module.exports = {
    rooms : new Object(), /* Hashtable key:string, value:room */
    
    createRoom : function(firstUser, roomName){
        if (roomName == undefined)
            throw 'roomName is undefined';
        if (firstUser == undefined)
            throw 'firstUser is undefined';
        if (firstUser.name == undefined)
            throw 'firstUser.name is undefined.';
        
        var room = {
            users : new Object(), /* Hashtable key:string, value:user */
            roomName : roomName
        };
        room.users[firstUser.name] = firstUser;
        
        this.rooms[roomName] = room;
        
        return room;
    },
    
    joinOrCreateRoom : function(user, roomName)
    {
        var room = this.rooms[roomName];
        if (room == undefined)
            room = this.createRoom(user, roomName);
        else
            room.users[user.name] = user;
            
        return room;
    },
    
    leaveRoom : function(user, roomName)
    {
        var room = this.rooms[roomName];
        delete room.users[user.name];
    },
    
    getRoom : function(roomName)
    {
        return this.rooms[roomName];
    }
}