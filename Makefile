# slate
# See LICENSE for copyright and license details.
all: sass ts slate

run: sass ts
	go run ./cmd/slate/

slate:
	go build ./cmd/slate/ $(GOFLAGS)

sass:
	mkdir -p ui/static/css/
	sassc ui/sass/main.sass ui/static/css/main.css

ts:
	npx esbuild ui/ts/main.ts --bundle --outfile=ui/static/js/main.js

clean:
	rm -f slate
	rm -rf /ui/static/css/
	rm -rf /ui/static/js/

watch:
	mkdir -p ui/static/css/
	fd -tf | entr -rsc "make run"

.PHONY: all run sass ts clean watch
