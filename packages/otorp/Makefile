LIBFILES=$(wildcard src/*.ts)
TSFILES=$(wildcard *.ts)
ENTRIES=$(subst .ts,.js,$(TSFILES))

.PHONY: all
all: $(ENTRIES)

index.node.js: index.node.ts $(LIBFILES)
	./node_modules/.bin/esbuild $< --bundle --outfile=$@ --platform=node --format=cjs

%.node.js: %.node.ts $(LIBFILES)
	./node_modules/.bin/esbuild $< --bundle --external:./ --outfile=$@ --platform=node
	sed -i '' 's/ts-node/node/g' $@

%.js: %.ts $(LIBFILES)
	./node_modules/.bin/esbuild $< --bundle --outfile=$@ --platform=browser --format=iife --global-name=$* --target=es5

.PHONY: clean
clean:
	rm $(ENTRIES)
