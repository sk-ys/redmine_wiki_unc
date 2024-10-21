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
      str.gsub(@head, "file://///").gsub(/\\/, "/")
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

      return "<span class='path_unc' name=#{label}>".html_safe + "\"#{unc}\"" + "</span>".html_safe
    end
  end
end