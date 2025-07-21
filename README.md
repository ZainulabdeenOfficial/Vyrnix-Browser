# 🚀 Vyrnix Browser

A powerful privacy-focused web browser built with **Electron** and **React** for Windows desktop. Vyrnix combines modern web technologies with advanced privacy features, Web3 integration, and a beautiful user interface.

![Vyrnix Browser](https://img.shields.io/badge/Version-1.0.0-blue)
![Platform](https://img.shields.io/badge/Platform-Windows-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🔒 Privacy & Security
- **Built-in Ad Blocker** - Block ads and trackers automatically
- **HTTPS Enforcement** - Automatically upgrade to secure connections
- **Privacy Shield** - Real-time protection statistics
- **Secure Browsing** - Enhanced security policies

### 🌐 Browser Core
- **Chromium-based Engine** - Full web compatibility
- **Tabbed Browsing** - Multiple tabs with modern UI
- **Bookmarks Management** - Save and organize favorites
- **History Tracking** - Browse your past visits
- **Smart Address Bar** - URL navigation and search handling

### 💰 Web3 Integration
- **Crypto Wallet** - Built-in Ethereum wallet support
- **Web3 Ready** - Connect to decentralized applications
- **MetaMask Compatible** - Works with existing wallet providers

### 🎁 Rewards System
- **Token Earning** - Earn tokens for viewing privacy-respecting ads
- **Creator Tipping** - Support your favorite content creators
- **Auto-Contribute** - Automatically support sites you visit
- **Monthly Rewards** - Track your earnings and payouts

### 🎨 User Experience
- **Dark/Light Themes** - Modern theme switching
- **Responsive Design** - Adapts to different window sizes
- **Interactive Welcome Page** - Beautiful dashboard with real-time stats
- **Sidebar Navigation** - Easy access to features and tools
- **Live Clock & Weather** - Stay informed while browsing
- **Tech News Feed** - Latest technology updates

## 🚀 Installation

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git**
- **Windows 10/11**

### Quick Start

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/vyrnix-browser.git
   cd vyrnix-browser
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development**
   ```bash
   npm start
   ```
   This will start both the React development server and the Electron application.

4. **Build for Production**
   ```bash
   npm run build
   npm run dist
   ```

## 📁 Project Structure

```
vyrnix-browser/
├── public/                 # Static assets and HTML
├── src/
│   ├── main/              # Electron main process
│   │   ├── main.js        # Main application entry
│   │   └── preload.js     # Secure IPC bridge
│   └── renderer/          # React frontend
│       ├── components/    # UI components
│       ├── contexts/      # React contexts
│       └── styles/        # CSS and styling
├── blocklists/           # Ad and tracker blocking lists
└── build/                # Production build output
```

## 🛠 Development

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development environment |
| `npm run build` | Build for production |
| `npm run dist` | Create distributable .exe |
| `npm test` | Run tests |
| `npm run pack` | Package without installer |

### Development Features

- **Hot Reload** - Automatic refresh during development
- **DevTools** - Chrome DevTools integration
- **Debug Mode** - Enhanced logging and debugging
- **Live Updates** - Real-time code changes

## 🎯 Usage

### Basic Browsing
1. Open the application
2. Use the search bar to navigate or search
3. Create new tabs with `Ctrl+T`
4. Bookmark favorite sites
5. Toggle dark/light mode

### Advanced Features
- View live privacy protection stats
- Access crypto wallet in sidebar
- Check tech news feed on welcome page
- Monitor real-time clock and weather
- Customize privacy settings

### Crypto Wallet
1. Click the wallet icon in the sidebar
2. Connect your existing wallet or create new one
3. View balance and transaction history
4. Use Web3 features on supported sites

### Rewards System
1. Enable rewards in the sidebar
2. Set your ad frequency preferences
3. View earned tokens and statistics
4. Tip creators or enable auto-contribute

## 🔧 Configuration

### Settings Location
- **Windows**: `%APPDATA%/vyrnix-browser/`
- **Preferences**: Stored in encrypted local storage
- **Bookmarks**: Local storage with secure encryption
- **History**: Local storage with 1000 item limit

### Customization
- Modify `src/renderer/styles/` for UI theming
- Update `blocklists/` for custom ad blocking

## 🚨 Security

### Privacy Measures
- **No Telemetry** - No usage data collection
- **Local Storage** - All data stored locally
- **Encrypted Storage** - Sensitive data encryption
- **Content Security Policy** - XSS protection

### Security Features
- Sandbox isolation for web content
- Secure IPC communication
- HTTPS enforcement
- Safe browsing policies

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Electron Team** - For the excellent framework
- **React Team** - For the powerful UI library
- **TailwindCSS** - For the utility-first CSS framework

## 📞 Support

- 📧 **Email**: support@vyrnix-browser.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/vyrnix-browser/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/your-username/vyrnix-browser/discussions)
- 📖 **Documentation**: [Wiki](https://github.com/your-username/vyrnix-browser/wiki)

## 🗺 Roadmap

### Version 1.1
- [ ] Incognito mode
- [ ] Extension support
- [ ] VPN integration
- [ ] Enhanced ad blocking

### Version 1.2
- [ ] Mobile companion app
- [ ] Sync across devices
- [ ] Advanced privacy features
- [ ] Custom search engines

### Version 2.0
- [ ] Built-in VPN
- [ ] Tor integration
- [ ] Advanced Web3 features
- [ ] Multi-platform support

---

**Built with ❤️ for privacy and freedom on the web**

*Vyrnix Browser - Where Privacy Meets Innovation*
