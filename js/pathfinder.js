const x = 30;
const y = 50;
// S = start
// E = empty
// G = goal
// X = wall

var board = [];
var start_i = 14;
var start_j = 5;
var end_i = 14;
var end_j = 44;

board = (new Array(x)).fill().map(function(){ return new Array(y).fill('E');});
board[start_i][start_j] = 'S';
board[end_i][end_j] = 'G';

let table = '';
// Outer loop to create parent
for (let i = 0; i < x; i++) {
    let children = ''
    //Inner loop to create children
    for (let j = 0; j < y; j++) {
        children += '<td i="'+i+'" j="'+j+'" class="cell" onClick=clickCell(this)></td>';
    }
    //Create the parent and add the children
    table += '<tr>'+children+'</tr>';
}
$('tbody').html(table);
$('td[i='+start_i+'][j='+start_j+']').html($('#start'));
$('td[i='+end_i+'][j='+end_j+']').html($('#end'));
// $('td[i='+start_i+'][j='+start_j+']').css('background-color', '#004ccf');
// $('td[i='+start_i+'][j='+start_j+']').attr('id', 'draggable');
// $('td[i='+end_i+'][j='+end_j+']').css('background-color', '#00b527');

isClickStart = false;

$( "#start" ).draggable({
    containment: 'table',
    // snap: 'td',
    // start: function() {
    //   isClickStart = true;
    // },
    // drag: function() {
    //   counts[ 1 ]++;
    //   updateCounterStatus( $drag_counter, counts[ 1 ] );
    // },
    stop: function() {
        isClickStart = true;
    }
});

isClickEnd = false;

$( "#end" ).draggable({
    containment: 'table',
    stop: function() {
        isClickEnd = true;
    }
});

isMouseDown = false
$('td').mousedown(function() {
    isMouseDown = true;
})
.mouseup(function() {
    isMouseDown = false;
});

$('td').mouseenter(function() {
    if(isMouseDown){
        clickCell(this);
    }
    else if(isClickStart){
        $(this).html($('#start'));
        $('#start').css('left', '0px');
        $('#start').css('top', '0px');
        isClickStart = false;
        board[start_i][start_j] = 'E';
        start_i = parseInt($(this).attr('i'));
        start_j = parseInt($(this).attr('j'));
        board[start_i][start_j] = 'S';
        console.log(board, start_i, start_j);
    }
    else if(isClickEnd){
        $(this).html($('#end'));
        $('#end').css('left', '0px');
        $('#end').css('top', '0px');
        isClickEnd = false;
        board[end_i][end_j] = 'E';
        end_i = parseInt($(this).attr('i'));
        end_j = parseInt($(this).attr('j'));
        board[end_i][end_j] = 'G';
        console.log(board, end_i, end_j);
    }
});

$( document ).ready(function() {
    $('#main').css('display', 'block');
    $('#loading').css('display', 'none');
});

function clickCell(cell){
    if(board[$(cell).attr('i')][$(cell).attr('j')] == 'E'){
        board[$(cell).attr('i')][$(cell).attr('j')] = 'X';
        $(cell).css('background-color', '#5c5c5c');
        $(cell).attr('state', 'wall');
    }
}

function backtrack(cell){
    var curr = $(cell);
    var i = $(curr).attr('parent-i');
    var j = $(curr).attr('parent-j');
    while(parseInt(i) !== start_i || parseInt(j) !== start_j){
        if(i == undefined || j == undefined){
            return;
        }
        curr = $('td[i='+i+'][j='+j+']');
        i = $(curr).attr('parent-i');
        j = $(curr).attr('parent-j');
        $(curr).attr('state', 'way');
        $(curr).css('background-color', '#91ff87');
    }
}

function clearBoard(){
    board = (new Array(x)).fill().map(function(){ return new Array(y).fill('E');});
    board[start_i][start_j] = 'S';
    board[end_i][end_j] = 'G';
    $('td').toArray().forEach(e => {
        $(e).css('background-color', 'white');
        $(e).attr('state', '');
    });
    // $('td[i='+start_i+'][j='+start_j+']').css('background-color', '#004ccf');
    // $('td[i='+end_i+'][j='+end_j+']').css('background-color', '#00b527');
}

function clearWay(){
    $('td[state=way]').toArray().forEach(e => {
        $(e).css('background-color', 'white');
        $(e).attr('state', '');
    });
    $('td[state=checked]').toArray().forEach(e => {
        $(e).css('background-color', 'white');
        $(e).attr('state', '');
    });
    $('td[state=visited]').toArray().forEach(e => {
        $(e).css('background-color', 'white');
        $(e).attr('state', '');
    });
}

function bfs(){
    clearWay();
    var new_board = JSON.parse(JSON.stringify(board));
    var q = [[start_i, start_j]];
    var neighbours = [[-1,0], [0,1], [1,0], [0,-1]];
    var found = false;
    while(q.length > 0 && !found){
        var curr = q.shift()
        for (neighbour of neighbours) {
            console.log('jalan');
            var i = curr[0]+neighbour[0];
            var j = curr[1]+neighbour[1];
            if(i>=0 && i<new_board.length && j>=0 && j<new_board[0].length){
                if(new_board[i][j] === 'G'){
                    var cell = $('td[i='+i+'][j='+j+']');
                    $(cell).attr('parent-i', curr[0]);
                    $(cell).attr('parent-j', curr[1]);
                    backtrack(cell);
                    found = true;
                    console.log(board);
                    return;
                }
                else if(new_board[i][j] === 'E'){
                    var cell = $('td[i='+i+'][j='+j+']');
                    // $(cell).animate({'backgroundColor': '#4fe5ff'}, function(){
                    //     console.log('ddd');
                    // });
                    $(cell).css('background-color', '#4fe5ff');
                    $(cell).attr('parent-i', curr[0]);
                    $(cell).attr('parent-j', curr[1]);
                    $(cell).attr('state', 'visited');
                    new_board[i][j] = 'V';
                    q.push([i,j]);
                }
            }
        }
    }
}

function astar(){
    clearWay();
    var new_board = JSON.parse(JSON.stringify(board));
    // urutan = i, j, f_cost, g_cost
    var open = [[start_i, start_j, 0, 0]];
    var closed = [];
    var neighbours = [[-1,0], [0,1], [1,0], [0,-1]];
    var found = false;
    while(open.length > 0 && !found){
        var curr = open.pop()
        // console.log(curr);
        if(curr[0] !== start_i || curr[1] !== start_j){
            new_board[curr[0]][curr[1]] = 'V';
            $('td[i='+curr[0]+'][j='+curr[1]+']').css('background-color', '#4fe5ff');
            $('td[i='+curr[0]+'][j='+curr[1]+']').attr('state', 'visited');
        }
        
        for (neighbour of neighbours) {
            console.log('jalan');
            var i = curr[0]+neighbour[0];
            var j = curr[1]+neighbour[1];
            if(i>=0 && i<new_board.length && j>=0 && j<new_board[0].length){
                if(new_board[i][j] === 'G'){
                    var cell = $('td[i='+i+'][j='+j+']');
                    $(cell).attr('parent-i', curr[0]);
                    $(cell).attr('parent-j', curr[1]);
                    backtrack(cell);
                    found = true;
                    return;
                }
                else if(new_board[i][j] === 'E'){
                    var cell = $('td[i='+i+'][j='+j+']');
                    $(cell).css('background-color', '#bafffc');
                    $(cell).attr('parent-i', curr[0]);
                    $(cell).attr('parent-j', curr[1]);
                    $(cell).attr('state', 'checked');
                    var g_cost = curr[3] + 1;
                    var h_cost = Math.abs(i - end_i) + Math.abs(j - end_j);
                    var f_cost = g_cost + h_cost;
                    // console.log(i, j, g_cost, h_cost, f_cost);
                    open.push([i,j, f_cost, g_cost]);
                    open = sortOpen(open);
                    // console.log(open);
                }
            }
        }
    }
}

function sortOpen(arr){
    for (let index = arr.length-1; index > 0; index--) {
        if(arr[index-1][0] == arr[index][0] && arr[index-1][1] == arr[index][1]){
            // console.log(arr[index-1], arr[index]);
            if(arr[index-1][2] > arr[index][2]){
                console.log(arr[index-1], arr[index]);
                arr[index-1] = arr[index];
                var cell = $('td[i='+arr[index][0]+'][j='+arr[index][1]+']');
                $(cell).attr('parent-i', curr[0]);
                $(cell).attr('parent-j', curr[1]);
                console.log(arr[index-1], arr[index]);
            }
            arr.splice(index, 1);
            return arr;
        }
        if(arr[index-1][2] <= arr[index][2]){
            temp = arr[index];
            arr[index] = arr[index-1]
            arr[index-1] = temp;
        }
        else{
            return arr;
        }
    }
    return arr;
}
