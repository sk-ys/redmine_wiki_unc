$(function () {
  var unc_to_file_proto = function(path_unc){
      return 'file:///' + path_unc.replace(/"/g, '').replace(/\\/g, '/')
  }
  
  $("span.path_unc").replaceWith(function() {
      return $('<a/>', {
        href: unc_to_file_proto(this.innerHTML),
        html: this.getAttribute("name"),
        class: "external"  // ignored?
      });
  });

});
