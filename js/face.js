$(function () {
    var temp_base64;
    var face_base64;

    var body_siteL;
    var body_siteT;
    var body_with;
    var body_scale;

    var t64,muban64,temp_faceSrc,border_left,border_top,tempimage_width,tempimage_height,faceIndex,faceArry,userChose,facebase64;

    $('.upload_now').click(function () {
        $('#temp').trigger('click');
    })

    // // 获取上传的图片base64
    // $('#temp').change(function (event) {
    //     $('#preview').css('background','none')
    //     file = event.target.files[0];
    //     var a = new FileReader();
    //     a.onload = function (e) {
    //         var base64Str = e.target.result;//获取base64
    //         //下面是测试得到的base64串能否正常使用：
    //
    //         face_base64 = base64Str;
    //     };
    //     a.readAsDataURL(file);
    // });


    // 网页拍照
    function takePhoto(){
        const videoElement = document.querySelector('video');
        // const videoSelect = document.querySelector('select#videoSource');
        // const selectors = [videoSelect];
        var optionID = [];
        var firsttimeId = true;


        function gotDevices(deviceInfos) {
            // Handles being called several times to update labels. Preserve values.
            // const values = selectors.map(select => select.value);
            // selectors.forEach(select => {
            //   while (select.firstChild) {
            //     select.removeChild(select.firstChild);
            //   }
            // });

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

            // selectors.forEach((select, selectorIndex) => {
            //   if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {
            //     select.value = values[selectorIndex];
            //   }
            // });
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

            t64=imgSrc;
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

        // 打开正在加载动画
        var lay = layer.load(1, {
            shade: [0.1,'#fff'] //0.1透明度的白色背景
        });

        var temp_src = ['../img/post_temp.jpg','../img/post_temp01.jpg','../img/post_temp03.jpg','../img/post_temp04.png','../img/post_temp08.jpg','../img/post_temp10.jpg','../img/post_temp11.jpg']
        var c = $(this).parent('.postimages').index()-1;

        temp_faceSrc = temp_src[c];
        console.log(c)
        $('.post_move').attr('src',temp_src[c]);

        // 把用户所选择的照片模板转化成base64
        var img = temp_faceSrc;//imgurl 就是你的图片路径
        function getBase64Image(img) {
            var canvas = document.createElement("canvas");
            if(img.width<img.height&&1000<img.height){
                var narheight = img.height;
                img.width = 900/narheight*(img.width);
                img.height = 900;
            }else if(img.height<img.width&&1000<img.width){
                var narwidth = img.width;
                img.width = 900;
                img.height = 900/narwidth*(img.height);
            }

            canvas.width = img.width;
            canvas.height = img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, img.width, img.height);
            var ext = img.src.substring(img.src.lastIndexOf(".")+1).toLowerCase();
            var dataURL = canvas.toDataURL("image/"+ext);
            return dataURL;

        }

        var image = new Image();
        image.src = img;
        image.onload = function(){
            var base64 = getBase64Image(image);

            console.log(base64);

            temp_base64 = base64;

            $('#tempimage').attr('src',temp_base64);


                // 请求海报中可融合的人脸位置等信息
                $.ajax({
                    type: 'POST',
                    url: 'https://api-cn.faceplusplus.com/facepp/v3/detect',
                    data: {
                        'api_key': 'Y9CiofWLEOO5NjiiJZJ24c-cQPfOSh2L',
                        'api_secret': '0xHkJoh29IL6Bx0k1yUnfT3hgKcXUdkz',
                        'image_base64':temp_base64
                        // 'template_rectangle':''+border_top+','+border_left+','+red_border_width+','+red_border_height+''

                        // 'merge_base64':face_base64
                    },
                    // json:'jsonp',
                    success: function (res) {
                        faceArry = res.faces;
                        // var faceBOX = '<div class="faceBOX" name='+i+'></div>';
                        var facewidth,faceheight,faceleft,facetop;

                        switch(c){
                            case 0:
                                addBox();
                                break;
                            case 1:
                                addBox();
                                break;
                            case 2:
                                addBox(2);
                                break;
                            case 3:
                                addBox();
                                break;
                            case 4:
                                addBox();
                                break;
                            case 5:
                                addBox();
                                break;
                            case 6:
                                addBox();
                                break;

                        }

                        // 循环出接口返回的人脸信息并画在图片上
                        function addBox(a,b,c,d,e) {

                            // 这里的循环上限本应该是res.faces.length，但是由于有些人脸信息不需要,所以自定义循环次数
                            for(var i=0;i<res.faces.length;i++){
                                console.log(res.faces[i].face_rectangle);

                                // 原始海报的尺寸
                                tempimage_width = $('#tempimage').width();
                                tempimage_height = $('#tempimage').height();

                                // 人脸在原尺寸海报中的位置
                                facewidth = res.faces[i].face_rectangle.width;
                                faceheight = res.faces[i].face_rectangle.height;
                                faceleft = res.faces[i].face_rectangle.left;
                                facetop = res.faces[i].face_rectangle.top;

                                // 人脸在预览图中的位置
                                var smallwidth = facewidth/tempimage_width*100;
                                var smallheight = faceheight/tempimage_height*100;
                                var smallleft = faceleft/tempimage_width*100;
                                var smalltop= facetop/tempimage_height*100;
                                console.log(tempimage_width);
                                $('.change_site').append('<div class="faceBOX" name='+i+'></div>');
                                $('.faceBOX').eq(i).css({'width':smallwidth+'%','height':smallheight+'%','left':smallleft+'%',"top":smalltop+'%'});



                                if(i==a){
                                    $('.faceBOX').eq(i).hide();
                                }else if(i==b){
                                    $('.faceBOX').eq(i).hide();
                                }else if(i==c){
                                    $('.faceBOX').eq(i).hide();
                                }else if(i==d){
                                    $('.faceBOX').eq(i).hide();
                                }else if(i==e){
                                    $('.faceBOX').eq(i).hide();
                                }



                            }
                        }


                        // 选择要融合的脸
                        $('.faceBOX').on('click',function () {
                            // 清空之前用户选择的脸部位置信息
                            userChose='';

                            // 表示已经选中的脸
                            $(this).css('border','1px solid #16AF0E').siblings('.faceBOX').css('border','1px solid #FF0000')

                            // 获取用户点击的这张脸在返回数组中的下标
                            faceIndex = $(this).attr('name');

                            // 定义传到接口的脸不位置
                            userChose = ''+faceArry[faceIndex].face_rectangle.top+','+faceArry[faceIndex].face_rectangle.left+','+faceArry[faceIndex].face_rectangle.width+','+faceArry[faceIndex].face_rectangle.height+''

                        });

                        // 关闭加载动画
                        layer.close(lay);

                        $('.post_view').show();

                    },
                    error: function (err) {
                        // $('.tips').hide();
                        layer.close(lay);
                        console.log(err)
                    }
                })

        };
        // base64转化end
    });





    // 选好需要融合的脸之后点击确定
    $('.site_sure').click(function () {

        // 移除之前添加的face红框
        $('div').remove('.faceBOX');

        $('.post_view').hide();

        var face = $('#imghead').attr('src');

        if(body_scale==undefined){
            body_scale=1;
        }
        var red_border_width = parseInt(body_scale*80);
        var red_border_height = parseInt(body_scale*100);


        if(face==undefined){
            alert('请上传有效照片重试！');
        }else if(temp_base64==undefined){
            alert('请点击大图选择一张模板！');
        }else{
            // 正在加载动画
            var lay = layer.load(1, {
                shade: [0.1,'#fff'] //0.1透明度的白色背景
            });
            console.log(t64)
            // alert(''+border_top+','+border_left+','+red_border_width+','+red_border_height+'')
            $.ajax({
                type: 'POST',
                url: 'https://api-cn.faceplusplus.com/imagepp/v1/mergeface',
                data: {
                    'api_key': 'Y9CiofWLEOO5NjiiJZJ24c-cQPfOSh2L',
                    'api_secret': '0xHkJoh29IL6Bx0k1yUnfT3hgKcXUdkz',
                    'template_base64':temp_base64,
                    'merge_base64':face,
                    'merge_rate':'90',
                    'template_rectangle':userChose

                    // 'merge_base64':face_base64
                },
                json:'jsonp',
                success: function (res) {
                    layer.close(lay);

                    // alert(res.request_id);

                    $('#result').attr('src','data:image/jpeg;base64,'+res.result);
                    $('.res').show();

                    temp_base64=null;

                    userChose='';

                },
                error: function (err) {
                    layer.close(lay);
                    alert('请重试或换图重试！');
                    // $('.tips').hide();

                    console.log(err)
                }
            })


        }


    });


    $('.site_rechose').click(function () {
        // 清空之前的脸部位置信息
        userChose='';
        $('.post_view').hide();
        $('div').remove('.faceBOX');
    });


    // 取消拍照
    $('.back').click(function () {
        $('.paizhao').hide();
    });


    $('.pai_now').click(function () {
        $('#paizhao').css('display','flex');
    })


    // 合成海报按钮
    $('.compound_btn').click(function () {




    });



    // 合成结果的返回按钮
    $('.result_back').click(function () {
        $('.res').hide();
    })



})