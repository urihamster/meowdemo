var connected=0;

var cat = 1;

var constants = {max_love:100, max_food:100, hunger:3};

var state = {love:0, food:0, score:0, level:1};
  
var socket;

var human_stickers = {
    food:[
        {src:'images/stickers-human/pizza.jpg', love:4, food:1, score:0, id:'pizza' },
        {src:'images/stickers-human/fish.jpg', love:2, food:1, score:2, id:'fish' },
        {src:'images/stickers-human/lasagna.jpg', love:3, food:1, score:1, id:'lasagna' },
        {src:'images/stickers-human/friskies.jpg', love:1, food:1, score:3, id:'friskies' },
    ],
    love:[
        {src:'images/stickers-human/cat-hug1.jpg', love:3, food:0, score:1, id:'cat-hug1' },
        {src:'images/stickers-human/cat-hug2.jpg', love:2, food:0, score:2, id:'cat-hug2' },
        {src:'images/stickers-human/cat-kiss1.jpg', love:2, food:0, score:4, id:'cat-kiss1' },
        {src:'images/stickers-human/cat-scratch.jpg', love:3, food:0, score:2, id:'cat-sctatch' },
        
    ],
    actions:[
        {src:'images/stickers-human/cat-cuddle.jpg', love:3, food:0, score:5, id:'cat-cuddle' },
    ]
};

var cat_stickers = {
    food:[],
    love:[
            {src:'images/stickers-cat/cat-black1.jpg', love:0, food:0, score:4, id:'cat-black1' },
            {src:'images/stickers-cat/cat-black2.jpg', love:1, food:0, score:1, id:'cat-black2' },
            {src:'images/stickers-cat/cat-black3.jpg', love:2, food:0, score:1, id:'cat-black3' },
            {src:'images/stickers-cat/cat-black4.jpg', love:3, food:0, score:1, id:'cat-black4' },
            {src:'images/stickers-cat/cat-orange1.jpg', love:4, food:0, score:1, id:'cat-orange1' },
            {src:'images/stickers-cat/cat-orange2.jpg', love:3, food:0, score:2, id:'cat-orange2' },
            {src:'images/stickers-cat/cat-orange3.jpg', love:2, food:0, score:1, id:'cat-orange3' },
            {src:'images/stickers-cat/cat-orange4.jpg', love:2, food:0, score:3, id:'cat-orange4' },
    ],
    actions:[
            {src:'images/stickers-cat/cat1.jpg', love:1, food:0, score:1, id:'cat1' },
            {src:'images/stickers-cat/cat2.jpg', love:1, food:0, score:1, id:'cat2' },
            {src:'images/stickers-cat/cat3.jpg', love:1, food:0, score:1, id:'cat3' },
            {src:'images/stickers-cat/cat4.jpg', love:1, food:0, score:1, id:'cat4' },
            {src:'images/stickers-cat/cat5.jpg', love:1, food:0, score:1, id:'cat5' },
            {src:'images/stickers-cat/cat6.jpg', love:1, food:0, score:1, id:'cat6' },
            {src:'images/stickers-cat/cat7.jpg', love:1, food:0, score:1, id:'cat7' },
            {src:'images/stickers-cat/cat8.jpg', love:1, food:0, score:1, id:'cat8' },
            {src:'images/stickers-cat/cat9.jpg', love:1, food:0, score:1, id:'cat9' },
    ]
};




function send_message(message){
    socket.emit('chat_message',message);
};

function get_message(message){

    change_state(message);
    update_state();

    var classy = (message.sender==cat ? 'chat-me' : 'chat-other');

    if (message.type=='text'){    
        var the_element = '<div class="chat-message chat-text '+classy+'">'+message.value+'</div>';
    }
    else if (message.type=='sticker'){
        console.log(message);
        var the_element='<div class="chat-message chat-sticker '+classy+'">'+'<img class="sticker-in-chat" src='+
        message.value+'></img>'+'</div>';
    }
    $('#chat-area').append(the_element);

};

function change_state(message){
state.score+=message.score;
state.love+=message.love;
if (state.love>constants.max_love) state=constants.max_love;
if (message.food>0) state.food=constants.max_food; 
if (message.food<0) state.food-=message.food;
if (state.food<0) state.food = 0; 
};

function update_state(){
    $('#score-number').html(state.score);
    var bar_info = level_data(state.score);
    console.log(state);
    console.log('this is the staae')
    state.level = bar_info.level;
    $('#score-bar').css('width',bar_info.bar_progress+'%');

    $('#love-bar').css('width', 100*(state.love/constants.max_love)+'%');
    $('#food-bar').css('width', 100*(state.food/constants.max_food)+'%');

};

function level_data(the_score){

    var level_ar = [0,10,20,40,60];
    var lev = 1;
    for (var i=0 ; i<level_ar.length ; i++){
        if (the_score>=level_ar[i]) lev = i;
    }
    if (lev>=level_ar.length) var prog = 100;
    else var prog = 100*(the_score-level_ar[lev])/(level_ar[lev+1]-level_ar[lev]);
    return ({level:lev+1, bar_progress:prog});

};





function add_sticker(container,the_sticker){

  var to_add = '<a id="'+the_sticker.id+'-sticker" data-id="pet" href="#" data-effect="{love:'+
  the_sticker.love+',food:'+the_sticker.food+',score:'+the_sticker.score+
  ', value:"'+the_sticker.src+'"}"class="emoticon"><img class="sticker-image"'+
  'src="'+the_sticker.src+'"></a>';  

  $('#'+container).append(to_add);

  console.log(the_sticker.src)

  $('#'+the_sticker.id+'-sticker').click(function(){
        send_message({sender:cat,
            type:'sticker',
            value:the_sticker.src,
            love:the_sticker.love,
            food:the_sticker.food,
            score:the_sticker.score
        });
  });
};

function add_stickers_to_container(container, sticker_ar){

    for (var i=0 ; i<sticker_ar.length ; i++){
        add_sticker(container, sticker_ar[i]);
    }
};

function set_character_stickers(char_sticker_set){
    add_stickers_to_container('actions-area',char_sticker_set.actions);
    add_stickers_to_container('food-area',char_sticker_set.food);
    add_stickers_to_container('love-area',char_sticker_set.love);
};


function open_emoticon_menu(that){

    var the_type = $(that).attr('data-id');

    
    $('.emoticon-area').css('display','none');
    $('#the-text-area').css('display','none');

    switch (the_type){
        case 'text':
            //$('#footer').css('margin-top', '-125px');
            $('#chat-area').css('height', '225px');
            $('#the-text-area').css('display','block');
            $('#keyboard-area').css('display','block');
            break;

        case 'love':
           // $('#footer').css('margin-top', '-99px');
            $('#chat-area').css('height', '251px');
            $('#love-area').css('display','block');
            break;

        case 'food':
           // $('#footer').css('margin-top', '-99px');
            $('#chat-area').css('height', '251px');
            $('#food-area').css('display','block');
            break;

        case 'actions':
            //$('#footer').css('margin-top', '-99px');
            $('#chat-area').css('height', '251px');
            $('#actions-area').css('display','block');
            break;
    }
};

function close_emoticon_menu(){

}; 

function add_message_to_chat(message){

};

function set_character(){

    if (cat>0){ 
        set_character_stickers(cat_stickers);
        setInterval(tick(),5000);
    }
    else{ 
        set_character_stickers(human_stickers);
    }
};


function tick(){
    send_message({
        type:'tick',
        score:0,
        love:-3,
        food:-2
    });
};


function set_chat(){
    socket = io.connect("http://localhost:1337/");

    socket.on('connect', function () {
              
        socket.on('chat_message',function(message){
            console.log(message);
            get_message(message); 
        });
            
    });

    cat = localStorage.cat;

    set_character();

    $('.emoticon').click(function(){
        var the_message = JSON.parse($(this).attr('data-effect'));
        the_message.sender = cat;
        the_message.type = 'sticker';
        send_message(the_message);
    });

    $('.emoticon-button').click(function(){
        open_emoticon_menu(this);
    });

    $('#text-messanger').submit(function(e){
        e.preventDefault();
        send_message({type:'text', 
            value:$('#the-text-area').val(), 
            score:2, 
            love:0, 
            food:0,
            sender:cat});
        $('#the-text-area').val('');
    }); 

    update_state();
};

function set_choice(){
    $('#choosing-cat').click(function(){
        localStorage.cat=1;
    });

    $('#choosing-human').click(function(){
        localStorage.cat=0;
    });
};


$(document).ready(function(){

switch($('#the-screen').attr('data-page')){

    case 'chat':
        set_chat();
        break;
    case 'choice':
        set_choice();
        break;
    case 'entrance':
        break;

}


    $('#actions-button').click(function(){

    });

    $('#food-button').click(function(){

    });

    $('#love-button').click(function(){

    });

});


