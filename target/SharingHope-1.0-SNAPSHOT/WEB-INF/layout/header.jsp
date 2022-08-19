
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="security" uri="http://www.springframework.org/security/tags" %>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@ page session="true" %>

<header class="navbar-light fixed-top header-static" id="container">
    <nav class="navbar navbar-expand-lg">
        <div class="container">
            <c:url value="/" var="mainUrl" />
            <a class="navbar-brand" href="${mainUrl}">
                <c:url value="/resources/img/logo.png" var="logo" />
                <img class="light-mode-item navbar-brand-item logo-img" src="${logo}" alt="logo">
            </a>

            <button class="navbar-toggler ms-auto icon-md px-2 py-1 collapsed" type="button" 
                    data-bs-toggle="collapse" data-bs-target="#navbarCollapse" 
                    aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-animation">
                    <span></span>
                    <span></span>
                    <span></span>
                </span>
            </button>

            <div class="navbar-collapse collapse" id="navbarCollapse">
                <div class="nav my-3 my-lg-0 flex-nowrap align-items-center px-2 px-lg-0">
                    <div class="nav-item w-100">
                        <form class="form-search position-relative" action="javascript:;" onsubmit="searchSubmit()">
                            <input class="form-control ps-5 bg-light w-100" name="kw" type="search" placeholder="Tìm kiếm" aria-label="Search">
                            <button class="bg-transparent p-2 py-0 position-absolute top-50 start-0 translate-middle-y" style="outline: none; border: none; border-radius: 50%" type="submit">
                                <i class="fa-solid fa-magnifying-glass text-secondary"></i>
                            </button>
                        </form>
                    </div>
                </div>

                <ul class="navbar-nav navbar-nav-scroll ms-auto">
                    <li class="nav-item px-2">
                        <a class="nav-link" href="${mainUrl}" id="homeMenu">
                            <i class="fa-solid fa-house menu-icon"></i>
                            Trang chủ
                        </a>
                    </li>
                    <li class="nav-item px-2">
                        <c:url value="/auction" var="auctionUrl" />
                        <a class="nav-link" href="${auctionUrl}" id="auctionMenu">
                            <i class="fa-solid fa-gavel menu-icon"></i>
                            Đấu giá
                        </a>
                    </li>
                    <li class="d-lg-none d-block nav-item px-2">
                        <a class="nav-link dropdown-toggle" href="#" id="chatMenu" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i class="fa-solid fa-comment menu-icon"></i>
                            Trò chuyện
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end me-3 p-0" id="chatContainerMobile" aria-labelledby="chatMenu">
                            <li>
                                <div class="chat-menu-header">
                                    <h5>Chat</h5>
                                    <a href="#">Chuyển đến Messenger</a>
                                </div>
                            </li>
                            <li class="px-3 my-2">
                                <div class="form-search position-relative">
                                    <input id="search-chat" class="form-control ps-5 bg-light w-100" type="text"
                                           placeholder="Tìm kiếm trên Messenger" aria-label="Search" oninput="searchUserForChat(this)">
                                    <div class="bg-transparent px-2 py-0 position-absolute top-50 start-0 translate-middle-y" 
                                         style="outline: none; border: none; border-radius: 50%">
                                        <i class="fa-solid fa-magnifying-glass text-secondary"></i>
                                    </div>
                                </div>
                            </li>

                            <div class="position-relative" style="min-height: 80vh">
                                <li  class="justify-content-center
                                     align-items-center text-center py-4 search-userchat-loading">
                                    <div class="spinner-border text-muted"></div>
                                </li>
                                <div class="p-2 list-user-search" style="display: none">

                                </div>
                                <div class="p-2 list-user-chat">

                                </div>
                            </div>
                        </ul>
                    </li>

                    <!--Link này dành cho admin đăng nhập mới hiển thị-->
                    <c:if test="${sessionScope.currentUser.getUserRole() == 'ROLE_ADMIN'}">
                        <li class="nav-item px-2">
                            <c:url value="/admin" var="adminUrl" />
                            <a class="nav-link" href="${adminUrl}" id="chartMenu">
                                <i class="fa-solid fa-chart-simple menu-icon"></i>
                                Thống kê & báo cáo
                            </a>
                        </li>
                    </c:if>

                    <li class="d-lg-none d-block nav-item px-2">
                        <a class="nav-link position-relative dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#" id="notifyMenu">
                            <i class="fa-solid fa-bell menu-icon"></i>
                            Thông báo
                            <span class="notif-count" style="top: 2px; left: 6px;"></span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end me-3 p-0 notifContainer" id="notifContainerMobile" aria-labelledby="notifyMenu">
                            <li>
                                <div class="notif-header">
                                    <h5>Thông báo</h5>
                                </div>
                            </li>
                            <li  class="dropdown-item d-flex justify-content-center
                                 align-items-center notif-loading text-center">
                                <div class="spinner-border text-muted loadingNotif" id="loadingNotif"></div>
                            </li>
                            <div class="position-relative" style="min-height: 90vh">
                                <div class="p-2 list-notification">

                                </div>
                            </div>
                        </ul>
                    </li>
                    <li class="d-lg-none d-block nav-item px-2">
                        <a class="nav-link d-flex align-items-center dropdown-toggle" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" href="#" id="userMenu">

                            <c:url value="/resources/img/non-avatar.png" var="avatar" />
                            <img src="${sessionScope.currentUser.getAvatar()}" alt="avatar" class="user-img me-2" />
                            ${sessionScope.currentUser.getFirstname()}
                        </a>

                        <ul class="dropdown-menu dropdown-menu-end drop" aria-labelledby="userMenu">
                            <li>
                                <c:url value="/user/${sessionScope.currentUser.getId()}" var="userInfoUrl" />
                                <a class="dropdown-item d-flex align-items-center" href="${userInfoUrl}">
                                    <i class="fa-solid fa-user me-2"></i>
                                    Trang cá nhân
                                </a>
                            </li>
                            <li>
                                <a class="dropdown-item d-flex align-items-center" href="<c:url value="/logout" />" onclick="FB.logout();">
                                    <i class="fa-solid fa-arrow-right-from-bracket me-2"></i>
                                    Đăng xuất
                                </a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>

            <div class="d-lg-flex d-none flex-nowrap align-items-center ms-3">
                <div class="dropdown">
                    <div class="position-relative" id="userChatList" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fa-brands fa-facebook-messenger notify-icon me-4"></i>
                    </div>
                    <ul class="dropdown-menu dropdown-menu-end me-3 p-0" id="chatContainer" aria-labelledby="cardFeedAction">
                        <li>
                            <div class="chat-menu-header">
                                <h5>Chat</h5>
                                <a href="#">Chuyển đến Messenger</a>
                            </div>
                        </li>
                        <li class="px-3 my-2">
                            <div class="form-search position-relative">
                                <input id="search-chat" class="form-control ps-5 bg-light w-100" type="text"
                                       placeholder="Tìm kiếm trên Messenger" aria-label="Search" oninput="searchUserForChat(this)">
                                <div class="bg-transparent px-2 py-0 position-absolute top-50 start-0 translate-middle-y" 
                                     style="outline: none; border: none; border-radius: 50%">
                                    <i class="fa-solid fa-magnifying-glass text-secondary"></i>
                                </div>
                            </div>
                        </li>

                        <div class="position-relative" style="min-height: 80vh">
                            <li  class="justify-content-center
                                 align-items-center text-center py-4 search-userchat-loading">
                                <div class="spinner-border text-muted"></div>
                            </li>
                            <div class="p-2 list-user-search" style="display: none">

                            </div>
                            <div class="p-2 list-user-chat">

                            </div>
                        </div>
                    </ul>
                </div>

                <div class="dropdown">
                    <a href="#" class="position-relative" id="userNotification" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-bell notify-icon me-4"></i>
                        <span class="notif-count"></span>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end me-3 p-0 notifContainer" id="notifContainer" aria-labelledby="cardFeedAction">
                        <li>
                            <div class="notif-header">
                                <h5>Thông báo</h5>
                            </div>
                        </li>
                        <li  class="dropdown-item d-flex justify-content-center
                             align-items-center notif-loading text-center">
                            <div class="spinner-border text-muted loadingNotif" id="loadingNotif"></div>
                        </li>
                        <div class="position-relative" style="min-height: 45vh">
                            <div class="p-2 list-notification">

                            </div>
                        </div>
                    </ul>
                </div>

                <div class="dropdown">
                    <a href="#" id="userAction" data-bs-toggle="dropdown" aria-expanded="false">
                        <img id="userAvatar" src="${sessionScope.currentUser.getAvatar()}" alt="avatar" class="user-img" />
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="cardFeedAction">
                        <li class="py-2 px-3 d-none" style="white-space: nowrap">
                            <span id="user-id">${sessionScope.currentUser.getId()}</span>
                        </li>
                        <li class="py-2 px-3 w-100" style="white-space: nowrap">
                            <span id="fullname">${sessionScope.currentUser.getLastname()} ${sessionScope.currentUser.getFirstname()}</span>
                        </li>
                        <li class="py-2 px-3 w-100" style="white-space: nowrap">
                            <span id="email">${sessionScope.currentUser.getEmail()}</span>
                        </li>
                        <li>
                            <c:url value="/user/${sessionScope.currentUser.getId()}" var="userInfoUrl" />
                            <a class="dropdown-item d-flex align-items-center" href="${userInfoUrl}">
                                <i class="fa-solid fa-user me-2"></i>
                                Trang cá nhân
                            </a>
                        </li>
                        <li>
                            <a class="dropdown-item d-flex align-items-center" href="<c:url value="/logout" />" onclick="FB.logout();">
                                <i class="fa-solid fa-arrow-right-from-bracket me-2"></i>
                                Đăng xuất
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </nav>
</header>

<script src="<c:url value="/resources/js/notification.js" />"></script>
<script type="module" src="<c:url value="/resources/js/chatFireBase/conversation.js" />"></script>
<script src="<c:url value="/resources/js/chat.js" />"></script>
<script>
                                $(function () {
                                    getNotifs();
                                    currentUserId = '${sessionScope.currentUser.getId()}';
                                });
</script>
<script src="<c:url value="/resources/js/websocket.js"/>"></script>