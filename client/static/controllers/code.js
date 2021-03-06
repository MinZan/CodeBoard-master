app.controller('CodeController', function($scope, $location, socket) {
    var option = {
            resize  : false,
            hidden  : false,
            shft    : false,
            ctbmove : false,
            typing  : false,
            tDelay  : 0
        },
        code   = '',
        lobby  = $location.$$path.substr(1);

    socket.emit('CodeController', {lobby: lobby, ctbbox: $('#ctbbox').css('display')});
    socket.on('toggleTextEditor', function() {toggleTextEditor();})

    $('.codeEdit').height( parseInt($(window).height())- 32 );
    $('.codeEditor').height( $('.codeEdit').height()-32 );
    $('#ctbbox').css('display', 'none');

    var offscreen = parseInt($('.CEResize').width())-parseInt($('.codeEdit').width());
    $('.codeEdit').css('right', offscreen);
    option.hidden = true;

    function toggleTextEditor() {
        if (option.hidden) {
            //unhide
            $('.codeEdit').animate({ right: 0 }, 500);

            option.hidden = false;
        } else {
            //hide
            var offscreen = parseInt($('.CEResize').width())-parseInt($('.codeEdit').width());
            $('.codeEdit').animate({ right: offscreen }, 500);

            option.hidden = true;
        }
    }
    function cArrToHtml(arr, i) {
        if (i == undefined) {i = 0}
        if (i >= arr.length) {
            return '';
        }
        var purpleKeywords = [
            'if',
            'var',
            'else',
            'function'
        ];
        if ( arr[i] && purpleKeywords.includes(arr[i]) ){
            return '<span class="purple">' + arr[i] + '</span> ' + cArrToHtml( arr, i+1 );
        }
        return arr[i] + ' ' + cArrToHtml( arr, i+1 );
    }


    $(document).keydown(function(e) {
        if (e.keyCode == 16) {
            option.shft = true;
        }
        option.typing = true;
        tDelay = 0;
    })
    $(document).keyup(function(e) {
        if (e.keyCode == 16) {
            option.shft = false;
        }
        if (e.keyCode == 9 && option.shft) {
            $('.CETA').blur();
            toggleTextEditor();
        }
    })
    $(window).resize(function() {
        $('.codeEdit').height( $(window).height() );
    })
    $('.CEResize').mousedown(function(e) {
        if (!option.hidden) {
            option.resize = true;
            $(document).mousemove(function(e) {
                if (option.resize) {
                    $('.codeEdit').width( parseInt($(window).width())-e.pageX );
                }
            })
        }
    })
    $('.CEResize').mouseup(function(e) {
        if (option.resize) {
            option.resize = false;
        }
        if (option.hidden) {
            toggleTextEditor();
            option.hidden = false;
        }
    })
    $('.hide').click(function(e) {
        if (!option.hidden) {
            toggleTextEditor();
            option.hidden = true;
        }
    })
    $('.CETA').keydown(function(e) {
        if (e.keyCode == 9) {
            //tab
            e.preventDefault();
            code += '    ';
        } else if (e.keyCode == 32) {
            //space
            code += e.key;
        } else if (e.keyCode == 13) {
            //enter
            code += '\n';
        } else if (e.keyCode == 8) {
            //backspace
            code = $('.CETA').val();
        } else if (e.keyCode == 186) {
            //;
            code += e.key;
        } else if (!e.metaKey && !e.altKey && !e.ctrlKey && e.keyCode != 20 && e.keyCode != 16 && e.keyCode != 38 && e.keyCode != 40 && e.keyCode != 37 && e.keyCode != 39){
            //All else
            code += e.key;
        }
    })
    $('.CETA').keyup(function(e) {
        if (e.keyCode == 8) {
            //backspace
            code = $('.CETA').val();
        }
        setTimeout(function () {
            socket.emit('codeSend', {lobby: lobby, code: $('.CETA').val()});
        }, 100);
    })
    $('div.codeToBoard i').click(function(e) {
        // Plane goes weeeeee
        var i = $(this);
        $(this).addClass('fly');
        setTimeout(function () {
            i.removeClass('fly');
        }, 3650);

        // Code pass to server
        var code = $('.CETA').val();
        if (code.trim().length > 0) {
            socket.emit('code_to_board', {code: code, lobby: lobby});
        }
    })
    $('#ctbmove').mousedown(function(e) {
        if (option.shft) {
            socket.emit('clscbt', {lobby: lobby});
        } else {
            option.ctbmove = true;
            var tDiff = e.pageY-parseInt($('#ctbbox').css('top')),
            lDiff = e.pageX-parseInt($('#ctbbox').css('left'));
            $(document).mousemove(function(e) {
                if (option.ctbmove) {
                    $('#ctbbox').css('top' , e.pageY-tDiff);
                    $('#ctbbox').css('left', e.pageX-lDiff);
                }
            })
        }
    })
    $('#ctbmove').mouseup(function(e) {
        option.ctbmove = false;
    })

    socket.on('closecbt', function() {
        $('#ctbbox').css('display', 'none');
    })
    socket.on('codeReceive', function(data) {
        $('.CETA').val(data.code);
    })

    socket.on('code_to_board', function(data){
        console.log('received code from server: ', data.code);
        $('#ctbta').val(data.code);
        $('#ctbbox').css('display', 'block');
        $('#ctbbox').css('top', parseInt($(window).height())/2-parseInt($('#ctbbox').height()) );
        $('#ctbbox').css('left', parseInt($(window).width())/2-parseInt($('#ctbbox').width()) );
        $('#ctbta').height( document.getElementById('ctbta').scrollHeight );
        $('#ctbta').width( document.getElementById('ctbta').scrollWidth );
    })

})
/*
backspace   : 8
tab         : 9
space       : 32
enter       : 13
;           : 186

alt         : 91
shift       : 16
*/
