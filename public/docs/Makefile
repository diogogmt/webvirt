
JADE = ./node_modules/.bin/jade

HTML = index.html \
	virt-api.html

docs: $(HTML)

%.html: %.jade
	$(JADE) --path $< < $< > $@

clean:
	rm -f *.html

.PHONY: docs clean
