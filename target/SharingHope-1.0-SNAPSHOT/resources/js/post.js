
//Load theo trang cho trang chu
var postPage = 1;
var postFetching = false;
var disableLoadMorePost = false;

function postNextPage() {
    if (postFetching) return;
    
    postPage++;
}

function customHashtag(element) {
    var rgxp = new RegExp(/(\s|^)\#\w\w+\b/gm);
    var str_content_origin = $(element).text();
    var str_content = str_content_origin.match(rgxp);
    $.each(str_content, function(index, v){
        var hashtag = v.trim();
        var repl = `<span class="tag">${v}</span>`;
        console.log(hashtag);
        $(element).html($(element).html().replace(hashtag, repl));
    });
}

function loadPosts(endpoint, currentUserId, page) {
    if (!page) {
        page = 1;
    }
    
    $('.post-loading').css("display", "block");
    auctionFetching = true;

    $.ajax({
        type: 'get',
        url: endpoint + '?page=' + page,
        dataType: 'json',
        success: function (data) {
            
            if (data.length === 0) {
                disableLoadMorePost = true;
            }
            
            loadFeeds(data, currentUserId);
            $('.post-loading').css("display", "none");
            postFetching = false;
        }
    });
}

function loadFeeds(posts, currentUserId) {
    var userAvatar = $("#userAvatar").attr("src");
    $.each(posts, function (index, post) {

        let userComment = post.commentSet.filter(c => c.userId.id === currentUserId);
        userComment.sort(function (a, b) {
            // Turn your strings into dates, and then subtract them
            // to get a value that is either negative, positive, or zero.
            return new Date(b.commentDate) - new Date(a.commentDate);
        });
        let othersComment = post.commentSet.filter(c => c.userId.id !== currentUserId);
        othersComment.sort(function (a, b) {
            return new Date(b.commentDate) - new Date(a.commentDate);
        });

        const html = `<div class="post">      <!--Phan nay fecth du lieu de render-->
                <div class="card post--item">
                    <div class="card-header border-0 pb-0 pt-3">
                        <div class="d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-start">
                                <div class="me-2">
                                    <a href="#">
                                        <img class="avatar-img rounded-circle" src="${post.userId.avatar}" alt="">
                                    </a>
                                </div>
                                <!-- Info -->
                                <div>
                                    <div class="nav nav-divider">
                                        <h6 class="nav-item card-title mb-0">
                                            <a href="#">${post.userId.lastname} ${post.userId.firstname}</a>
                                        </h6>
                                        <span class="ms-2 nav-item small text-secondary">${moment(post.postedDate).fromNow()}</span>
                                    </div>
                                </div>
                            </div>
                            <!--Menu-->
                            <div class="dropdown">
                                <a href="#" class="text-secondary px-2" id="cardFeedAction" data-bs-toggle="dropdown" aria-expanded="false">
                                    <i class="fa-solid fa-ellipsis"></i>
                                </a>
                                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="cardFeedAction">
                                    ${(currentUserId === post.userId.id) ?
                                            `<li>
                                                <a class="dropdown-item" href="#">
                                                    Chỉnh sửa bài viết
                                                </a>
                                            </li>
                                            <li>
                                                <a class="dropdown-item" href="#">
                                                    Xóa bài viết
                                                </a>
                                            </li>` : ``
                                        }
                                    <li>
                                        <a class="dropdown-item" href="#">
                                            Báo cáo
                                        </a>
                                    </li>
                                    
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="card-body pb-2">
                        <p class="post--content mb-3 content--hashtag post-${post.id}">
                            ${post.content}
                        </p>
        
                        <img class="card-img post--img" src="${post.image}" alt="Post image" onclick="showFull(this)">

                        <div class="line"></div>

                        <div class="post--action py-2 d-flex flex-nowrap align-items-center justify-content-between">
                            <div class="post--action-like w-100 d-flex justify-content-center align-items-center">
                                <div class="post--action-hover" id="likeAction" onclick="createReact('${currentUserId}', '${post.id}', this)">
                                    ${((post.reactSet).length === 0) ? (
                                            `<div class="heart-like-button"></div>`
                                            ) : (
                                            (post.reactSet).map((react, index) => {
                                        return (currentUserId === react.user.id) ?
                                                `<div class="heart-like-button liked"></div>`
                                                : `<div class="heart-like-button"></div>`;
                                    })
                                            )
                                    }
                                    <span class="post--action-text ms-2">Thích (<span id="likeCounter">${post.reactSet.length}</span>)</span>
                                </div>
                            </div>
                            <div class="post--action-comment w-100 d-flex justify-content-center align-items-center">
                                <div class="post--action-hover" onclick="showComment(this)">
                                    <i class="fa-regular fa-message post--action-icon"></i>
                                    <span class="post--action-text ms-2">Bình luận (<span id="commentCounter">${post.commentSet.length}</span>)</span>
                                </div>
                            </div>
                        </div>

                        <div class="comment">
                            <div class="d-flex align-items-center my-2">
                                <div class="me-2">
                                    <c:url value="/resources/img/non-avatar.png" var="avatar" />
                                    <a href="#">
                                        <img class="comment--avatar rounded-circle" src="${userAvatar}" alt="">
                                    </a>
                                </div>
                                <form class="w-100" onsubmit="addComment('${post.id}', this)" id="commentForm">
                                    <input name="commentContent" type="text" placeholder="Thêm bình luận" class="add-comment" />
                                </form>
                            </div>
                            <div id="commentedComment">
                                ${(userComment).map((comment, index) => {
                                        return `
                                          <div class="d-flex comment--item py-2">
                                              <div class="me-2">
                                                  <a href="#">
                                                      <img class="comment--avatar rounded-circle" src="${comment.userId.avatar}" alt="avatar">
                                                  </a>
                                              </div>
                                              <div>
                                                  <div class="bg-light comment--item-content">
                                                      <div class="d-flex justify-content-between">
                                                          <h6 class="mb-1 me-2"><a href="#">${comment.userId.lastname} ${comment.userId.firstname}</a></h6>
                                                          <small>${moment(comment.commentDate).fromNow()}</small>
                                                      </div>
                                                      <p class="small mb-0">
                                                          ${comment.content}
                                                      </p>
                                                  </div>
                                                  <div class="d-flex justify-content-end me-2 comment-delete">
                                                        Xóa
                                                    </div>
                                              </div>
                                          </div>`;
                                }).join('')}
                                
                                ${(othersComment).map((comment, index) => {
                                     return `
                                          <div class="d-flex comment--item py-2">
                                              <div class="me-2">
                                                  <a href="#">
                                                      <img class="comment--avatar rounded-circle" src="${comment.userId.avatar}" alt="avatar">
                                                  </a>
                                              </div>
                                              <div>
                                                  <div class="bg-light comment--item-content">
                                                      <div class="d-flex justify-content-between">
                                                          <h6 class="mb-1 me-2"><a href="#">${comment.userId.lastname} ${comment.userId.firstname}</a></h6>
                                                          <small>${moment(comment.commentDate).fromNow()}</small>
                                                      </div>
                                                      <p class="small mb-0">
                                                          ${comment.content}
                                                      </p>
                                                  </div>
                                              </div>
                                          </div>`;
                                }).join('')}
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>
            `;

        $('#feeds-container').append(html);
        customHashtag(`.post-${post.id}`);
    });
};
