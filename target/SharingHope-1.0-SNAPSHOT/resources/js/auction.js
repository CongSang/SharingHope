
//Load theo trang cho trang dau gia
var auctionPage = 1;
var auctionFetching = false;
var disableLoadMoreAuction = false;

function auctionNextPage() {
    if (auctionFetching) return;
    
    auctionPage++;
}

function formatMoney (value) {
    const money = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    
    return money;
}

function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(value) {
   const date = new Date(value);
  return (
    [
      padTo2Digits(date.getDate()),
      padTo2Digits(date.getMonth() + 1),
      date.getFullYear()
    ].join('/') +
    ' lúc ' +
    [
      padTo2Digits(date.getHours()),
      padTo2Digits(date.getMinutes()),
      padTo2Digits(date.getSeconds())
    ].join(':')
  );
}

function customHashtag(element) {
    var rgxp = new RegExp(/(\s|^)\#\w\w+\b/gm);
    var str_content_origin = $(element).text();
    var str_content = str_content_origin.match(rgxp);
    $.each(str_content, function(index, v){
        var hashtag = v.trim();
        var repl = `<span class="tag">${v}</span>`;
        $(element).html($(element).html().replace(hashtag, repl));
    });
}

function deleteAuction(endpoint, auctionId) {
    swal({
        title: "Bạn có chắc là hủy đấu giá bài viết này?",
        icon: "warning",
        buttons: true,
        dangerMode: true
      })
      .then((isDeleted) => {
          if (isDeleted) {
            $(`.auction-del-loading-${auctionId}`).css("display", "block");

            $.ajax({
                type: 'delete',
                url: endpoint + "/" + auctionId,
                dataType: 'json',
                success: function() {
                    swal("Poof! Your imaginary file has been deleted!", {
                    icon: "success"
                    });
                    $(`.auction-post-${auctionId}`).remove();
                    $(`.auction-del-loading-${auctionId}`).css("display", "none");
                }
            });
        }
    });
}

function findHashtags(searchText) {
    var regexp = /(\s|^)\#\w\w+\b/gm
    result = searchText.match(regexp);
    if (result) {
        result = result.map(function(s){ return s.trim(); }).join(' ');
        return result;
    } else {
        return "";
    }
}

function createAuction() {
    const formData = new FormData();
    const fs = document.getElementById('uploadImage1');
    const content = $('#statusContent1').val();
    const startPrice = $('#start-price').val();
    const endDate = $('#end-date').val();
    const endTime = $('#end-time').val();
    const q = new Date;
    const currentDate = new Date(q.getFullYear(),q.getMonth(),q.getDate());
    
    if(startPrice < 1000000) {
        $('.start-price-validate').css("display", "block");
        return;
    }
    
    if((new Date(endDate)) < currentDate) {
        $('.endDate-validate').css("display", "block");
        return;
    }
    
    if (startPrice !== "" && endDate !== "" && endTime !== "" && fs.files[0] !== undefined)  {
        var fileType = fs.files[0]['type'];
        var validImageTypes = ['image/jpeg', 'image/png'];
        if (!validImageTypes.includes(fileType)) {
            alert("Không thể nhận loại file này!");
        }
        else {
            $('#auctionLoadingTop').css('display', 'block');

            for (const file of fs.files) {
                formData.append("file", file);
            }
            $.ajax({
                type: 'post',
                url: `${ctxPath}/api/post-img`,
                data: formData,
                dataType : "json",
                processData : false,
                cache : false,
                contentType : false
            })
            .done(function(data){

                $.ajax({
                    type: 'post',
                    url: `${ctxPath}/api/create-auction`,
                    data: JSON.stringify({
                        'content':content,
                        'hashtag': findHashtags(content),
                        'imgUrl':data.url,
                        'startPrice': startPrice,
                        'endDate': endDate,
                        'endTime': endTime + ':00'
                    }),
                    dataType : 'json',
                    contentType : 'application/json',
                    success: function (data) {
                        $('#auctionLoadingTop').css('display', 'none');
                        $('#statusContent1').val(null);
                        $('.highlighter').html('');
                        $('uploadImage1').val(null);
                        $('#uploadPreview1').attr("src", "");
                         prependAuctionFeeds(data);
                    }
                })
                .fail(function(){
                    $('#auctionLoadingTop').css('display', 'none');
                        $('.auction-container').prepend(errorHtml);
                });
            })
            .fail(function(){
                $('#auctionLoadingTop').css('display', 'none');
                    $('.auction-container').prepend(errorHtml);
            });

            $('.modal-auction').removeClass('open');
        }
    }
}

function prependAuctionFeeds(auction) {
    const html = `<div class="post auction-post-${auction.id}">
                    <div class="card post--item">
                        <div class="card-header border-0 pb-0 pt-3">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="d-flex align-items-start">
                                    <div class="me-2">
                                        <a href="${ctxPath}/user/${auction.userId.id}">
                                            <img class="avatar-img rounded-circle" src="${auction.userId.avatar}" alt="">
                                        </a>
                                    </div>
                                    <!-- Info -->
                                    <div>
                                        <div class="nav nav-divider">
                                            <h6 class="nav-item card-title mb-0">
                                                <a href="${ctxPath}/user/${auction.userId.id}">${auction.userId.lastname} ${auction.userId.firstname}</a>
                                            </h6>
                                            <span class="ms-2 nav-item small text-secondary">${moment(auction.auctionDate).fromNow()}</span>
                                            <div class="text-center ms-4 auction-del-loading-${auction.id}" style="display: none">
                                                <div class="spinner-border text-muted"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--Menu-->
                                <div class="dropdown">
                                    
                                    ${auction.active == true ?
                                    `<a href="#" class="text-secondary px-2" id="cardFeedAction" data-bs-toggle="dropdown" aria-expanded="false">
                                        <i class="fa-solid fa-ellipsis"></i>
                                    </a>
                                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="cardFeedAction">
                                        
                                        ${(auction.endDate <= Date.now()) ?
                                            `<li>
                                                <div class="dropdown-item cursor-pointer">
                                                    Hoàn thành từ thiện
                                                </div>
                                            </li>
                                            ` : ``
                                        }
                                        ${(auction.endDate > Date.now()) ?
                                        `<li>
                                            <div class="dropdown-item cursor-pointer" onclick="editAuction(${auction.id}, this)">
                                                Chỉnh sửa bài viết
                                            </div>
                                        </li>
                                        <li>
                                            <div class="dropdown-item cursor-pointer" onclick="deleteAuction('${ctxPath}/api/auctions', ${auction.id})">
                                                Xóa bài viết
                                            </div>
                                        </li>` : ``}

                                    </ul>` : ``}
                                </div>
                            </div>
                        </div>
                        <div class="card-body pb-2">
                            <p class="post--content mb-3 auction-${auction.id}">
                                ${auction.content}
                            </p>
        
                            <p class="auction--price mb-1">
                                ${auction.endDate <= Date.now() ? 
                                `<span class="small">Đấu giá đã kết thúc (hãy xem người chiến thắng, kiểm tra thanh toán, thực hiện từ thiện và xác nhận hoàn thành việc từ thiện trong bài viết này, nếu người thắng cuộc không thanh toán hãy báo cáo lại cho chúng tôi)
                                <i class="fa-solid fa-triangle-exclamation text-danger"></i>
                                </span>` :
                                `Giá khởi điểm:<span class="ms-2">${formatMoney(auction.startingPrice)}</span>`}
                            </p>
                            <p class="auction--price mb-3">Kết thúc ngày ${formatDate(auction.endDate)}</p>

                            <img class="card-img post--img" src="${auction.image}" alt="Post image" onclick="showFull2(this)">

                            <div class="line"></div>

                            <div class="post--action py-2 d-flex flex-nowrap align-items-center justify-content-between">
                                <div class="post--action-like w-100 d-flex justify-content-center align-items-center">
                                    ${(auction.active) ? 
                                    `<div class="auction--action-hover" onclick="showFollowAuction(this)">
                                        <i class="fa-solid fa-eye"></i>
                                        <span class="auction--action-text auction-follow ms-2">Theo dõi (0 người đã tham gia)</span>
                                    </div>` : 
                                    `<div class="btn-disable">
                                        <i class="fa-solid fa-check"></i>
                                        <span class="auction--action-text auction-follow ms-2">Hoàn thành</span>
                                    </div>`}
                                    
                                </div>
                            </div>

                            <div class="auction-user-join auction-follow-list">
                                
                            </div>

                        </div>
                    </div>
                </div>`;
            
        $('.auction-container').prepend(html);
        customHashtag(`.auction-${auction.id}`);         
}

function editAuction(auctionId, element) {
    event.preventDefault();
    var clickedAuction = $(element).parents(`.auction-post-${auctionId}`);
    
    var content = $(clickedAuction).find(`p.auction-${auctionId}`).text();
    var imgSrc = $(clickedAuction).find('.auction--img').prop('src');
    if (imgSrc.toLowerCase().indexOf('https://') === -1 )
        imgSrc = '';
    modalEditPost(auctionId, $(element), content.trim(), imgSrc);
    $("textarea").hashtags();
}

function comfirmEditPost(id) {
    var loadingHtml =   `   <div class="text-center mt-3 post-loading">
                                            <div class="spinner-border text-muted"></div>
                                        </div>
                                                `; 
    var clickedAuction = $(`.auction-post-${id}`);
    var clickedPostHtml = $(clickedAuction).html();
    
    var content = $('#editingStatusContent').val();
    var imgSrc = $('#editPreview').prop('src');
    
    if (imgSrc.toLowerCase().indexOf('https://') === -1 ) {
    
        var formData = new FormData();
        var fs = document.getElementById('editImage');
        var content = $('#editingStatusContent').val();

        if (!isBlank(content) || content !== "" || imgSrc !== undefined)  {
            if(fs.files[0] === undefined) {
                editStatus(id, clickedAuction, clickedPostHtml, content);
            }
            else {
                var fileType = fs.files[0]['type'];
                var validImageTypes = ['image/jpeg', 'image/png'];
                if (!validImageTypes.includes(fileType)) {
                    alert("Không thể nhận loại file này!");
                }
                else {
                    $(clickedAuction).html(loadingHtml);
                    removeEditModal();
                    for (const file of fs.files) {
                        formData.append("file", file);
                    }
                    $.ajax({
                        type: 'post',
                        url: `${ctxPath}/api/post-img`,
                        data: formData,
                        dataType : "json",
                        processData : false,
                        cache : false,
                        contentType : false
                    })
                    .done(function(data){
                        $.ajax({
                            type: 'put',
                            url: `${ctxPath}/api/edit-auction/${id}`,
                            data: JSON.stringify({
                                'content':content,
                                'hashtag': findHashtags(content),
                                'imgUrl':data.url
                            }),
                            dataType : 'json',
                            contentType : 'application/json',
                            success: function (data2) {
                                $(clickedAuction).html(clickedPostHtml);
                                $(clickedAuction).find("#auction-timeFromNow").text(moment(data2.auctionDate).fromNow());
                                $(clickedAuction).find(`.auction-${id}`).text(data2.content);
                                $(clickedAuction).find('.auction--img').attr('src', data2.image);
                                $(clickedAuction).find('.auction--img').css('display', 'block');
                                customHashtag(`.auction-${id}`);
                            }
                        })
                        .fail(function(){
                            $(clickedAuction).html(clickedPostHtml);
                        });
                    })
                    .fail(function(){
                        $(clickedAuction).html(clickedPostHtml);
                    });
                }
            }
        }
        else
            alert("Vui lòng nhập nội dung bài viết!");
    }
    else {
        $(clickedAuction).html(loadingHtml);
        removeEditModal();
        $.ajax({
            type: 'put',
            url: `${ctxPath}/api/edit-auction/${id}`,
            data: JSON.stringify({
                'content':content,
                'hashtag': findHashtags(content),
                'imgUrl':imgSrc.toLowerCase()
            }),
            dataType : 'json',
            contentType : 'application/json',
            success: function (data2) {
                $(clickedAuction).html(clickedPostHtml);
                $(clickedAuction).find("#auction-timeFromNow").text(moment(data2.auctionDate).fromNow());
                $(clickedAuction).find('.post--content').text(data2.content);
                $(clickedAuction).find('.post--img').attr('src', data2.image);
                customHashtag(`.auction-${id}`);
            }
        })
        .fail(function(){
            $(clickedAuction).html(clickedPostHtml);
        });
    }
}

function editStatus(id, clickedPost, clickedPostHtml, content) {
    var loadingHtml =   `   <div class="text-center mt-3 post-loading">
                                            <div class="spinner-border text-muted"></div>
                                        </div>
                                                `; 
    
    $(clickedPost).html(loadingHtml);
    removeEditModal();
    $.ajax({
            type: 'put',
            url: `${ctxPath}/api/edit-auction/${id}`,
            data: JSON.stringify({
                'content':content,
                'hashtag': findHashtags(content),
                'imgUrl': ''
            }),
            dataType : 'json',
            contentType : 'application/json',
            success: function (data) {
                $(clickedPost).html(clickedPostHtml);
                $(clickedPost).find("#auction-timeFromNow").text(moment(data.auctionDate).fromNow());
                $(clickedPost).find(`.auction-${id}`).text(data.content);
                $(clickedPost).find('.auction--img').css('display', 'none');
                $(clickedPost).find('.auction--img').attr('src', '');
                 customHashtag(`.auction-${id}`);
            }
        })
        .fail(function(){
            $(clickedPost).html(clickedPostHtml);
        });
}