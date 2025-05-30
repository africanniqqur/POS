let script = function(){
    //Store here list of order items
    this.orderItems = {};

    //store here total order amount
    this.totalOrderAmount = 0.00;

    //store change
    this.userChange = -1;

    //tendered amount
    this.tenderedAmt = 0;


    this.products = products;
    this.showClock = function(){
        let dateObj = new Date;
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
        let year = dateObj.getFullYear();
        let monthNum = dateObj.getMonth();
        let dateCal = dateObj.getDate();
        let hour = dateObj.getHours();
        let min = dateObj.getMinutes();
        let sec = dateObj.getSeconds();
    
        let timeFormatted = loadScript.toTwelveHourFormat(hour);
    
        document.querySelector('.timeAndDate').innerHTML = 
            months[monthNum] + ' ' + dateCal + ', ' + year + ' ' + timeFormatted['time'] + ':' + min + ':' + sec + '' + timeFormatted['am_pm'];
    
            //set intervel to show seconds
            setInterval(loadScript.showClock, 1000);
    },
    
    this.toTwelveHourFormat = function(time){
        let am_pm = 'AM'
        if(time > 12) {
            time = time - 12;
            am_pm = 'PM'
        }
    
        return {
            time: time,
            am_pm: am_pm
        };
    }

    this.registerEvents = function(){
        //click
        document.addEventListener('click', function(e) {
            let targetEl = e.target;
            let targetElClassList = targetEl.classList;

            let addToOrderClasses = ['productImage', 'productName', 'productPrice'];

            if(targetElClassList.contains('productImage') ||
                targetElClassList.contains('productName') ||
                targetElClassList.contains('productPrice') ||
                targetElClassList.contains('searchResultEntry')
            ){

                    let productContainer = targetElClassList.contains('searchResultEntry') ?
                        targetEl : targetEl.closest('div.productColContainer');
                    let pid = productContainer.dataset.pid;
                    let productInfo = loadScript.products[pid];

                    //check for stock
                    let curStock = productInfo['stock'];
                    if(curStock === 0){
                        loadScript.dialogError('Product selected is out of stock');
                        return a;
                    }

                    let dialogForm = '\
                        <h6 class="dialogProductName">'+ productInfo['name'] +' <span class="floatRight">Ksh. '+ productInfo['price'] +'</span></h6>\
                        <input type="number" id="orderQty" class="form-control" placeholder="Enter quantity..." min="1" />\
                    ';

                    BootstrapDialog.confirm({
                        title: 'Add To Order',
                        type: BootstrapDialog.TYPE_DEFAULT,
                        message: dialogForm,
                        callback: function(addOrder){
                            if(addOrder){
                                let orderQty = parseInt(document.getElementById('orderQty').value);

                                //If the user did not input quantity
                                if(isNaN(orderQty)) {
                                    loadScript.dialogError('Please type order quantity.');
                                    //prevent dialog closing
                                    return a;

                                }

                                //if quantity is greater than th current stock
                                if(orderQty > curStock ) {
                                    loadScript.dialogError('Quantity is higher than current stock. <strong>('+ curStock + ')</strong>');

                                    //prevent dialog closing
                                    return a;

                                }

                                loadScript.addToOrder(productInfo, pid, orderQty);

                            }
                        }
                    });

                    

                }

                //delete order item
                if(targetElClassList.contains('deleteOrderItem')){
                    let pid = targetEl.dataset.id;
                    let productInfo = loadScript.orderItems[pid];

                    BootstrapDialog.confirm({
                        type: BootstrapDialog.TYPE_DANGER,
                        title: '<strong>Delete Order Item</strong>',
                        message: 'Are you sure to delete <strong>' + productInfo['name'] +'</strong>',
                        callback: function(toDelete){
                            if(toDelete){
                                //get qty ordered
                                let orderedQuantity = productInfo['orderQty'];
                                loadScript.products[pid]['stock'] += orderedQuantity;

                                //delete items fro order item
                                delete loadScript.orderItems[pid];

                                //refresh table
                                loadScript.updateOrderItemTable();

                            }
                        }
                    })

                    
                }
                                    //decreasing qty
                if(targetElClassList.contains('quantityUpdateBtn_minus')){
                    let pid = targetEl.dataset.id;

                    //update product list - add 1,
                    loadScript.products[pid]['stock'] ++;
                    //update orderItem - orderQty - minus 1
                    loadScript.orderItems[pid]['orderQty']--;

                    //update amount
                    loadScript.orderItems[pid]['amount'] = loadScript.orderItems[pid]['orderQty'] * loadScript.orderItems[pid]['price'];

                    //less than 1 delete from table
                    if(loadScript.orderItems[pid]['orderQty'] === 0) delete loadScript.orderItems[pid];

                    //refresh table or delete row
                    loadScript.updateOrderItemTable();
                }

                                //increasing qty
                if(targetElClassList.contains('quantityUpdateBtn_plus')){
                    let pid = targetEl.dataset.id;

                    //check if stock is empty
                    //show alert
                    if(loadScript.products[pid]['stock'] === 0) loadScript.dialogError('Product is out of stock.');
                    else{
                        //update product list - add 1,
                        loadScript.products[pid]['stock'] --;
                        //update orderItem - orderQty - minus 1
                        loadScript.orderItems[pid]['orderQty']++;
    
                        //update amount
                        loadScript.orderItems[pid]['amount'] = loadScript.orderItems[pid]['orderQty'] * loadScript.orderItems[pid]['price'];
    
    
                        //refresh table or delete row
                        loadScript.updateOrderItemTable();

                    }
                }

                //checkout
                if(targetElClassList.contains('checkoutBtn')){
                    if(Object.keys(loadScript.orderItems).length){

                        let orderItemsHTML = '';
                        let counter = 1;
                        let totalAmt = 0.00;
                        for (const [pid, orderItem] of Object.entries(loadScript.orderItems)){
                            orderItemsHTML += '\
                                <div class="row checkoutTblContentContainer">\
                                    <div class="col-md-2 checkoutTblContent">'+ counter +'</div>\
                                    <div class="col-md-4 checkoutTblContent">'+ orderItem['name'] +'</div>\
                                    <div class="col-md-3 checkoutTblContent">'+ loadScript.addCommas(orderItem['orderQty'])  +'</div>\
                                    <div class="col-md-3 checkoutTblContent">Ksh. '+ loadScript.addCommas(orderItem['amount'].toFixed(2)) +'</div>\
                                </div>';
                            totalAmt += orderItem['amount'];
                            counter++;
                        }

                        let content = '\
                            <div class="row">\
                                <div class="col-md-7">\
                                    <p class="checkoutTblHeaderContainer_title">Items</p>\
                                    <div class="row checkoutTblHeaderContainer">\
                                        <div class="col-md-2 checkoutTblHeader">#</div>\
                                        <div class="col-md-4 checkoutTblHeader">Product</div>\
                                        <div class="col-md-3 checkoutTblHeader">Ordered</div>\
                                        <div class="col-md-3 checkoutTblHeader">Amount</div>\
                                    </div>'+ orderItemsHTML +'\
                                </div>\
                                <div class="col-md-5">\
                                    <div class="checkoutTotalAmountContainer">\
                                    <span class="checkout_amt">Ksh '+ loadScript.addCommas(totalAmt.toFixed(2)) +'</span> <br/>\
                                    <span class="checkout_amt_title"> TOTAL AMOUNT</span>\
                                    </div>\
                                <br/>\
                                    <div class="checkoutUserAmt">\
                                        <input class="form-control" id="userAmt" type="text" placeholder="Enter Amount." />\
                                    </div>\
                                    <div class="checkoutUserChangeContainer">\
                                        <p class="checkoutUserChange"><small>CHANGE: </small><span class="changeAmt">Ksh. 0.00</span></p>\
                                    </div>\
                                    <br/>\
                                    <div class="checkoutCustomer">\
                                        <h4>Customer Details</h4>\
                                        <div class="form-group">\
                                            <label for="fName">First Name</label>\
                                            <input type="text" id="fName" placeholder="Enter first name..." class="form-control" />\
                                        </div>\
                                        <div class="form-group">\
                                            <label for="lName">Last Name</label>\
                                            <input type="text" id="lName" placeholder="Enter last name..." class="form-control" />\
                                        </div>\
                                        <div class="form-group">\
                                            <label for="address">Address</label>\
                                            <input type="text" id="address" placeholder="Enter address..." class="form-control" />\
                                        </div>\
                                        <div class="form-group">\
                                            <label for="contact">Contact</label>\
                                            <input type="text" id="contact" placeholder="Enter contact..." class="form-control" />\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>';

                        BootstrapDialog.confirm({
                            type: BootstrapDialog.TYPE_INFO,
                            title: '<strong>CHECKOUT</strong>',
                            cssClass: 'checkoutDialog',
                            message: content,
                            btnOKLabel: 'Checkout',
                            callback: function(checkout){
                                if(checkout){
                                    //check if change is less than 0
                                    if(loadScript.userChange < 0){
                                        loadScript.dialogError('Please input correct amount.');
                                        return a;
                                    } else {
                                        //save to database
                                        $.post('product.php?action=checkout', {
                                            data: loadScript.orderItems,
                                            totalAmt: loadScript.totalOrderAmount,
                                            change: loadScript.userChange,
                                            tenderedAmt: loadScript.tenderedAmt,
                                            customer: {
                                                firstName: document.getElementById('fName').value,
                                                lastName: document.getElementById('lName').value,
                                                contact: document.getElementById('contact').value,
                                                address: document.getElementById('address').value
                                            }
                                        }, function(response){
                                            let type = response.success ? BootstrapDialog.TYPE_SUCCESS : BootstrapDialog.TYPE_DANGER;

                                            BootstrapDialog.alert({
                                                type: type,
                                                title: response.success ? 'Success' : 'Error',
                                                message: response.message,
                                                callback: function(isOk){
                                                    if(response.success == true){
                                                        loadScript.resetData(response);
                                                        window.open('/POS/receipt.php?receipt_id=' + response.id, '_blank');
                                                    }
                                                }
                                            })

                                        }, 'json');
                                    }
                                }
                            }
                        });
                    }
                }

        });

        document.addEventListener('keyup', function(e){
            let targetEl = e.target;
            let targetElClassList = targetEl.classList;

            if(targetEl.id === 'userAmt'){
                let userAmt = targetEl.value == '' ? 0 : parseFloat(targetEl.value);
                loadScript.tenderedAmt = userAmt;
                let change = userAmt - loadScript.totalOrderAmount;
                loadScript.userChange = change;

                document.querySelector('.checkoutUserChange .changeAmt')
                    .innerHTML = loadScript.addCommas(change.toFixed(2));
                let el = document.querySelector('.checkoutUserChange');
                if(change < 0) el.classList.add('text-danger');
                else el.classList.remove('text-danger');
                
            }
        })
    }

    this.resetData = function(response){
        //Update products variable
        let productsJson = response.products;
        loadScript.products = {};

        
            //loop through products
            productsJson.forEach((product) => {
                loadScript.products[product.id] = {
                    name: product.product_name,
                    stock: product.stock,
                    price: product.price
                }
            });

            //Store here list of order items
            loadScript.orderItems = {};

            //store here total order amount
            loadScript.totalOrderAmount = 0.00;

            //store change
            loadScript.userChange = -1;

            //tendered amount
            loadScript.tenderedAmt = 0;

            //reset table
            loadScript.updateOrderItemTable();

    }

    this.updateOrderItemTable = function(){
        //resetting addition items amount to zero
        loadScript.totalOrderAmount = 0.00;
        
        //Add to order list table
        let ordersContainer = document.querySelector('.pos_items');
        let html = '<p class="itemNoData">No Data</p>';

        //check if order items variable is empty or not
        if(Object.keys(loadScript.orderItems)){
            let tableHtml = `
                <table class="table" id="pos_items_tbl">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>PRODUCT</th>
                            <th>PRICE</th>
                            <th>QTY</th>
                            <th>AMOUNT</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>__ROWS__</tbody>
                </table>`;

                //loop orderitems and store in rows.
                let rows = '';
                let rowNum = 1;
                
                for (const [pid, orderItem] of Object.entries(loadScript.orderItems)) {
                    rows += `
                        <tr>
                            <td>${rowNum}</td>
                            <td>${orderItem['name']}</td>
                            <td>Ksh. ${loadScript.addCommas(orderItem['price']) }</td>
                            <td>${loadScript.addCommas(orderItem['orderQty']) }
                                <a href="javascript:void(0);" data-id="${pid}"  class="quantityUpdateBtn quantityUpdateBtn_plus">
                                <i class='bx bx-plus bx-flashing quantityUpdateBtn quantityUpdateBtn_plus' data-id="${pid}"></i>
                                </a>
                                <a href="javascript:void(0);"  data-id="${pid}" class="quantityUpdateBtn quantityUpdateBtn_minus">
                                <i class='bx bx-minus bx-flashing quantityUpdateBtn quantityUpdateBtn_minus' data-id="${pid}" ></i>
                                </a>
                            </td>

                            <td>Ksh. ${loadScript.addCommas(orderItem['amount'].toFixed(2)) }</td>
                            <td>
                                <a href="javascript:void(0);"><i class='bx bx-edit'></i></a>
                                <a href="javascript:void(0);" class="deleteOrderItem" data-id="${pid}">
                                    <i class='bx bxs-trash-alt deleteOrderItem' data-id="${pid}"></i>
                                </a>
                            </td>
                        </tr>
                    `;
                    rowNum++;

                    loadScript.totalOrderAmount += orderItem['amount'];
                }
                
                html = tableHtml.replace('__ROWS__', rows);                

        }
            ordersContainer.innerHTML = html;

            loadScript.updateTotalOrderAmount();
    }

    this.updateTotalOrderAmount = function(){
        //update total Amount
        document.querySelector('.item_total--value').innerHTML = 'Ksh. ' + loadScript.addCommas(loadScript.totalOrderAmount.toFixed(2));
    }

    //format number
    this.formatNum = function(num){
        if( isNaN(num) || num === undefined) num = 0.00;
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    //Add comma
    this.addCommas = function(nStr){
        nStr += '';
        var x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? '.' + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
        }
        return x1 + x2;
    }

    this.addToOrder = function(productInfo, pid,  orderQty){
        //check current orders
        let curItemIds = Object.keys(loadScript.orderItems);
            let totalAmount = productInfo['price'] * orderQty;
        
        if(curItemIds.indexOf(pid) > -1){
            //if added just update
            loadScript.orderItems[pid]['amount'] += totalAmount;
            loadScript.orderItems[pid]['orderQty'] += orderQty;
            
        } else {
            loadScript.orderItems[pid] = {
                name: productInfo['name'],
                price: productInfo['price'],
                orderQty: orderQty,
                amount: totalAmount
            };

        }
            //update quantity to the productInfo
        loadScript.products[pid]['stock'] -= orderQty;

        this.updateOrderItemTable();
            

    }

    this.dialogError = function(message){
        BootstrapDialog.alert({
            title: '<strong>ERROR</strong>',
            type: BootstrapDialog.TYPE_DANGER,
            message: message
        });
    }

    this.initialize = function(){
        this.showClock();

        
        //register all app events
        this.registerEvents();

    }

    

};

let loadScript = new script;
loadScript.initialize();





