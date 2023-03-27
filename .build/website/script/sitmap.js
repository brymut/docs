const fs = require('fs')
const path = require('path')
const {
  XMLParser,
  XMLBuilder,
  XMLValidator,
} = require('fast-xml-parser')

function parseSitmap(sitemapPath, processorList, options = {}) {
  const data = fs.readFileSync(sitemapPath, 'utf-8')
  const parser = new XMLParser(options)
  let xml = parser.parse(data)
  for (const processor of processorList) {
    xml = processor(xml)
  }
  const builder = new XMLBuilder()
  let content = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">'
  content += builder.build(xml).slice(63)
  fs.writeFileSync(sitemapPath, content)
}

const root = path.dirname(path.dirname(__filename))
const sitemapPath = path.join(root, 'build', 'sitemap.xml')

parseSitmap(sitemapPath, [
  (sitemap) => {
    sitemap.urlset.url = sitemap.urlset.url.map(it => {
      if (it.loc[it.loc.length - 1] != '/') {
        it.loc += '/'
      }
      return it
    })
    return sitemap
  }
])
