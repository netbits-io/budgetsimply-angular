<!DOCTYPE html>
<html lang="en">
    <head>
        <title>budgetSimply.io</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">



        <link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.9/css/jquery.dataTables.css">
        <link rel="stylesheet" type="text/css" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">
        <link rel="stylesheet" type="text/css" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css">
        <!--<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.4.1/css/bootstrap-datepicker.min.css">-->
        <link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.4.1/css/bootstrap-datepicker3.min.css">
        <link rel="stylesheet" type="text/css" href="css/style.css">


        <script type="text/javascript" charset="utf8" src="//code.jquery.com/jquery-1.10.2.min.js"></script>
        <script type="text/javascript" charset="utf8" src="//code.jquery.com/ui/1.10.2/jquery-ui.min.js"></script>
        <script type="text/javascript" charset="utf8" src="//cdn.datatables.net/1.10.9/js/jquery.dataTables.js"></script>
        <script type="text/javascript" charset="utf8" src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
        <script type="text/javascript" charset="utf8" src="//cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.4.1/js/bootstrap-datepicker.min.js"></script>
        <script type="text/javascript" charset="utf8" src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment.min.js"></script>


        <script>

            $(document).ready(function () {

                $.fn.dataTable.ext.search.push(
                        function (settings, data, dataIndex) {
                            var min = $('#minDate').val();
                            var max = $('#maxDate').val();
                            
                            
                            
                            var minM = moment(min, 'MM/DD/YYYY');
                            var maxM = moment(max, 'MM/DD/YYYY');
                            
                            var date = moment(data[0], "YYYY/MM/DD");
                            
                            
                            
//                            console.log(min);
//                            console.log(minM);
//                            console.log(max);
//                            console.log(maxM);
                            
//                            console.log(settings);
//                            console.log(data);
//                            console.log(dataIndex);
//                            console.log("testt");
                            
                            if(minM <= date && date <=maxM){
                                 return true;
                            }
                            return false;
                           
                        }
                );


                var table = $('#example').DataTable({
                    "sDom": '<"H"r>t<"F"ip>',
                    "bPaginate": true,
                    "bInfo": false,
                    "bAutoWidth": false
                });



                $('#minDate').datepicker({
                    autoclose: true
                }).on("changeDate", function (e) {
                    table.draw();
                    console.log( table.rows( { filter: 'applied' } ).data().toArray() );
                });

                $('#maxDate').datepicker({
                    autoclose: true
                });


            });

        </script>
    </script>
</head>
<body>
    <div class="white wrapper">
        <!--        <nav class="navbar navbar-inverse navbar-static-top navbar-top-custom">
                    <div class="container">
                        <div class="navbar-header">
                            <a class="navbar-brand" href="#">budgetSimply.io</a>
                        </div>
                        <div>
        
                        </div>
                    </div>
                </nav>     -->
        <div class="container ">

            <br>

            <input id="minDate" type="text" readonly="true" value="01/01/2015"/>

            <input id="maxDate" type="text" readonly="true" value="31/12/2015"/>

            <table id="example" class="display table table-striped" cellspacing="0" width="100%">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>Note</th>
                        <th>Category</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>2015/04/24</td>
                        <td>food for home</td>
                        <td>food</td>
                        <td>59</td>
                    </tr>
                    <tr>
                        <td>2015/04/25</td>
                        <td>food for home</td>
                        <td>food</td>
                        <td>59</td>
                    </tr>                    
                    <tr>
                        <td>2015/04/25</td>
                        <td>food for home</td>
                        <td>food</td>
                        <td>59</td>
                    </tr>                  
                    <tr>
                        <td>2015/04/25</td>
                        <td>food for home</td>
                        <td>food</td>
                        <td>59</td>
                    </tr>                
                    <tr>
                        <td>2015/04/25</td>
                        <td>food for home</td>
                        <td>food</td>
                        <td>59</td>
                    </tr>
                    <tr>
                        <td>2015/04/25</td>
                        <td>food for home</td>
                        <td>food</td>
                        <td>59</td>
                    </tr>
                    <tr>
                        <td>2015/04/25</td>
                        <td>food for home</td>
                        <td>food</td>
                        <td>59</td>
                    </tr>
                    <tr>
                        <td>2015/04/25</td>
                        <td>food for home</td>
                        <td>food</td>
                        <td>59</td>
                    </tr>
                    <tr>
                        <td>2015/04/25</td>
                        <td>food for home</td>
                        <td>food</td>
                        <td>59</td>
                    </tr>
                    <tr>
                        <td>2015/04/25</td>
                        <td>food for home</td>
                        <td>food</td>
                        <td>59</td>
                    </tr>
                    <tr>
                        <td>2015/04/25</td>
                        <td>food for home</td>
                        <td>food</td>
                        <td>59</td>
                    </tr>
                    <tr>
                        <td>2015/04/25</td>
                        <td>food for home</td>
                        <td>food</td>
                        <td>59</td>
                    </tr>
                    <tr>
                        <td>2015/04/25</td>
                        <td>food for home</td>
                        <td>food</td>
                        <td>59</td>
                    </tr>
                    <tr>
                        <td>2015/04/25</td>
                        <td>food for home</td>
                        <td>food</td>
                        <td>59</td>
                    </tr>
                    <tr>
                        <td>2015/04/25</td>
                        <td>food for home</td>
                        <td>food</td>
                        <td>59</td>
                    </tr>
                    <tr>
                        <td>2015/04/25</td>
                        <td>food for home</td>
                        <td>food</td>
                        <td>59</td>
                    </tr>
                    <tr>
                        <td>2015/04/25</td>
                        <td>food for home</td>
                        <td>food</td>
                        <td>59</td>
                    </tr>
                    <tr>
                        <td>2015/04/25</td>
                        <td>food for home</td>
                        <td>food</td>
                        <td>59</td>
                    </tr>
                </tbody>
            </table>

        </div>
        <div class="push"></div>
    </div>
    <!--    <div class="navbar navbar-inverse navbar-static-bottom">
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
        </div>-->
</body>
</html>