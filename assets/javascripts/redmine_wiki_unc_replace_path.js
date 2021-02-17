var formatUncTag = function(){
    var uncToFileProto = function(path_unc){
        return 'file:///' + path_unc.replace(/"/g, '').replace(/\\/g, '/')
    }

    var enableClipboardJs = function () {
        new ClipboardJS('.path_unc', {
            text: function(trigger) {
                return trigger.getAttribute('data-clipboard-text');
            }
        });
    }

    $('span.path_unc').replaceWith(function() {
        return $('<span/>', {class: 'path_unc_outer'}).append(
            $('<a/>', {
                href: uncToFileProto(this.innerHTML),
                html: this.getAttribute('name'),
                class: 'external',
                target: '_blank'
            })
        ).append(
            $('<a/>', {
                html: '',
                class: 'path_unc icon-only icon icon-copy',
                'data-clipboard-text': this.innerHTML.replace(/"/g, ''),
                style: 'cursor: pointer',
                title: 'パスをコピーする'
            })
        );
    });

    setTimeout(enableClipboardJs);
}

$(function () {
    $(document).on('DOMSubtreeModified', 'div.wiki-preview', function() {
        formatUncTag();
    });

    formatUncTag();
});
