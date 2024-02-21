$(document).ready(function () {

  $('.homeslider').slick({
    dots: true,
    //  autoplay: true,
    //  autoplaySpeed: 3000,
    fade: true,
  });

  var table = $('#mytable').DataTable();

  $('#addform').on('submit', function (event) {
    event.preventDefault();

    var file = $('#myFileInput')[0].files[0];

    // $ - end of string, i - regular expression matching should be case-insensitive
    var allowedExtensions = /(\.jpg|\.jpeg|\.gif|\.mp4|\.png)$/i;
    const imageExe = ['jpeg', 'png', 'jpg', 'gif'];
    const videoExe = ['mp4'];

    // extensions are checked here
    // The exec method is used to execute a search for a match in a string.
    if (!allowedExtensions.exec(file.name)) {
      alert('Error: Invalid Extension!');
      return true;
    }

    // files with valid extensions will go in this part 
    else {

      // filereader is a built-in js object that provides methods to read the files
      var reader = new FileReader();
      var text1 = $('#slidetitle').val();
      var text2 = $('#slidersummary').val();
      var text3 = $('#slidetag').val();
      var text4 = $('#slidecategory').val();

      // space is not allowed 
      if (text1.trim() === '') {
        alert('Error: Spaces are not allowed.');
        return true;
      }
      if (text2.trim() === '') {
        alert('Error: Spaces are not allowed.');
        return true;
      }

      // for image
      if (imageExe.includes(file.name.split('.').pop())) {
        reader.onload = function (e) {              // event handler of filereader

          var slide = '<div>' +
            '<img src="' + e.target.result + '">' +   // to access the content of the file
            '<div class="text">' +
            '<p id="titleid">' + text1 + '</p>' +
            '<p id="summaryid">' + text2 + '</p>' +
            '<p id="tagid">' + text3 + '</p>' +
            '<p id="categoryid">' + text4 + '</p>' +
            '</div>' +
            '</div>';
          $('.homeslider').slick('slickAdd', slide);  // add the slide in the slider 

          // to empty the input fields after adding the slide everytime
          $('#slidetitle').val('');
          $('#slidersummary').val('');
          $('#slidetag').val('');
          $('#slidecategory').val('');
          $("#myFileInput").val('');

        };
      }

      // for video
      else if (videoExe.includes(file.name.split('.').pop())) {
        reader.onload = function (e) {
          var slide = '<div>' +
            '<video autoplay loop muted src="' + e.target.result + '">' +
            '</video>' +
            '<div class="text">' +
            '<p id="titleid">' + text1 + '</p>' +
            '<p id="summaryid">' + text2 + '</p>' +
            '<p id="tagid">' + text3 + '</p>' +
            '<p id="categoryid">' + text4 + '</p>' +
            '</div>' +
            '</div>';
          $('.homeslider').slick('slickAdd', slide);  // add the slide in the slier

          // to empty the input fields after adding the slide everytime
          $('#slidetitle').val('');
          $('#slidersummary').val('');
          $('#slidetag').val('');
          $('#slidecategory').val('');
          $("#myFileInput").val('');
        };
      }

      reader.readAsDataURL(file);  // method of fileReader,to read the selected file as a data URL

      var ext = file.name.split('.').pop();  // for extension 

      // add the data in the table 

      table.row.add([
        file.name,
        ext,
        text1,
        '<button class="btn btn-info btn-xs btn-edit mb-2" style="margin-right: 5px" data-bs-toggle="modal" data-bs-target="#exampleModalEdit">Edit</button><button class="btn btn-danger btn-xs btn-delete mb-2" style="margin-right: 5px">Delete</button>'
      ]).draw(false);

      // hide the add modal after submit button is clicked successfully 
      $('#exampleModal').modal('hide');
    }
  });

  var $table = $('.table');
  var $slider = $('.homeslider');

  // When the delete button of a row is clicked, remove the corresponding slide from the Slick slider
  $table.on('click', 'button.btn-delete', function () {
    var $row = $(this).closest('tr');
    var index = $row.index();

    // Remove the slide from the Slick slider
    $slider.slick('slickRemove', index);

    // Remove the row from the table
    // $row.remove();
    table.row($row).remove().draw();

  });

  var $row;
  var index;
  var $slide;

  $table.on('click', 'button.btn-edit', function () {
    $row = $(this).closest('tr');
    index = $row.index();
    $slide = $('.homeslider').find('.slick-slide').eq(index);

    // get the data of input fields from the slide
    var existingTitle = $slide.find('#titleid').text();
    var existingSummary = $slide.find('#summaryid').text();
    var existingTag = $slide.find('#tagid').text();
    var existingCategory = $slide.find('#categoryid').text();

    // Populate the edit form fields with the slide data
    $('#edittitle').val(existingTitle);
    $('#editsummary').val(existingSummary);
    $('#edittag').val(existingTag);
    $('#editcategory').val(existingCategory);

    $('#editform').on('submit', function (event) {
      event.preventDefault();

      // edited input fields
      var keeptitle = $('#edittitle').val().trim() || existingTitle;
      var keepsummary = $('#editsummary').val().trim() || existingSummary;
      var keeptag = $('#edittag').val() || existingTag;
      var keepcategory = $('#editcategory').val() || existingCategory;

      // update edited input fields in the slide
      $slide.find('#titleid').text(keeptitle);
      $slide.find('#summaryid').text(keepsummary);
      $slide.find('#tagid').text(keeptag);
      $slide.find('#categoryid').text(keepcategory);

      // When the user try to edit the file, update the corresponding slide and row

      var $editFileInput = $('#editfile');
      var file = $editFileInput[0].files[0];
      if (file) {
        var allowedExtensions = /(\.jpg|\.jpeg|\.gif|\.mp4|\.png)$/i;
        const imageExe = ['jpeg', 'png', 'jpg', 'gif'];
        const videoExe = ['mp4'];
        if (!allowedExtensions.exec(file.name)) {
          alert('Error: Invalid Extension!');
          return true;
        }

        var reader = new FileReader();

        reader.onload = function (e) {
          text1 = $('#edittitle').val();
          text2 = $('#editsummary').val();
          text3 = $('#edittag').val();
          text4 = $('#editcategory').val();

          var slideContent;
          if (imageExe.includes(file.name.split('.').pop())) {
            slideContent = '<div>' +
              '<img src="' + e.target.result + '">' +
              '<div class="text">' +
              '<p id="titleid">' + text1 + '</p>' +
              '<p id="summaryid">' + text2 + '</p>' +
              '<p id="tagid">' + text3 + '</p>' +
              '<p id="categoryid">' + text4 + '</p>' +
              '</div>' +
              '</div>';
          }

          else if (videoExe.includes(file.name.split('.').pop())) {
            slideContent = '<div>' +
              '<video autoplay loop muted src="' + e.target.result + '">' +
              '</video>' +
              '<div class="text">' +
              '<p id="titleid">' + text1 + '</p>' +
              '<p id="summaryid">' + text2 + '</p>' +
              '<p id="tagid">' + text3 + '</p>' +
              '<p id="categoryid">' + text4 + '</p>' +
              '</div>' +
              '</div>';
          }
          if (slideContent) {

            // add the edited slide in the slider 
            $('.homeslider').slick('slickAdd', slideContent, index);

            // remove the existing slide from that index
            $('.homeslider').slick('slickRemove', index);

            // Update the first column of the row with the filename
            $row.find('td').eq(0).text(file.name);

            // Update the second column of the row with the file extension
            $row.find('td').eq(1).text(file.name.split('.').pop());
          }
        };
        reader.readAsDataURL(file);
      }
      // update the title of the slide
      $row.find('td').eq(2).html(keeptitle);

      $('#exampleModalEdit').modal('hide');
      $("#editfile").val('');
    });
  });

  $('.table').DataTable();

});