  // Add row
  let row=1;
  $(document).on("click", "#add-row", function () {
  let new_row = '<tr id="row' + row + '"><td><input name="stocks[' + row + '][size]" type="text" placeholder ="S,M,L,XL,XXL ..." class="form-control" /></td><td><input name="stocks[' + row + '][units]" type="text" placeholder ="500" class="form-control" /></td><td><input class="delete-row btn btn-primary" type="button" value="Delete" /></td></tr>';
  $('#test-body').append(new_row);
  row++;
  return false;
  });
  
  // Remove criterion
  $(document).on("click", ".delete-row", function () {
  //  alert("deleting row#"+row);
    if(row>1) {
      $(this).closest('tr').remove();
      row--;
    }
  return false;
  });
