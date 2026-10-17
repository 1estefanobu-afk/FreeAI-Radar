# ✳ FreeAI Radar

**Discover free AI. Know the limits.**

FreeAI Radar is an open-source directory of AI tools with clear descriptions, official links, and practical filters. The goal is to help people discover useful tools without making unsupported promises about unlimited free usage.

> **Transparency note:** Free plans, quotas, supported features, and access rules change. Entries in this starter version are not a guarantee of a current quota. Always check the linked official website. Contributions that verify plan details should include the date and a reliable source.

## Features

- Search by tool name, publisher, description, or tag.
- Filter by category: chat, coding, local AI, or experiments.
- Sort by name or access type.
- Responsive dark-mode layout.
- Data stored separately in `data/tools.json`, so additions do not require editing the page layout.
- No paid API, backend, build step, or JavaScript dependencies.

## Run locally

The page loads `data/tools.json`, so open it through a local web server instead of double-clicking `index.html`.

### Windows

1. Download or extract this repository.
2. Open the project folder in File Explorer.
3. Click the address bar, type `cmd`, and press Enter.
4. Run:

   ```powershell
   py -m http.server 8000
   ```

5. Open [http://localhost:8000](http://localhost:8000) in your browser.
6. Stop the server with `Ctrl+C` in the terminal.

If `py` is not recognized, install Python from [python.org](https://www.python.org/downloads/) or use another local static server.

## Publish with GitHub Pages

1. Create a public repository on GitHub named `FreeAI-Radar` (or another name).
2. Upload the contents of this folder to the repository root. Make sure `index.html` is at the root, not inside an extra nested folder.
3. Open **Settings → Pages** in the repository.
4. Under the build and deployment settings, select **Deploy from a branch**, choose `main` and `/(root)`, then save.
5. Wait for GitHub Pages to publish the site. The URL will appear in the Pages settings.

GitHub can update its menus over time; use the current Pages settings if labels differ.

## Add a tool

Add a new object to `data/tools.json`. Example:

```json
{
  "id": "example-tool",
  "name": "Example AI",
  "maker": "Example Company",
  "monogram": "E",
  "hue": "purple",
  "access": "online",
  "accessLabel": "ONLINE · WARUNKI DO SPRAWDZENIA",
  "categories": ["chat"],
  "categoryLabels": ["Chatbot"],
  "description": "A short, factual description of the tool.",
  "limitNote": "Check the official site for current plan details.",
  "officialUrl": "https://example.com/"
}
```

Allowed category keys currently used by the interface: `chat`, `coding`, `local`, and `experiments`. You can also use `education` as a tag; it will appear in search but does not have its own filter yet. Keep each ID unique and use direct official links. Do not claim a plan is unlimited unless the claim is clear, current, and sourced.

## Roadmap

- [ ] Add a “last checked” date and source link for plan limits.
- [ ] Add a dedicated education filter.
- [ ] Add an option to suggest a new tool via GitHub Issues.
- [ ] Add automated checks for malformed data and invalid URLs.
- [ ] Localize the UI into English.

## Contributing

Suggestions and pull requests are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT — see [LICENSE](LICENSE).
