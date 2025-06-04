module RedmineWikiUnc
  class UncHelper
    def initialize
      @head = /^\\\\/
    end

    def is_unc?(str)
      (str =~ @head) != nil
    end

    def unc_to_file_proto(str)
      return "" if !is_unc?(str)
      str.gsub(@head, "file://").gsub(/\\/, "/")
    end

    def trim(str)
      return str.strip unless str == nil
      return nil
    end

    def parse_args(args)
      unc = trim(args[0])
      label = trim(args[1]) || unc

      return unc, label
    end

    def get_tag(args)
      return "(No parameters are specified. A UNC path is needed at least.)" if args.empty?
      unc, label = parse_args(args)
      display_full_unc_path_for_email = Setting.plugin_redmine_wiki_unc[:display_full_unc_path_for_email] == '1'
      html = ""
      html += "<span class='path_unc_outer'>"
      html += "<a class='path_unc' href='#{unc_to_file_proto(unc)}' target='_blank'"
      html += " style='display:none; /* for email */'" if display_full_unc_path_for_email
      html += ">#{label}</a>"
      html += "<span class='full_unc_path_for_email'>\"#{unc}\"</span>" if display_full_unc_path_for_email
      # Note: Use button tag instead of a tag to prevent an error with the Redmine Lightbox 2 plugin.
      html += "<button class='path_unc icon-only icon icon-copy' data-clipboard-text='#{unc}' title='#{I18n.t(:message_copy_path)}' onclick='WikiUnc.fn.copyTextToClipboard(this)'></button>"
      html += "</span>"
      return html.html_safe
    end
  end
end
