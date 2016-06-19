/**
 * Socket Service
 *
 * @description :: Server-side logic for managing sockets and their connections
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {
	

   start_sockets: function(){
  
    var io = sails.io;


    io.sockets.on('connection', function (socket) {

        console.log('New connection ');

        socket.emit('sys_message',{message:'HERE YOU GO'});

        socket.on('chat_message', function(message){
          io.emit('chat_message',message);
        });
     });

   },


   user_connection: function(socket, message){
    socket_storage[message.id_sent] = socket;
    var cb=function(err,user){

      user.game_users = [];
      for (var i = 0 ; i<user.games.length ; i++)
      {
        user.games[i].game_users = user.games[i].users;
        user.games[i].game_stickers = user.games[i].stickers;
      }

      socket_service.send_user(user,socket);
    }; 

    socket.on('game_message',function(message){

    });

    socket.on('system_message',function(message){
      
    });

    sails.controllers.user.get_full_user(message.id_sent, cb);

   },



   send_user: function(fullUser,socket){
    if (!fullUser)
    {
      console.log('no such user');
      return;
    }
    socket_storage[fullUser.user_id].emit('sys_message',{type:'user_details', user:fullUser});
   },


 ////---------------------------------------------------------
  ////---------------------------------------------------------
   ////---------------------------------------------------------
    ////---------------------------------------------------------
     ////---------------------------------------------------------
      ////---------------------------------------------------------
       ////---------------------------------------------------------
        ////---------------------------------------------------------
         ////---------------------------------------------------------
          ////---------------------------------------------------------


   start_connection_OLD: function () {

    console.log("bingo bango. Starting Listening to connection");

    var io = sails.io;

    io.sockets.on('connection', function (socket) {
        console.log('emit...');
        
        socket.emit('ping', { message: 'Hello from server ' + Date.now() });
        
        socket.on('pong', function (data) {
            console.log(data.message);
          });

        socket_service.set_user_room();
   });


    console.log("now listening on pong");

    return ;
  /*
    res.json({
      todo: 'start_connection() is not implemented yet!'
    });
    */
  },


  /**
   * `Socket_managerController.set_user_room()`
   */
  set_user_room: function (req, res) {
    
    console.log("setting room is on");
    /*
    return res.json({
      todo: 'set_user_room() is not implemented yet!'
    });
*/
  },


  /**
   * `Socket_managerController.set_game_room()`
   */
  set_game_room: function (req, res) {
    return res.json({
      todo: 'set_game_room() is not implemented yet!'
    });
  },


  /**
   * `Socket_managerController.on_user_message()`
   */
  on_user_message: function (req, res) {
    return res.json({
      todo: 'on_user_message() is not implemented yet!'
    });
  },


  /**
   * `Socket_managerController.on_game_state_recieved()`
   */
  on_game_state_recieved: function (req, res) {
    return res.json({
      todo: 'on_game_state_recieved() is not implemented yet!'
    });
  },


  /**
   * `Socket_managerController.send_message_to_user()`
   */
  send_message_to_user: function (req, res) {
    return res.json({
      todo: 'send_message_to_user() is not implemented yet!'
    });
  },


  /**
   * `Socket_managerController.send_game_state()`
   */
  send_game_state: function (req, res) {
    return res.json({
      todo: 'send_game_state() is not implemented yet!'
    });
  }
};

