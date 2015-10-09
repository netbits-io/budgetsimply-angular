<!DOCTYPE html>
<html lang="en">
    <head>
        <title>budgetSimply.io</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
        <link rel="stylesheet" href="css/style.css">

        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
        <script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>

    </head>
    <body>
        <div class="white wrapper">
        <nav class="navbar navbar-inverse navbar-static-top navbar-top-custom">
            <div class="container">
                <div class="navbar-header">
                    <a class="navbar-brand" href="#">budgetSimply.io</a>
                </div>
                <div>

                </div>
            </div>
        </nav>     
            <div class="container ">

                <div class="row">
                    <div class="col-lg-6">
                        <div style="margin-top:50px;" class="mainbox">
                            <h1>Know your money. Spend less.</h1>
                            <h3>budgetSimply.io is a minimalist expenses tracking and budgeting tool.</h3>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div id="loginbox" style="margin-top:50px;" class="mainbox col-md-10 col-md-offset-1">                    
                            <div class="panel panel-info" >
                                <div style="padding-top:30px" class="panel-body" >
                                    <div style="display:none" id="login-alert" class="alert alert-danger col-sm-12"></div>
                                    <form id="loginform" class="form-horizontal" role="form">
                                        <div style="margin-bottom: 25px" class="input-group">
                                            <span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>
                                            <input id="login-username" type="text" class="form-control" name="username" value="" placeholder="username or email">                                        
                                        </div>
                                        <div style="margin-bottom: 5px" class="input-group">
                                            <span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>
                                            <input id="login-password" type="password" class="form-control" name="password" placeholder="password">
                                        </div>
                                        <div style="margin-bottom: 10px; margin-left: 10px" class="input-group">
                                            <div class="checkbox">
                                                <label>
                                                    <input id="login-remember" type="checkbox" name="remember" value="1"> Remember me
                                                </label>
                                            </div>
                                        </div>
                                        <div style="margin-top:10px" class="form-group">
                                            <!-- Button -->

                                            <div class="col-sm-12 controls">                                          
                                                <a id="btn-login" class="pull-right btn btn-success" href="#">Login</a>                                           
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <div class="col-md-12 control">
                                                <div style="border-top: 1px solid#888; padding-top:15px; font-size:85%" >
                                                    Don't have an account! 
                                                    <a href="#" onClick="$('#loginbox').hide();
                                                            $('#signupbox').show()">
                                                        Sign Up Here
                                                    </a>
                                                </div>
                                            </div>
                                        </div>    
                                    </form>     
                                </div>                     
                            </div>  
                        </div>
                        <div id="signupbox" style="display:none; margin-top:50px" class="mainbox col-md-10 col-md-offset-1 ">
                            <div class="panel panel-info">                          
                                <div class="panel-body" >
                                    <form id="signupform" class="form-horizontal" role="form">

                                        <div id="signupalert" style="display:none" class="alert alert-danger">
                                            <p>Error:</p>
                                            <span></span>
                                        </div>
                                        <div class="form-group">
                                            <label for="email" class="col-md-3 control-label">Email</label>
                                            <div class="col-md-9">
                                                <input type="text" class="form-control" name="email" placeholder="Email Address">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="firstname" class="col-md-3 control-label">First Name</label>
                                            <div class="col-md-9">
                                                <input type="text" class="form-control" name="firstname" placeholder="First Name">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="lastname" class="col-md-3 control-label">Last Name</label>
                                            <div class="col-md-9">
                                                <input type="text" class="form-control" name="lastname" placeholder="Last Name">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="password" class="col-md-3 control-label">Password</label>
                                            <div class="col-md-9">
                                                <input type="password" class="form-control" name="passwd" placeholder="Password">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label for="icode" class="col-md-3 control-label">Invitation Code</label>
                                            <div class="col-md-9">
                                                <input type="text" class="form-control" name="icode" placeholder="">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <!-- Button -->                                        
                                            <div class="col-md-offset-3 col-md-9">
                                                <a class="btn btn-warning" id="signinlink" href="#" onclick="$('#signupbox').hide();
                                                        $('#loginbox').show()">Go Back</a>

                                                <button id="btn-signup" type="button" class="btn btn-success pull-right"><i class="icon-hand-right"></i>Sign Up</button>                                          
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
            <div class="push"></div>
        </div>
        <div class="navbar navbar-inverse navbar-static-bottom">
            <div class="container text-center">
                <div class="row">
                    <p class="navbar-text col-md-12 col-sm-12 col-xs-12">
                        <a href="#" class="brand">Home</a> |  
                        <a href="#" class="brand">User Manual</a> | 
                        <a href="#" class="brand">Terms of Service</a> | 
                        <a href="#" class="brand">Privacy Policy</a> | 
                        <a href="#" class="brand">About Us</a>
                        <span class="pull-right"><a href="http://www.netbits.io/">© 2015 netbits.io team</a></span>
                    </p>
                </div>
            </div>
        </div>
    </body>
</html>