module.exports = function(io) {
    //use on method to listen to different events
    //listening to connection event
    io.on('connection', (socket) => {
        socket.on('join chat', params => {
            //console.log(params);
            //join the particular room
            socket.join(params.room1);
            socket.join(params.room2);
        });

        socket.on('start_typing', data => {
            //send this event just to the receiver user, not to all users
            //that are connected
            io.to(data.receiver).emit('is_typing', data);
        });
      
          socket.on('stop_typing', data => {
            //send this event just to the receiver user, not to all users
            //that are connected
            io.to(data.receiver).emit('has_stopped_typing', data);
        });
    });
}