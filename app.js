var kartis = require('./kartis.js');

var http = require('http');
var express = require('express');
var app = express();
var server = http.createServer(app);

var io = require('socket.io').listen(server);
io.set('log level', 0);

server.listen(8080);

app.use('/',express.static(__dirname+'/public'));

var users = {};
var clients = {};
var tables = {};
var game_cards = {};
var player_cards = {};
var galds = {};
var gajiens = {};
var izvele_reizes = {};
var user1 = {};
var user2 = {};
var lielais = {};
var mazie = {};

var izvertet_galdu = function (array) {
console.log(array);
if (array[0][2] == 1) {
	var array_test = array;
		array_test.sort(function(a, b){
    		return b[0] - a[0];
		});
	return array_test[0][1];
	} else {
	var ir_trumpji = false;
	for (var i in array) {
		if (array[i][2] == 1) {
			var trumpji = new Array;
			trumpji.push(array[i]);
			ir_trumpji = true;
		}
	}
		if (ir_trumpji && trumpji.length > 1) {
			trumpji.sort(function(a, b){
    			return b[0] - a[0];
			});
			
			return trumpji[0][1];
		} else if (ir_trumpji && trumpji.length == 1) {
			return trumpji[0][1]
		} else {
			var galds_bez_trumpjiem = [];
			for (var i in array) {
				var max_id = 0;
				if (array[0][2] == array[i][2]) {
					galds_bez_trumpjiem.push(array[i]);
				}
				galds_bez_trumpjiem.sort(function(a, b){
    				return b[0] - a[0];
				});
			}
			return galds_bez_trumpjiem[0][1];
		}
	}
};

var kuram_jaiet = function (game_id, jau_pagaja, stikis) {

			if (jau_pagaja == 'sakums') {
					return tables[game_id][gajiens[game_id]];
			} else if (jau_pagaja == 0) {
				return stikis;
			} else if (stikis == 0 && jau_pagaja != 0) {
				for (var i in tables[game_id]) {
					if (tables[game_id][i] == jau_pagaja) {
						var id = i;
					} else {}
				}
				
				if (id == 3) {
					return tables[game_id][1];
				} else if (id == 2) {
					return tables[game_id][3];
				} else if (id == 1) {
					return tables[game_id][2];
				}
			}
		};
		
		
		
io.sockets.on('connection', function(socket) {
	
		socket.on('adduser', function(username){
			socket.user = username;
			socket.user_in_room = false;
			users[username] = username;
			clients[username] = socket.id;
			
			socket.emit('updateusers', users);
			socket.broadcast.emit('updateusers', users)
			socket.emit('update_rooms', tables);
			socket.broadcast.emit('update_rooms', tables);
		});
		
		socket.on('disconnect', function(){
			delete users[socket.user];
			socket.emit('updateusers', users);
			socket.broadcast.emit('updateusers', users)
		});
		
		socket.on('create_room', function(random_id){
			tables[random_id] = [random_id, socket.user];
			socket.emit('update_rooms', tables);
			socket.broadcast.emit('update_rooms', tables);
			var random_nr = Math.floor((Math.random() * 3) + 1);
			gajiens[random_id] = random_nr;
	
			socket.join(random_id);
			socket.room = random_id;
			socket.user_in_room = true;
		});
		
		socket.on('join_room', function(game_id){
			tables[game_id].push(socket.user);
			socket.emit('update_rooms', tables);
			socket.broadcast.emit('update_rooms', tables);
			
			socket.join(game_id);
			socket.room = game_id;
			socket.user_in_room = true;
			
			if (tables[game_id].length == 4) {

					var sk = kartis.array;
					
						game_cards[game_id] = kartis.sajaukt(sk);
					
						speletaja_kartis_1 = [];
						speletaja_kartis_2 = [];
						speletaja_kartis_3 = [];

						for (i=0; i<=7; i++) {
							speletaja_kartis_1.push(game_cards[game_id][i]);
						}
						
						speletaja_kartis_1.sort(function(a, b){
    						return b[0] - a[0];
    						});
    						
    					player_cards[tables[game_id][1]] = speletaja_kartis_1;
    					
    					    					
    					var galda_kartis = [];
    					for (i=24; i<=25; i++) {
							galda_kartis.push(game_cards[game_id][i]);
						}
    					
    					player_cards[game_id] = galda_kartis;
					 
							var speletaja_kartis_2 = [];
							
						for (i=8; i<=15; i++) {
							speletaja_kartis_2.push(game_cards[game_id][i]);
						}
						
						speletaja_kartis_2.sort(function(a, b){
    						return b[0] - a[0];
    						});
    						
    					player_cards[tables[game_id][2]] = speletaja_kartis_2;
					
							var speletaja_kartis_3 = [];
					
						for (i=16; i<=23; i++) {
							speletaja_kartis_3.push(game_cards[game_id][i]);
						}
						
						speletaja_kartis_3.sort(function(a, b){
    						return b[0] - a[0];
    						});
    						
    					player_cards[tables[game_id][3]] = speletaja_kartis_3;
				
				var speletaja_kartis_array;
				var user_socket = clients[socket.user];
				
					io.sockets.socket(clients[tables[game_id][1]]).emit('pre_start_game', game_id, player_cards[tables[game_id][1]], '0', tables[game_id][2], tables[game_id][3], kuram_jaiet(game_id, 'sakums', 0), 'start');
					
					io.sockets.socket(clients[tables[game_id][2]]).emit('pre_start_game', game_id, player_cards[tables[game_id][2]], '0', tables[game_id][3], tables[game_id][1], kuram_jaiet(game_id, 'sakums', 0), 'start');
					
					io.sockets.socket(clients[tables[game_id][3]]).emit('pre_start_game', game_id, player_cards[tables[game_id][3]], '0', tables[game_id][1], tables[game_id][2], kuram_jaiet(game_id, 'sakums', 0), 'start');			
			
				//io.sockets.in(room_id).emit('spele_sakas', room_id);
			}
		});
		
socket.on('izdarita_izvele', function(my_id, izvele, game_id, norok, norok_id) {
		var norok;
		var norok_id;
		
		var sutit_sakt = function () {
			io.sockets.socket(clients[tables[game_id][1]]).emit('start_game', game_id, player_cards[tables[game_id][1]], kuram_jaiet(game_id, 'sakums', 0), tables[game_id][2], tables[game_id][3], 'start');
			io.sockets.socket(clients[tables[game_id][2]]).emit('start_game', game_id, player_cards[tables[game_id][2]], kuram_jaiet(game_id, 'sakums', 0), tables[game_id][3], tables[game_id][1], 'start');
			io.sockets.socket(clients[tables[game_id][3]]).emit('start_game', game_id, player_cards[tables[game_id][3]], kuram_jaiet(game_id, 'sakums', 0), tables[game_id][1], tables[game_id][2], 'start');
		};
		
		if (typeof izvele_reizes.game_id == 'undefined' && izvele_reizes.game_id == null) {
			izvele_reizes.game_id = 1;
			var reizes = 1;
		} else {
			var reizes = izvele_reizes.game_id;
			reizes = reizes + 1;
			izvele_reizes.game_id = reizes;
		}
		
		var user_socket = clients[my_id];
		
		if (reizes == 3) {
			norok = 'galds';
			lielais[game_id] = 'galds';
		}
		
		if (reizes < 3 || norok != 'galds') {
		console.log(norok + ' = ' + reizes);
			if (izvele == 3) {
				io.sockets.socket(clients[tables[game_id][1]]).emit('pre_start_game', game_id, player_cards[tables[game_id][1]], '0', tables[game_id][2], tables[game_id][3], kuram_jaiet(game_id, my_id, 0), 'start');
				io.sockets.socket(clients[tables[game_id][2]]).emit('pre_start_game', game_id, player_cards[tables[game_id][2]], '0', tables[game_id][3], tables[game_id][1], kuram_jaiet(game_id, my_id, 0), 'start');
				io.sockets.socket(clients[tables[game_id][3]]).emit('pre_start_game', game_id, player_cards[tables[game_id][3]], '0', tables[game_id][1], tables[game_id][2], kuram_jaiet(game_id, my_id, 0), 'start');
			} else if (izvele == 1) {
						lielais[game_id] = [my_id];
						mazie[game_id] = [];
						
						mazie[game_id].push(player_cards[game_id][0]);
						mazie[game_id].push(player_cards[game_id][1]);
			
						sutit_sakt();
			} else if (izvele == 2) {
			
				if (norok == null) {
					player_cards[my_id].push(player_cards[game_id][0]);
					player_cards[my_id].push(player_cards[game_id][1]);
				
					player_cards[my_id].sort(function(a, b){
								return b[0] - a[0];
								});
								
					lielais[game_id] = [my_id];
					
					io.sockets.socket(user_socket).emit('pre_start_game', game_id, player_cards[my_id], my_id, user1[my_id], user2[my_id], my_id, 2);
					
    			} else {
    				var lielais_length = 0;
    				for (var i in lielais[game_id]) {
    					lielais_length++;
    				}
 
    				if (lielais_length < 3) {
    					lielais[game_id].push(norok);
    					console.log(lielais[game_id]);
    					player_cards[my_id].splice(norok_id, 1)
    					izveles_id = 2;
    					
    					io.sockets.socket(user_socket).emit('pre_start_game', game_id, player_cards[my_id], my_id, user1[socket.user], user2[socket.user], my_id, 2);
    				} else {
						sutit_sakt();
    				}
    			}
			} else if (izvele == 4) {
				sutit_sakt();
			}
		} else {
			
			console.log('Kopeejaa pule');
			sutit_sakt();
		}
});
		
socket.on('gajiens_izdarits', function(karts, game_id, my_id, ar_id, masts){
		if (socket.room == game_id) {
			var gajiens;
		
			var atkartojas = false;
			for (var m in galds[game_id]) {
				if (galds[game_id][m][0] == karts) { atkartojas = true; }
			}
			if (galds[game_id] != undefined) {
				if (galds[game_id].length >= 3) {
					delete galds[game_id];
				}
			}
			if (galds[game_id] == undefined) {
					galds[game_id] = [[karts, socket.user, masts]];
			} else {
				if (atkartojas == false) {
					galds[game_id].push([karts, socket.user, masts]);
				}
			}
		player_cards[my_id].splice(ar_id ,1);
							
		//io.sockets.socket(clients[tables[game_id][1]]).emit('kads_pagaja', game_id);
		//io.sockets.socket(clients[tables[game_id][2]]).emit('kads_pagaja', game_id);
		//io.sockets.socket(clients[tables[game_id][3]]).emit('kads_pagaja', game_id);
		
		var pagaja = socket.user;
		var stikis = 0;
		
		if (galds[game_id].length == 3) {
		stikis = izvertet_galdu(galds[game_id]);
		pagaja = 0;
		}
					
		io.sockets.in(socket.room).emit('kads_pagaja', game_id, pagaja, stikis);
		}
});		

socket.on('paradit_info', function(my_id, game_id, pagaja, stikis){
	var id;
	var user1;
	var user2;
	switch(my_id) {
		case tables[game_id][1]:
			speletaja_kartis_array = player_cards[tables[game_id][1]];
			user1 = tables[game_id][2];
			user2 = tables[game_id][3];
		break;
		case tables[game_id][2]:
			speletaja_kartis_array = player_cards[tables[game_id][2]];
			user1 = tables[game_id][3];
			user2 = tables[game_id][1];
		break;
		case tables[game_id][3]:
			speletaja_kartis_array = player_cards[tables[game_id][3]];
			user1 = tables[game_id][1];
			user2 = tables[game_id][2];
		break;
	}
	
	var user_socket = clients[socket.user];
	io.sockets.socket(user_socket).emit('pec_gajiena', game_id, speletaja_kartis_array, galds[game_id], kuram_jaiet(game_id, pagaja, stikis), user1, user2, 'start', stikis);
	
});
		
});
