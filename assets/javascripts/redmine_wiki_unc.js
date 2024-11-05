(function () {
  if(typeof jsToolBar === 'undefined') return false;
  const uncMacroRegex = /\{\{unc\(([^\s,]+)(?:,\s*([^)]+))?\)\}\}/i;
    
  // Create button
  var modalHtml = '<h3 class="title">' + WikiUnc.context.labelInsertLink + '</h3>'
                + '<p>'
                +   WikiUnc.context.labelAddress + '<br>'
                +   '<input type="text" name="address" style="width:100%" id="js-redmine-wiki-unc-input-address"><br>'
                +   '<span style="float:right"><a href="javascript:void(0)" id="js-redmine-wiki-unc-a-try-link">' + WikiUnc.context.labelTryLink + '</a></span>'
                + '</p>'
                + '<p>'
                +   '<span>' + WikiUnc.context.labelTextToDisplay + '</span>'
                +   '<span '
                +     'id="js-redmine-wiki-unc-regenerate-link-title" '
                +     'class="ui-icon ui-icon-refresh"'
                +     'title="' + WikiUnc.context.labelRegenerateTextToDisplay +'"'
                +   '></span>'
                +   '<input id="js-redmine-wiki-unc-decode" type="checkbox" checked>'
                +   '<label for="wiki-unc-decode">' + WikiUnc.context.labelDecode + '</span>'
                +   '<br>'
                +   '<input type="text" name="address" style="width:100%" id="js-redmine-wiki-unc-input-text"></p>'
                + '<p class="buttons">'
                +   '<input type="button" value="OK"     id="js-redmine-wiki-unc-button-ok" disabled> '
                +   '<input type="button" value="' + WikiUnc.context.buttonCancel + '" id="js-redmine-wiki-unc-button-cancel">'
                + '</p>';
                  
  var getCleanedAddress = function(inputAddress) {
    return inputAddress.val().replace(/"/g, '').trim();
  };
  var getEncodedAddress = function(inputAddress) {
    return getCleanedAddress(inputAddress).replace(/ /g,  '%20')
                                          .replace(/\(/g, '%28')
                                          .replace(/\)/g, '%29');
  };
  var isInputValid = function(inputAddress) {
    return getCleanedAddress(inputAddress) != '';
  };
  var getBasename = function(path) {
    try {
      return path.replace(/[\\\/]$/, '').replace(/^.*[\\\/]/, '');
    }
    catch(err) {
      return "";
    }
  };
  var autoInputBasename = function(inputText, inputAddress, decode = false) {
    if (inputText.val() == "") {
      var basename = getBasename(getCleanedAddress(inputAddress));
      if (basename != "") {
        inputText.val(decode ? decodeURIComponent(basename) : basename);
      }
    }
  }

  function typeOfText(str) {
    const httpRegex = /^https?:\/\//i;
    const fileRegex = /^file:\/\//i;
    const uncRegex = /^\\\\/;

    if (uncMacroRegex.test(str)) {
      return "UncMacro";
    } else if (httpRegex.test(str)) {
      return "HttpScheme";
    } else if (fileRegex.test(str)) {
      return "FileScheme";
    } else if (uncRegex.test(str)) {
      return "UncPath";
    } else {
      return "OtherString";
    }
  }
  
  function parseUncMacro(macro) {
    const match = macro.match(uncMacroRegex);

    if (match) {
        return {
            address: match[1].trim(),
            title: match[2] ? match[2].trim() : ""
        };
    } else {
        return null;
    }
}

  var button = {
    title: WikiUnc.context.labelInsertLink,
    type:  'button',
    name:  'wiki_unc',
    class: 'jstb_wiki_unc',
    fn: {
      wiki: function() {
        const textarea = this.textarea;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const scroll = textarea.scrollTop;
        const left   = textarea.value.substring(0, start);
        const right  = textarea.value.substring(end);
        const selectedText = textarea.value.substring(start, end);

        $('#ajax-modal').html(modalHtml);
        var that = this;
        var inputAddress = $('#js-redmine-wiki-unc-input-address');
        var inputText    = $('#js-redmine-wiki-unc-input-text');
        var tryLink      = $('#js-redmine-wiki-unc-a-try-link');
        var buttonOk     = $('#js-redmine-wiki-unc-button-ok');
        var buttonCancel = $('#js-redmine-wiki-unc-button-cancel');
        var buttonRegenerateLinkTitle = $('#js-redmine-wiki-unc-regenerate-link-title');
        var checkboxDecode = $('#js-redmine-wiki-unc-decode');

        function updateInputAddress(){
          if (isInputValid(inputAddress)) {
            buttonOk.prop('disabled', false);
            tryLink.attr('href', getCleanedAddress(inputAddress));
            tryLink.attr('target', '_blank');
            autoInputBasename(inputText, inputAddress, checkboxDecode.is(':checked'));
          } else {
            buttonOk.prop('disabled', true);
            tryLink.attr('href', 'javascript:void(0)');
            tryLink.removeAttr('target');
          }
        }

        // Show selected text into input text
        const textType = typeOfText(selectedText);
        if (textType === "UncMacro") {
          const ret = parseUncMacro(selectedText);
          if (ret) {
            inputAddress.val(ret.address);
            inputText.val(ret.title);
          }
        } else if (textType === "OtherString") {
          inputText.val(selectedText);
        } else {
          inputAddress.val(selectedText);
        }
        updateInputAddress();

        inputAddress.keyup(updateInputAddress);
        inputAddress.on('paste', function(e){
          if (e.originalEvent.clipboardData && e.originalEvent.clipboardData.getData) {
            const html = e.originalEvent.clipboardData.getData('text/html');
            const $anchor = $('<dummy/>').html(html).find('a').eq(0);
            if ($anchor.length > 0)
            {
              e.preventDefault();
              inputAddress.val($anchor.attr("href"));
              inputText.val($anchor.text());
            }
          }
          setTimeout(updateInputAddress, 100);  // Failed if no delay
        });
        inputAddress.keypress(function(e){
          if (e.keyCode === 13) { // 13 is enter
            if (isInputValid(inputAddress)) {
              buttonOk.trigger('click');
              return false; // Return false to prevent to insert new line
            }
          }
        });
        inputText.keypress(function(e){
          if (e.keyCode === 13) { // 13 is enter
            if (isInputValid(inputAddress)) {
              buttonOk.trigger('click');
              return false; // Return false to prevent to insert new line
            }
          }
        });
        buttonOk.click(function(){
          if (!isInputValid(inputAddress)) {
            return;
          }
          hideModal(this);
          
          var address = getCleanedAddress(inputAddress);
          var text    = inputText.val().trim();
          if (text == '') {
            text = address;
          }
          
          var link;
          if (/^\\\\/.test(address)) {
            if (address == text) {
              link = '{{unc(' + address + ')}}';
            } else {
              link = '{{unc(' + address + ', ' + text + ')}}';
            }
          } else {
            var encoded = getEncodedAddress(inputAddress);
            if (encoded == text) {
              link = encoded;
            } else {
              var textFormatting = $('#js-redmine-wiki-unc-script-tag').data('text-formatting');
              if (textFormatting == 'markdown' || textFormatting == 'common_mark') {
                link = '[' + text + '](' + encoded + ')';
              } else {
                link = '"' + text + '":' + encoded;
              }
            }
          }
          
          // Insert spaces to match the left and right strings
          if (left !== "" && !/[ |\n|\t]$/.test(left)) {
            link = " " + link
          }
          if (right !== "" && !/^[ |\n|\t]/.test(right)) {
            link = link + " "
          }
          
          textarea.value     = left + link + right;
          textarea.scrollTop = scroll;
          textarea.selectionStart = textarea.selectionEnd = (left + link).length;
        });
        buttonCancel.click(function(){
          hideModal(this);
        });
        buttonRegenerateLinkTitle.click(function(){
          // Clear input area
          inputText.val("");
          updateInputAddress();
        })

        $('#ajax-modal').off('dialogclose'); // If "off" is not executed, the event is added many times.
        showModal('ajax-modal', '60%');
        $('#ajax-modal').on('dialogclose', function(event) {
          that.textarea.focus();
        });
      }
    }
  };

  // Recreate toolbar
  var elements_new = {};
  for (var i in jsToolBar.prototype.elements) {
    elements_new[i] = jsToolBar.prototype.elements[i];
    if (i == 'img') { // Insert new button after the image button.
      elements_new['wiki_unc'] = button;
    }
  }
  jsToolBar.prototype.elements = elements_new;

}());
