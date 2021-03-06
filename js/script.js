var selupload_prbar = jQuery('#selupload_progressBar');
var selupload_synchtext = jQuery('#selupload_synchtext');
var selupload_message = jQuery('#selupload_message');
var selupload_filelist = jQuery('#selupload_filelist');
var selupload_filelistdiv = jQuery('#selupload_filelistdiv');
var selupload_path_in_storage_code = jQuery('#selupload_path_in_storage_code');
var selupload_path_in_storage = jQuery('#selupload_path_in_storage');
selupload_path_in_storage.keyup(function(){
    var selupload_path_in_storage_value = selupload_path_in_storage.val();
    selupload_path_in_storage_code.empty();
    selupload_path_in_storage_code.text(selupload_path_in_storage_value+selupload_first_file);
});
function selupload_progress(percent, $element) {
    selupload_prbar.show(0);
    var progressBarWidth = percent * $element.width() / 100;
    var complete = '';
    if (percent == 100) {
        complete = "Complete&nbsp;";
    }
    $element.find('div').animate({width: progressBarWidth}, 500).html(percent + "%&nbsp;" + complete);
}
function selupload_nextfile(files, count) {
    var data = {
        files: files,
        count: count,
        action: 'selupload_allsynch'
    };
    jQuery.ajax({
        type: 'POST',
        url: ajaxurl,
        data: data,
        success: function (resp) {
            selupload_progress(resp.progress, selupload_prbar);
            if (resp.error !== '') {
                selupload_synchtext.show(0);
                selupload_synchtext.html(selupload_synchtext.html() + '<p><strong>' + resp.error + '</strong></p>');
            }
            if (resp.files.length !== 0) {
                selupload_nextfile(resp.files, resp.count);
            } else {
                selupload_progress(100, selupload_prbar);
                selupload_prbar.delay(2000).hide(0);
            }
        },
        dataType: 'json',
        async: true
    });
}
function selupload_mansynch(files, count) {
    selupload_synchtext.html('');
    selupload_synchtext.hide(0);
    selupload_prbar.show(0);
    selupload_progress(0, selupload_prbar);
    selupload_nextfile(files, count);
}
function selupload_showfilelist(filelist,dirln){
    selupload_filelistdiv.html('');
    selupload_filelist.show(0);
    var arr = filelist.split('||');
    var index;
    for (index = 0; index < arr.length; ++index) {
        selupload_filelistdiv.html(selupload_filelistdiv.html() + arr[index].substr(dirln) + '<br />');
    }
}
function selupload_testConnet() {
    jQuery('#selupload_spinner').bind("ajaxSend", function () {
        jQuery(this).show()
    });
    var data = {
        login: jQuery("input[name='selupload_username']").val(),
        password: jQuery("input[name='selupload_pass']").val(),
        server: jQuery("input[name='selupload_auth']").val(),
        container: jQuery("input[name='selupload_container']").val(),
        action: 'selupload_testConnet'
    };
    jQuery.ajax({
            type: 'POST',
            url: ajaxurl,
            data: data,
            success: function (response) {
                selupload_message.show(0);
                selupload_message.html('<br />' + response);
                jQuery("html,body").animate({scrollTop: 0}, 1000);
                jQuery("#selupload_spinner").hide();
            },
            dataType: 'html'
        }
    );

    jQuery("#selupload_spinner").unbind("ajaxSend");
}