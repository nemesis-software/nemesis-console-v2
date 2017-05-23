<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="sec" uri="http://www.springframework.org/security/tags" %>
<!DOCTYPE HTML>
<html>
<head>
    <title>Backend Console | Nemesis</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="resources/styles.css" type="text/css">
</head>
<body>
    <div class="app-container"></div>
</body>
<div id="website-base-url" style="display:none" url="${websiteBaseUrl}"></div>
<div id="rest-base-url" style="display:none" url="${restBaseUrl}" locale="${currentLocale}"></div>
<div id="contextPath" style="display:none"
     ctxPath="${pageContext.request.contextPath}">${pageContext.request.contextPath}</div>
<div id="security" style="display:none" token="${_csrf.token}"></div>

<div id="token" style="display:none" value="<sec:authentication property='principal.token' htmlEscape="false" />"></div>
<div id="expiryTime" style="display:none" value="<sec:authentication property='principal.expiryTime' />"></div>
<div id="authorities" style="display:none" value="<sec:authentication property='principal.authorities' />"></div>
<script src="resources/bundle.js"></script>
</html>
