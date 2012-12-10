## config
JS_ENGINE ?= `which node nodejs 2>/dev/null`

all: test
## test against jshint
test:
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Checking files against JSHint..."; \
		${JS_ENGINE} tests/jshint-check.js || return -1 \
	else \
		echo "You must have NodeJS installed in order to test js files against JSHint."; \
	fi
