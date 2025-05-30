<?php
    include('product.php');
    $products = getProducts();
?>


<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>POS - ZMD</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
        <script src="https://unpkg.com/boxicons@2.1.4/dist/boxicons.js"></script>
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
        <!-- Custom styles -->
         <link rel="stylesheet" href="style.css?v=<?= time() ?>">

         <!--BootstrapDialog  -->
         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap3-dialog/1.35.4/css/bootstrap-dialog.min.css" integrity="sha512-PvZCtvQ6xGBLWHcXnyHD67NTP+a+bNrToMsIdX/NUqhw+npjLDhlMZ/PhSHZN4s9NdmuumcxKHQqbHlGVqc8ow==" crossorigin="anonymous" referrerpolicy="no-referrer" />

    </head>
    <body>
        <div class="container-fluid">
            <div class="row">
                <div class="col-8">
                    <div class="searchInputContainer">
                        <input type="text" id="searchInput" placeholder="Search product...">
                        
                        <div id="searchResultContainerMain">
                        </div>
                    </div>
                    <div class="searchResultsContainer">
                        <div class="row">
                            <?php foreach($products as $product){ ?>
                            <div class="col-4 productColContainer" data-pid="<?= $product['id'] ?>">
                                <div class="productResultContainer">
                                    <img src="../ZMD/uploads/products/<?= $product['img'] ?>" class="productImage" alt="">
                                    <div class="productInfoContainer">
                                        <div class="row">
                                            <div class="col-md-8">
                                                <p class="productName"><?= $product['product_name'] ?></p>
                                            </div>
                                            <div class="col-md-4">
                                                <p class="productPrice">Ksh. <?= $product['price'] ?></p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <?php } ?>
                            
                        </div>
                    </div>
                    
                    
                </div>
                <div class="col-4 posOrderContainer">
                    <div class="pos_header">
                        <div class="setting alignRight">
                            <a href="javascript.void(0);"><i class='bx bxs-cog'></i></a>
                        </div>
                        <p class="logo">ZMD</p>
                        <p class="timeAndDate">XX XX, XX XX XX</p>
                    </div>
                    <div class="pos_items_container">
                        <div class="pos_items">
                            <p class="itemNoData">No Data</p>

                        </div>
                        <div class="item_total_container">
                            <p class="item_total">
                                <span class="item_total--label">TOTAL</span>
                                <span class="item_total--value">Ksh. 0.00</span>
                            </p>
                        </div>
                    </div>
                    <div class="checkoutBtnContainer">
                        <a href="javascript:void(0);" class="checkoutBtn"> CHECKOUT </a>
                    </div>
                </div>
            </div>
        </div>


        <script>
            let productsJson = <?= json_encode($products) ?>;
            var products = {};
            
            //loop through products
            productsJson.forEach((product) => {
                products[product.id] = {
                    name: product.product_name,
                    stock: product.stock,
                    price: product.price
                }
            });


            //live-search 

        var typingTimer;               //timer identifier
        var doneTypingInterval = 500; //timer in ms (5 millisec interval)

        document.addEventListener('keyup', function(ev){
            let el = ev.target;

            //if searchInput is the element
            if(el.id === 'searchInput'){
                let searchTerm = el.value;

                //use clearTimeout to stop running setTimeout
                clearTimeout(typingTimer);

                //set timeout
                typingTimer = setTimeout(function () {
                    searchDb(searchTerm);
                    
                }, doneTypingInterval);
            }
        });

        
        function searchDb(searchTerm){
            let searchResult =document.getElementById('searchResultContainerMain');
            if(searchTerm.length){
                searchResult.style.display  = 'block';
                    $.ajax({
                    type: 'GET',
                    data: {search_term: searchTerm},
                    url: 'live-search.php',
                    success: function(response){
                       // let searchResult = document.getElementById('searchResult');
                        if(response.length === 0){
                            searchResult.innerHTML = '<p class="noDatafound">no data found </p>';
                        } else {
                            //loop
                            let html = '';
                            let searchResults = response.data;

                            searchResults.forEach((row) => {
                                html +=`                        
                                    <div class="row searchResultEntry" data-pid=${row['id']}>
                                        <div class="col-3">
                                            <img class="searchResultImg" src="../ZMD/uploads/products/${row['img']}"alt="">
                                        </div>
                                        <div class="col-6">
                                            <p class="searchResultProductName">${row['product_name']}</p>
                                            <p class="searchResultProductPrice">Ksh. ${row['price']}</p>
                                        </div>
                                    </div>`;
                            });
                            searchResult.innerHTML = html
                        }
                        

                    },
                    dataType: 'json'
                })
            } else {
                searchResult.style.display = 'none';
            }


        }
   
        </script>                

        
        <script src="script.js?v=<?= time() ?>"></script>
        <script src="js/jquery/jquery-3.7.1.min.js"></script>
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

        <!-- Optional theme -->
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

        <!-- Latest compiled and minified JavaScript -->
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@3.3.7/dist/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap3-dialog/1.35.4/js/bootstrap-dialog.js" integrity="sha512-AZ+KX5NScHcQKWBfRXlCtb+ckjKYLO1i10faHLPXtGacz34rhXU8KM4t77XXG/Oy9961AeLqB/5o0KTJfy2WiA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
    </body>
</html>