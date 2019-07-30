$(function () {
    var temp_base64;
    var face_base64;

    var body_siteL;
    var body_siteT;
    var body_with;
    var body_scale;

    var t64,body;

    // $('.post_view').css({'width':$(window).width(),'height':$(window).height()});

$('.upload_now').click(function () {
    $('#temp').trigger('click');
})


    // 手指缩放
    var $targetObj = $('#body_move');
    //初始化设置
    cat.touchjs.init($targetObj, function (left, top, scale, rotate) {

        $targetObj.css({
            // left: left+screen_w/2.5,
            // top: top+screen_h/2.5,
            'transform': 'scale(' + scale + ') rotate(' + rotate + 'deg)',
            '-webkit-transform': 'scale(' + scale + ') rotate(' + rotate + 'deg)'
        });
    });
    //初始化拖动手势（不需要就注释掉）
    cat.touchjs.drag($targetObj, function (left, top) {
//          $('#left').text(left);
//          $('#top').text(top);
    });
    //初始化缩放手势（不需要就注释掉）
    cat.touchjs.scale($targetObj, function (scale) {
        body_scale = scale;

    });
    cat.touchjs.rotate($targetObj, function (rotate) {
        // alert(rotate)

    });
    // 手指缩放end


    // 网页拍照
    function takePhoto(){
        const videoElement = document.querySelector('video');

        var optionID = [];
        var firsttimeId = true;

        function gotDevices(deviceInfos) {

            for (let i = 0; i !== deviceInfos.length; ++i) {
                const deviceInfo = deviceInfos[i];
                const option = document.createElement('option');
                option.value = deviceInfo.deviceId;
                if (deviceInfo.kind === 'videoinput') {
                    // option.text = deviceInfo.label || `camera ${videoSelect.length + 1}`;

                    if(firsttimeId) optionID.push(option.value);

                    // videoSelect.appendChild(option);
                } else {
                    // console.log('Some other kind of source/device: ', deviceInfo);
                }
            }
            firsttimeId = false;
            console.log(firsttimeId);
            console.log(optionID);
        }

        navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);

        // Attach audio output device to video element using device/sink ID.
        function attachSinkId(element, sinkId) {
            if (typeof element.sinkId !== 'undefined') {
                element.setSinkId(sinkId)
                    .then(() => {
                        console.log(`Success, audio output device attached: ${sinkId}`);
                    })
                    .catch(error => {
                        let errorMessage = error;
                        if (error.name === 'SecurityError') {
                            errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
                        }
                        console.error(errorMessage);
                        // Jump back to first output device in the list as it's the default.

                    });
            } else {
                console.warn('Browser does not support output device selection.');
            }
        }

        function changeAudioDestination() {
            const audioDestination = null;
            attachSinkId(videoElement, audioDestination);
        }

        function gotStream(stream) {
            window.stream = stream; // make stream available to console
            videoElement.srcObject = stream;
            // Refresh button list in case labels have become available
            return navigator.mediaDevices.enumerateDevices();
        }

        function handleError(error) {
            console.log('navigator.getUserMedia error: ', error);
        }

        Array.prototype.contains = function(needle) {
            for (i in this) {
                if (this[i].indexOf(needle) > 0)
                    return i;
            }
            return -1;
        }

        // 获取手机型号
        var device_type = navigator.userAgent;//获取userAgent信息
        // document.write(device_type);//打印到页面
        var md = new MobileDetect(device_type);//初始化mobile-detect
        var os = md.os();//获取系统
        var model = "";
        if (os == "iOS") {
            //ios系统的处理

            os = md.os() + md.version("iPhone");
            model = md.mobile();
        } else if (os == "AndroidOS") {
            // alert('安卓');

            //Android系统的处理
            os = md.os() + md.version("Android");
            var sss = device_type.split(";");
            var i = sss.contains("Build/");
            if (i > -1) {
                model = sss[i].substring(0, sss[i].indexOf("Build/"));

            }
        }
        // alert(os + "---" + model);//打印系统版本和手机型号
        // alert(model);
        var phoneNum = model.replace(/\s*/g,"");

        // alert(phoneNum.length);
        // 获取手机型号end

        // 切换镜头
        function start() {

            if (window.stream) {
                window.stream.getTracks().forEach(track => {
                    track.stop();
                });
            }

            if(phoneNum=="NX569J"||phoneNum=="NX569H"){
                // optionindex=2;
                if(optionindex==1)
                {
                    optionindex=2;
                }
                else
                {
                    optionindex = 1;
                }

            }else{

                if(optionindex==0)
                {
                    optionindex=1;
                }
                else
                {
                    optionindex = 0;
                }
            }


            // const videoSource = videoSelect.value;
            const videoSource = optionID[optionindex];
            const constraints = {
                audio: false,
                video: {deviceId: videoSource ? {exact: videoSource} : undefined}
            };
            navigator.mediaDevices.getUserMedia(constraints).then(gotStream).then(gotDevices).catch(handleError);

        }


        var optionindex = 1;

        start();


        $('.change').click(function () {
            start();
        });

        var cava_img = document.getElementById("cava_img");

        // Put variables in global scope to make them available to the browser console.
        var video = document.querySelector('video');
        var canvas = window.canvas = document.querySelector('canvas');
        canvas.width = 480;
        canvas.height = 360;

        // 拍照事件
        var button = document.querySelector('#pai');
        button.onclick = function() {

            var player = $("#img");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            //canvas.getContext('2d').drawImage(player, 0, 0, canvas.width/2, canvas.height);
            // 生成cavas

            // base64后的图片
            var imgSrc = document.getElementById("cava").toDataURL("image/png");

            temp_base64=imgSrc;
            console.log(imgSrc);
            $('#imghead').attr('src',imgSrc);
            $('#preview').css('background','none')
            $('#paizhao').hide();


        };
        // 拍照点击事件end
    }


    // 根据手机系统判断是否使用网页拍照
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //如果输出结果是true就判定是android终端或者uc浏览器
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //根据输出结果true或者false来判断ios终端
    //!!双叹号一般用来将后面的表达式转换为布尔型的数据（boolean）
    if(isAndroid){
        // alert("安卓");
        $('.pai_now').show();
        $('.photoImg').show();
        takePhoto();
    }else if(isiOS){
        // alert("苹果");
    }
    // 判断end




    // 选海报
    $('.postimages .images').click(function () {

        $('.headTop').css({"display":"flex","align-items": "center","justify-content": "space-between"});

        body = $('#imghead').attr('src');
        // t64= temp_base64;
        var temp_src = ['../img/post_temp.jpg','../img/post_temp04.png','../img/post_temp05.jpg','../img/post_temp06.png','../img/post_temp08.jpg']
        var c = $(this).parent('.postimages').index()-1;

        $('#post_temp').attr('src', temp_src[c]);

        var postwidth = $('#post_temp').width();
        var postheight = $('#post_temp').height();

        // alert(postwidth+','+postheight);

        // 海报尺寸过大时，压缩海报的品质
        if(postheight<postwidth&&postwidth>1000){
            // alert('宽图');
            postwidth = 1000;
            $('#post_temp').css('width',postwidth);
        }else if(postwidth<postheight&&postheight>1200){
            var narheight = postheight;
            postheight=1200;
            postwidth=postheight/narheight*postwidth;
            $('#post_temp').css('width',postwidth);
            // $('#post_temp').css('height',postheight);
        }

        // 预览海报
        $('.post_view .post_move').attr('src', temp_src[c]);


        if(body==undefined){

            alert('出了点问题！试试换张图上传！');

        }else {
            // 正在加载动画
            var lay = layer.load(1, {
                shade: [0.1,'#fff'] //0.1透明度的白色背景
            });

            var fzc;

            // console.log(t64);

            $.ajax({
                type: 'POST',
                url: 'https://api-cn.faceplusplus.com/humanbodypp/v2/segment',
                data: {
                    'api_key': 'Y9CiofWLEOO5NjiiJZJ24c-cQPfOSh2L',
                    'api_secret': '0xHkJoh29IL6Bx0k1yUnfT3hgKcXUdkz',
                    'image_base64': body,
                    'return_grayscale': 1
                    // 'merge_base64':face_base64
                },
                json:'jsonp',
                success: function (res) {
                    layer.close(lay);
                    fzc = res.body_image;

                    $('#post_body').attr('src', 'data:image/jpeg;base64,' + fzc);
                    $('#body_move').attr('src', 'data:image/jpeg;base64,' + fzc);

                    $('.post_view').show();
                    $('.content').hide();

                },
                error: function (err) {
                    layer.close(lay);
                    alert('请重试或换图重试！');
                    console.log(err)
                }
            })

        }


    });

    // 取消合成
    $('.rechose').click(function () {
        $('.post_view').hide();
        $('.content').show();
        $('.postBOX').show();

    });

    // 确定合成
    $('.site_sure').click(function () {



        var body_wid = $('#body_move').width();
        var body_hei = $('#body_move').height();

        body_siteL = $('#body_move').css('left').replace("px","")/$('.post_move').width();
        body_siteT = $('#body_move').css('top').replace("px","")/$('.post_move').height();
        // body_with = $('#body_move').width()/$('.post_move').width();

        var scal = $('#body_move').css('transform');
        console.log(scal);

        var z = body_siteL*100+'%';
        var c = body_siteT*100+'%';

        if(!body_scale==undefined){

            $('#post_body').css({'left':z,'top':c,'transform':scal});
        }else{
            $('#post_body').css({'left':body_siteL*100+'%','top':body_siteT*100+'%','transform':scal});
        }


        $('.post_view').hide();
        $('.content').show();



        var bodysrc =  $('#post_temp').attr('src');

        if(body==undefined){
            alert('请上传有效照片重试！');
        }else if(bodysrc==''){
            alert('请选择一张海报！');
        }else{

            nola();
        }
    });

    var deg = 0;


    // 取消拍照
    $('.back').click(function () {
        $('.paizhao').hide();
    });


    $('.pai_now').click(function () {
        $('#paizhao').css('display','flex');
    })


    // 合成海报按钮
    // $('.compound_btn').click(function () {
    //
    // });

    // $('.res .shade').click(function () {
    //     $('.res').hide();
    // });

    // 合成结果的返回按钮
    $('.result_back').click(function () {
        $('.res').hide();
        $('.content').show();
        $('#postBOX').show();
        $('#postBOX').css({'width': '1px',
            'height': '1px',
            'overflow':'hidden',
            'position': 'absolute',
        'left': '-100%',
        'top': '-100%'})

    })

//    生成海报js
    function nola(){
        // 正在加载动画
        var lay = layer.load(1, {
            shade: [0.1,'#fff'] //0.1透明度的白色背景
        });
        // var loading = layer.load(1);
        var content = document.querySelector('body');
        content.style.width = window.innerWidth+'px';
        content.style.height = window.innerHeight+'px';
        //直接选择要截图的dom，就能截图，但是因为canvas的原因，生成的图片模糊
        //html2canvas(document.querySelector('div')).then(function(canvas) {
        // document.body.appendChild(canvas);
        //});
        //创建一个新的canvas

        var canvas2 = document.createElement("canvas");
        let _canvas = document.querySelector('.poster');
        //此处可换body，或div等
        var w = parseInt(window.getComputedStyle(_canvas).width);
        var h = parseInt(window.getComputedStyle(_canvas).height);
        //将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了

        canvas2.width = w ;
        canvas2.height = h ;
        canvas2.style.width = w + "px";
        canvas2.style.height = h + "px";



        console.log(canvas2.width);
        console.log(canvas2.height);

        //可以按照自己的需求，对context的参数修改,translate指的是偏移量
        // var context = canvas.getContext("2d");
        // context.translate(0,0);
        var context = canvas2.getContext("2d");
        context.scale(1, 1);
        html2canvas(document.querySelector(".poster"), {canvas: canvas2 ,useCORS:true}).then(canvas => {
            // document.body.appendChild(canvas)
            // document.querySelector("#result").setAttribute('src',canvas.toDataURL());
            console.log(canvas.toDataURL());
            $('#result').attr('src',canvas.toDataURL())
            // $('.tips').hide();
            $('.res').show();
            $('.content').hide();
            $('.shade').show();

            // 合成完之后清空上一张合成区域的人像图
            $('#post_body').attr('src','');
            $('#post_temp').css('width','');

            $('#postBOX').hide();
            layer.close(lay);
        });
    }


})