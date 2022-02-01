class User {
    constructor() {
        //when user is connected(online) we will push the user 
        //to the array globalArray
        this.globalArray = [];
    }

    //first constructor method with 3 parameters
    EnterRoom(id, name, room) {
        //add user as an object
        //we could write { id: id, name: name, room: room }
        const user = { id, name, room };
        //push the objects to the array
        this.globalArray.push(user);
        return user;
    }

    GetUserId(id) {
        //get the socket id from the array
        //use filter method to filter an array -> it will return another array
        const socketId = this.globalArray.filter(
            //our parameter is: userId
            //we want to get from parameter the object
            //the id inside the array is equal to the id passed as parameter to the GetUserId method
            userId => userId.id === id
            //as it will return an array we want to get the first elem
        )[0];
        return socketId;
    }

    //when a user disconnects to remove the user from the array
    RemoveUser(id) {
        //get the object of the user from the globalArray
        //using the above method
        const user = this.GetUserId(id);
        //if the user exists in the array
        if (user) {
            //update the array by filtering the array
            this.globalArray = this.globalArray.filter(
                //return all objects where the id inside the array userId
                //is different from the id from the method
                userId => userId.id !== id
            );
        }
        return user;
    }

    //return all names that are active
    GetList(room) {
        const roomName = this.globalArray.filter(
            //if the room inside the user array is same as
            //the one that is taken as parameter in GetList methd
            user => user.room === room
        );
        //we do not want the full object of the user
        //we just want their names
        const names = roomName.map(user => user.name);
        return names;
    }
}

module.exports = { User };