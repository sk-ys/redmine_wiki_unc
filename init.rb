require 'redmine'
require_dependency File.expand_path('../lib/redmine_wiki_unc_hooks', __FILE__)
require_dependency File.expand_path('../lib/redmine_wiki_unc/unc_helper.rb', __FILE__)
require_dependency File.expand_path('../lib/redmine_wiki_unc/field_format.rb', __FILE__)

Redmine::Plugin.register :redmine_wiki_unc do
  name 'Redmine Wiki Unc plugin'
  author 'Takashi Oguma'
  description 'This is a plugin for macro of Redmine Wiki'
  version '0.0.4'

  Redmine::WikiFormatting::Macros.register do
    desc <<DESC
Makes a link to UNC path.
How to use:
1) without a label: {{unc(\\\\server\\path\\to\\file)}}
2) with a label:    {{unc(\\\\server\\path\\to\\file, My Secret Document)}}
DESC

    macro :unc do |obj, args|
      h = RedmineWikiUnc::UncHelper.new
      h.get_tag(args)
    end
  end
end
