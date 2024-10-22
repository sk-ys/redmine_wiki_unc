module RedmineWikiUnc
  class UncHelper
    def initialize
      @head = /^\\\\/
    end

    def is_unc?(str)
      (str =~ @head) != nil
    end

    def unc_to_file_proto(str)
      Rails.logger.info "str == #{str}, is_unc? == #{is_unc?(str)}, head=#{@head.to_s}"
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
      html = <<~TEXT
        <span class='path_unc_outer'>
          <a href='#{unc_to_file_proto(unc)}' class='external' target='_blank'>#{label}</a>
          <a class='path_unc icon-only icon icon-copy' data-clipboard-text='#{unc}' title='#{I18n.t(:label_copy_path)}' onclick='copyTextToClipboard(this)'></a>
        </span>
      TEXT
      return html.html_safe
    end
  end
end
