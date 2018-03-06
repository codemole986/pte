<!DOCTYPE html>
<html lang="en">
<!--<![endif]-->
<!-- BEGIN HEAD -->
<head>
<meta charset="utf-8"/>
</head>
<body>
Hey {{$name}}, Welcome to our website. <br>
Please click <a href="{!! url('/users/verify', ['code'=>$verification_code]) !!}"> Here</a> to confirm email
</body>
</html>