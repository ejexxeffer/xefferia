// $(document).ready( function () {
//     $('#wrapper').height($(document).height());
    // I only have one form on the page but you can be more specific if need be.
    // var $form = $('form');

    // if ( $form.length > 0 ) {
    //     $('form input[type="submit"]').bind('click', function ( event ) {
    //         if ( event ) event.preventDefault();
    //         // validate_input() is a validation function I wrote, you'll have to substitute this with your own.
    //         if ( $form.validate() ) { register($form); }
    //     });
    // }
});

// function register($form) {
//     $.ajax({
//         type: $form.attr('method'),
//         url: $form.attr('action'),
//         data: $form.serialize(),
//         cache       : false,
//         dataType    : 'json',
//         contentType: "application/json; charset=utf-8",
//         error       : function(err) { alert("Could not connect to the registration server. Please try again later."); },
//         success     : function(data) {
//             if (data.result != "success") {
//                 appendResult('Wrong Email Or You Are Already Registered, Try Again', 'error', 'exclamation');
//             } else {
//                 // It worked, carry on...
//                 appendResult('Successful, Check Your Email For Confirmation ', 'success', 'check');
//             }
//         }
//     });
// }