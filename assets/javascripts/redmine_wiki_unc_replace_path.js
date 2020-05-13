var replaceUncTag = function(){
    var uncToFileProto = function(path_unc){
        return 'file:///' + path_unc.replace(/"/g, '').replace(/\\/g, '/')
    }

    $("span.path_unc").replaceWith(function() {
        return $('<a/>', {
            href: uncToFileProto(this.innerHTML),
            html: this.getAttribute("name"),
            class: 'external'  // ignored
        });
    });
}

$(function () {
    $(document).on('DOMSubtreeModified', 'div.wiki-preview', function() {
        replaceUncTag();
    });

    replaceUncTag();
});
