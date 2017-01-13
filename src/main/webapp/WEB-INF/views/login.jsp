<%@page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" isELIgnored="false" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
"http://www.w3.org/TR/html4/loose.dtd">
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<html>
<head>
    <title>Login Page</title>
    <link rel="shortcut icon" href="resources/img/favicon.ico" type="image/x-icon"/>
    <style type="text/css">
        html {
            min-height: 100%;
        }

        body {
            height: 100%;
            background: #f5f7f9; /* Old browsers */
            background: -moz-linear-gradient(top, #f5f7f9 0%, #d7dee3 0%, #e5ebee 40%, #f6f8f9 100%); /* FF3.6+ */
            background: -webkit-gradient(linear, left top, left bottom, color-stop(0%, #f5f7f9), color-stop(0%, #d7dee3), color-stop(40%, #e5ebee), color-stop(100%, #f6f8f9)); /* Chrome,Safari4+ */
            background: -webkit-linear-gradient(top, #f5f7f9 0%, #d7dee3 0%, #e5ebee 40%, #f6f8f9 100%); /* Chrome10+,Safari5.1+ */
            background: -o-linear-gradient(top, #f5f7f9 0%, #d7dee3 0%, #e5ebee 40%, #f6f8f9 100%); /* Opera 11.10+ */
            background: -ms-linear-gradient(top, #f5f7f9 0%, #d7dee3 0%, #e5ebee 40%, #f6f8f9 100%); /* IE10+ */
            background: linear-gradient(to bottom, #f5f7f9 0%, #d7dee3 0%, #e5ebee 40%, #f6f8f9 100%); /* W3C */
            filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#f5f7f9', endColorstr='#f6f8f9', GradientType=0); /* IE6-9 */
        }

        form {
            opacity: 0.95;
            width: 250px;
            padding: 20px;
            margin: 150px auto;
            position: relative;
            border: 1px solid #000000;
            outline: 1px solid #FFFFFF;
            background: #1E4176;
        }

        form h1 {
            font-size: 20px;
            font-weight: bold;
            color: #FFF;
            padding-bottom: 8px;
            border-bottom: 1px solid #FFF;
            text-align: center;
            text-transform: uppercase;
        }

        label {
            font-size: 11px;
            font-family: tahoma, arial, verdana, sans-serif;
            font-weight: bold;
            line-height: 15px;
            list-style-type: none;
            color: #FFF;
            margin-bottom: 10px;
            letter-spacing: 1px;
            text-transform: uppercase;
            display: block;
        }

        input[type='text'], input[type='password'] {
            width: 95%;
            background: #FFFFFF;
            padding: 6px;
            margin-bottom: 10px;
            border: 1px solid #000;
        }

        input.submit {
            width: 100px;
            padding: 6px;
            margin-bottom: 10px;
            border: 1px solid #000;
            color: #000;
            text-transform: uppercase;
            margin-top: 10px;
            background: #F5F7F9;
            font-family: tahoma, arial, verdana, sans-serif;
            font-size: 11px;
        }

        .error {
            color: #B3171A;
            font-family: arial;
            font-size: 12px;
            font-weight: bold;
            text-align: center;
            background-color: #fff;
            padding: 5px;
            width: 234px;
        }
    </style>
</head>
<body onload="document.getElementById('login_username').focus();">
<form action="<c:url value='/j_spring_security_check'/>" method="POST" onsubmit="keepHash(this)">
    <h1>Login</h1>
    <label for="login_username">Username:</label> <input id="login_username" type="text" name="username"/>
    <label for="login_password">Password:</label> <input id="login_password" type="password" name="password"/>

    <div class="error" style="${not empty param.error ? '' : 'display:none'}">
        <%
            String reason = request.getParameter("error");

            if (reason != null) {
                if (reason.equals("authfailed")) {
                    out.write("Bad credential, try again.");
                } else if (reason.equals("sessionInvalid")) {
                    out.write("Session is invalid, please login again.");
                } else if (reason.equals("sessionExpired")) {
                    out.write("Session had expired, please login again.");
                } else if (reason.equals("denied")) {
                    out.write("Access is denied - not enough user rights.");
                } else {
                    out.write("Internal server problem. Please try again later.");
                }
            }
        %>
    </div>
    <input type="hidden" name="${_csrf.parameterName}" value="${_csrf.token}"/>
    <input type="submit" value="Submit" name="submit" class="submit"/>
</form>

<script type="text/javascript">
    function keepHash(form) {
        var hash = document.location.hash.substring(1);
        form.action = form.action + '#' + hash;
        return true;
    }
</script>
</body>
</html>
