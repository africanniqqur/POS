<?php

    include('dashboard-bckend.php');
    $widget_data = getSaleWidgetData();
    $recent_orders = getRecentOrders();

    //by default
    $end = date('Y-m-d');
    $start = date('Y-m-d', strtotime($end . '-7 days'));
    $graph_data = getChartData($start, $end);
?>


<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard - POS</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <script src="https://unpkg.com/boxicons@2.1.4/dist/boxicons.js"></script>
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
        <!-- Custom styles -->
         <link rel="stylesheet" href="style.css?v=<?= time() ?>">

    </head>
    <body>
        <div class="container-fluid">
            <div class="row widgetMainRow">
                <div class="col-4">
                    <div class="widgetContainer widgetSale">
                        <p class="widgetValue"> Ksh. <?= number_format($widget_data['sale_amt'],2) ?> </p>
                        <p class="widgetHeader"> Sale Amount </p>
                    </div>
                </div>
                <div class="col-4">
                    <div class="widgetContainer widgetQtySold">
                        <p class="widgetValue"> Ksh. <?= number_format($widget_data['qty']) ?></p>
                        <p class="widgetHeader"> Quantity Sold </p>
                    </div>
                </div>
                <div class="col-4">
                    <div class="widgetContainer widgetOrder">
                        <p class="widgetValue"> <?= number_format($widget_data['orders']) ?> </p>
                        <p class="widgetHeader"> TOTAL ORDERS </p>
                    </div>
                </div>
            </div>
            <div class="row widgetMainRow ">
                <div class="col-md-5 widgetFirst">
                    <p class="header">last 5 orders</p>
                    <?php if(count($recent_orders)){  ?>
                            
                    <table class="table">
                        <tr>
                            <th>Order #</th>
                            <th>Total Amount</th>
                            <th>Date</th>
                        </tr>

                    <?php
                        foreach($recent_orders as $order) {   
                    ?>
                        
                        <tr>
                            <td><?= $order['id'] ?></td>
                            <td>Ksh. <?= number_format($order['total_amount'], 2) ?></td>
                            <td> <?= date('F d/y h:i:s A', strtotime($order['date_created'])) ?></td>
                        </tr>

                    <?php }  ?>
                    </table> 
                    <?php } else { ?>
                        <p class="nodatafound_small">No data.</p>
                    <?php } ?>
                </div>
                <div class="col-md-7 widgetFirst">  
                    <p class="header">Daily Sales</p> 
                    <div class="alignRight" >
                        <button class="btn btn-sm btn-default" id="daterange"> Select Range </button>
                    </div>              
                    <figure class="highcharts-figure">
                        <div id="container"></div>
                    </figure>
                </div>
            </div>
        </div>
        <script src="https://code.highcharts.com/highcharts.js"></script>
        <script src="https://code.highcharts.com/modules/series-label.js"></script>
        <script src="https://code.highcharts.com/modules/exporting.js"></script>
        <script src="https://code.highcharts.com/modules/export-data.js"></script>
        <script src="https://code.highcharts.com/modules/accessibility.js"></script>

        

      
        <script src="js/jquery/jquery-3.7.1.min.js"></script>
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

        <!-- Optional theme -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

        <!-- Latest compiled and minified JavaScript -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap3-dialog/1.35.4/js/bootstrap-dialog.js" integrity="sha512-AZ+KX5NScHcQKWBfRXlCtb+ckjKYLO1i10faHLPXtGacz34rhXU8KM4t77XXG/Oy9961AeLqB/5o0KTJfy2WiA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

        
        <script type="text/javascript" src="https://cdn.jsdelivr.net/momentjs/latest/moment.min.js"></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.min.js"></script>
        <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/daterangepicker/daterangepicker.css" />
        <script>
            function toDateRange(){
                $('#daterange').daterangepicker({
                    maxDate: moment(),
                },function(start, end, label) {
                    let startF = start.format('YYYY-MM-DD');
                    let endF = end.format('YYYY-MM-DD');

                    $('#daterange').html(moment(start).format('LL') + ' - ' + moment(end).format('LL'));

                    $.get('dashboard-bckend.php?action=getGraphData&start='+startF+'&end='+endF,function (response) {
                        visualize(response);
                    }, 'JSON');
                });
            }
                
            function visualize(graphData){


                Highcharts.chart('container', {
                    chart: {
                        type: 'spline'
                    },
                    title: {
                        text: 'Sales'
                    },
                    xAxis: {
                        categories: graphData['categories'],
                        labels: {
                            style: {
                                fontSize: '14px'
                            }
                        },
                        accessibility: {
                            description: 'Months of the year'

                        }
                    },
                    yAxis: {
                        title: {
                            text: 'Sales Amount'
                        },
                        labels: {
                            format: 'Ksh. {value}',
                            style: {
                                fontSize: '13px'
                            }

                        }
                    },
                    tooltip: {
                        crosshairs: true,
                        shared: true,
                        headerFormat: '<span style="font-size: 16px">{point.key}</span><br/>'
                    },
                    plotOptions: {
                        spline: {
                            marker: {
                                radius: 4,
                                lineColor: '#666666',
                                lineWidth: 1
                            }
                        }
                    },
                    series: [{
                        name: 'Daily Sales',
                        marker: {
                            symbol: 'square'
                        },
                        data: graphData['series']
                    }]
                });


            }
        
        //call garph
        visualize(<?= $graph_data ?>);

        //call date 
        toDateRange();
    </script>


</body>
</html>