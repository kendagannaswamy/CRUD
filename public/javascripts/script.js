// JavaScript Document

//call this function when click on remove link  
function removeData(val) {
    var parent = val.parentNode.parentNode;
    var id = parent.id;

    $.ajax({
        url: "/" + id,
        type: "GET",
    });

}

//call this function when click on edit link  
function editData(val) {
    var parent = val.parentNode.parentNode;
    var id = parent.id;

    $(document).ready(function(e) {
        $('.addT').css("display", "none");
        $('.updateT').css("display", "block");

        var name = $("tr#" + id + " td.name").text();
        var qty = $("tr#" + id + " td.qty").text();

        $('#txtnm1').val(name);
        $('#txtqty1').val(qty);
        $('#hide').val(id);
    });

}

$(document).ready(function(e) {

    var socket = io.connect(); // socket connection 
    socket.on('item', function(data) {
        var items = data.msg;

        var i = 0;
        // append item into table
        $(".container").append("<tr id='" + items[i]._id + "'><td class='name'>" + items[i].name + "</td> <td class='qty'>" + items[i].qty + "</td><td><a href='#' onclick='removeData(this)' data=" + items[i]._id + " class='btn btn-sm btn-danger'>Delete item</a></td><td><a i=" + i + " data=" + items[i]._id + " href='#' onclick='editData(this)'>Edit</a></td></tr>");


    });

    // get updated item data from socket
    socket.on('update', function(data) {
        var item = data.item;
        var id = item[0]._id;

        // change item details from table
        $("tr#" + id + " td.name").text(item[0].name);
        $("tr#" + id + " td.qty").text(item[0].qty);

 

    });

    // get id from socket	
    socket.on('id', function(data) {
        var id = data.id;
        $("tr#" + id).remove(); // remove table row for this item id 

      
    });

    var letters = /^[A-Za-z]+$/;
    var numbers = /^[0-9]+$/;

    //call this function when click on add button 
    $('#add').click(function(e) {
        var formData = $('#form').serializeArray(); // retrieve submited data from form.

        var name = formData[0]['value'],
            qty = formData[1]['value'];

        $.post('/add', formData, function(data) {
            if (data) {
                $('#txtnm').val("");
                $('#txtqty').val("");
            } else {
                // show alert box if respose is false
                if (name.match(letters) && name.length <= 15) {} else {
                    alert("Please Enter shopping item in Alphabet only...");
                }

                if (qty.match(numbers) && qty.length <= 3) {} else {
                    alert("Please Enter Quantity in Number only...");
                }
            }
        });
    });

    //call this function when click on update button 
    $('#update').click(function(e) {
        var id = $('#hide').attr("value");
        $('.addT').css("display", "block");
        $('.updateT').css("display", "none");
        var formData = $('#form2').serializeArray(); // retrieve submited data from form.

        var name = formData[0]['value'],
            qty = formData[1]['value'];

        $.post("/edit/" + id, formData, function(data) {
            if (data) {} else {
                // show alert box if respose is false
                if (name.match(letters) && name.length <= 15) {} else {
                    alert("Please enter name in alphabet only...");
                }

                if (qty.match(numbers) && qty.length <= 3) {} else {
                    alert("Please enter quantity in number only...");
                }
            }
        });

    });

    //call this function when click on cancel button 
    $('#cancel').click(function(e) {
        $('.addT').css("display", "block");
        $('.updateT').css("display", "none");
    });

});
