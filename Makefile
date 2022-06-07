# slate
# See LICENSE for copyright and license details.
all: sass slate

slate:
	go build ./cmd/slate/ $(GOFLAGS)

sass:
	mkdir -p ui/static/css/
	sassc ui/sass/main.sass ui/static/css/main.css

clean:
	rm -f slate

watch:
	mkdir -p ui/static/css/
	find . -type f -not -path "*/.*" | entr -rs "sassc ui/sass/main.sass ui/static/css/main.css; go run ./cmd/slate/"

.PHONY: all sass clean watch
