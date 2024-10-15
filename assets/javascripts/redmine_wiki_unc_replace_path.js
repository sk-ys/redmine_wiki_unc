function formatUncTag(pathUncElem) {
  if (!pathUncElem) {
    $(".path_unc").each((_, e) => formatUncTag(e));
    return;
  }

  const $pathUncElem = $(pathUncElem);

  // Abort if already initialized
  if ($pathUncElem.closest(".path_unc_outer").length > 0) return;

  function uncToFileProto(path_unc) {
    return "file:///" + path_unc.replace(/"/g, "").replace(/\\/g, "/");
  }

  $pathUncElem.replaceWith(function () {
    return $("<span>", { class: "path_unc_outer" })
      .append(
        $("<a>", {
          href: uncToFileProto(this.innerHTML),
          html: this.getAttribute("name"),
          class: "external",
          target: "_blank",
        })
      )
      .append(
        $("<a>", {
          html: "",
          class: "path_unc icon-only icon icon-copy",
          "data-clipboard-text": this.innerHTML.replace(/"/g, ""),
          style: "cursor: pointer",
          title: "パスをコピーする",
          onclick: "copyTextToClipboard(this)",
        })
      );
  });
}

$(() => {
  // Replace jsToolBar showPreview function
  const jsToolBarShowPreviewOrg = jsToolBar.prototype.showPreview;
  jsToolBar.prototype.showPreview = function (event) {
    const textareaHeight = $(this.textarea).outerHeight();
    jsToolBarShowPreviewOrg.call(this, event);
    if (textareaHeight > 0) {
      const $wikiPreview = $(event.target)
        .closest(".jstBlock")
        .find("div.wiki-preview");

      if ($wikiPreview[0]) {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
              observer.disconnect();
              const $pathUncElem = $wikiPreview.find(".path_unc");
              if ($pathUncElem.length > 0) {
                $pathUncElem.each((_, e) => formatUncTag(e));
              }
            }
          });
        });
        observer.observe($wikiPreview[0], { childList: true });

        // Force disconnect
        setTimeout(() => {
          observer.disconnect();
        }, 5000);
      }
    }
  };

  // Initial invoke
  $(".path_unc").each((_, e) => formatUncTag(e));
});
