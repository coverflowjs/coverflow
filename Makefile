all: css

css:
	@@lessc -x --no-color _less/styles.less assets/css/styles.css;

debugcss:
	@@lessc --line-numbers=mediaquery --no-color _less/styles.less assets/css/styles.css;

watch:
	@@echo "Watching less files...";
	@@watchr -e "watch('_less/.*\.less') { system 'make debugcss' }"

watchcss:
	@@echo "Watching less files...";
	@@watchr -e "watch('_less/.*\.less') { system 'make css' }"

guard:
	@@bundle exec guard

serve:
	@@bundle exec jekyll serve -w --baseurl '/'
