#!/bin/bash

# Script untuk submit sitemap ke search engines
# Usage: bash scripts/submit-sitemap.sh

SITEMAP_URL="https://anime.antidonasi.web.id/sitemap.xml"

echo "🚀 Submitting sitemap to search engines..."
echo ""

# Google
echo "📍 Submitting to Google..."
curl "https://www.google.com/ping?sitemap=${SITEMAP_URL}"
echo ""

# Bing
echo "📍 Submitting to Bing..."
curl "https://www.bing.com/ping?sitemap=${SITEMAP_URL}"
echo ""

# Yandex
echo "📍 Submitting to Yandex..."
curl "https://webmaster.yandex.com/ping?sitemap=${SITEMAP_URL}"
echo ""

echo "✅ Done! Sitemap submitted to all search engines."
echo ""
echo "Next steps:"
echo "1. Verify in Google Search Console: https://search.google.com/search-console"
echo "2. Verify in Bing Webmaster: https://www.bing.com/webmasters"
echo ""
