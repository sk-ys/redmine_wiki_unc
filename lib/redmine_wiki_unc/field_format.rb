module RedmineWikiUnc
  class PathUncFormat < Redmine::FieldFormat::LinkFormat
    add 'path_unc'

    def formatted_value(view, custom_field, value, customized = nil, html = false)
      if value.present?
        h = UncHelper.new
        path_unc = h.unc_to_file_proto(value.to_s)
        begin
          view.link_to File.basename(path_unc), path_unc, 
            title: path_unc, target: (path_unc != "" ? '_blank' : nil)
        rescue
          value
        end
      end
    end

  end
end
  