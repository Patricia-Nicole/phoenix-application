module.exports = function(io, User, _) {

    //create an instance of the class
    const userData = new User();

    //use on method to listen to different events
    //listening to connection event
    io.on('connection', (socket) => {
        console.log('User connected');
        socket.on('refresh', data => {
            //console.log(data);
            //listen to refresh event
            //and through io emit a new event
            //this even will be received by all clients
            io.emit('refreshPage', {});
        });

        //if the user is online emit this event
        //this event is also found in toolbar.components.ts
        //listen to online event
        socket.on('online', data => {
            //console.log(data); -> { room: 'global', user: 'Patri' }
            //call the socket join method to join the room
            socket.join(data.room);
            //call the method EnterRoom from helpers/UserClass.js
            //and we pass the 3 parameters
            userData.EnterRoom(socket.id, data.user, data.room);
            //call the method GetList from helpers/UserClass.js
            const list = userData.GetList(data.room);
            //emit this event - online to all the other users
            //we do not want to emit just the list, but a unique list
            //lodash(_) we added in order to remove duplicates from the array
            //as the method GetList returns an array with the names, 
            //we want to exclude the duplicate names from the array
            io.emit('usersOnline', _.uniq(list));
        });

        socket.on('disconnect', () => {
            //call the method RemoveUser from helpers/UserClass.js
            //and get the id of the connected user
            const user = userData.RemoveUser(socket.id);
            //console.log(user); -> { id: 'zNgRbNj3IaTViEx3AAAG', name: 'Patri', room: 'global' }
            //if user available
            if (user) {
                //get the list of active users and get the room name
                const userArray = userData.GetList(user.room);
                //create a unique array using lodash to not repeat names
                const arr = _.uniq(userArray);
                //call the remove method, pass the array
                //and check if user.name is not equal to any name(n)
                //that we find in the array
                _.remove(arr, n => n === user.name);
                //emit the new array
                io.emit('usersOnline', arr);
            }
        });
    });
}