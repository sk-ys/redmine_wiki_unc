module RedmineWikiUnc
  class FieldFormat < Redmine::FieldFormat::LinkFormat
    add 'path_unc'

    def formatted_value(view, custom_field, value, customized = nil, html = false)
      if value.present?
        h = UncHelper.new
        begin
          h.get_tag([value, File.basename(value)])
        rescue
          value
        end
      end
    end

  end
end
  