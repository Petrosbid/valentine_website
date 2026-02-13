# 💌 Valentine's Day Interactive Experience 💖

A beautifully crafted, interactive Valentine's Day surprise featuring stunning animations, romantic slides, and a heartfelt proposal experience. Built with modern web technologies for an unforgettable romantic moment.

## ✨ Features

- 🎨 **Stunning Visual Effects**: WebGL-powered animated background with interactive particle effects
- 🎵 **Background Music**: Customizable romantic soundtrack with play/pause controls
- 📱 **Responsive Design**: Works perfectly on all devices (mobile, tablet, desktop)
- 🔄 **Animated Transitions**: Smooth slide transitions with magical text animations
- 🖼️ **Image Gallery**: Beautiful photo display with dynamic positioning
- 💝 **Interactive Proposal**: Playful "Yes/No" button interaction with moving "No" button
- 🎉 **Confetti Celebration**: Festive confetti animations on special moments
- 📝 **Personalized Letter**: Elegant envelope opening with custom love letter
- ⚙️ **Highly Configurable**: Easy customization via JSON settings

## 🛠️ Tech Stack

<div align="center">

| Technology | Purpose |
|------------|---------|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white) | Structure & Layout |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white) | Styling & Animations |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black) | Interactivity & Logic |
| ![Three.js](https://img.shields.io/badge/ThreeJS-black?style=for-the-badge&logo=three.js&logoColor=white) | 3D Graphics & Animations |
| ![GSAP](https://img.shields.io/badge/GSAP-85E0FF?style=for-the-badge&logo=greensock&logoColor=black) | Advanced Animations |
| ![Canvas Confetti](https://img.shields.io/badge/Canvas--Confetti-white?style=for-the-badge&logo=data:image/svg+xml;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAFZJREFUOI3tzrsNgDAMRFGHOkShDlGoQxSqUIUqVKEKVahCFapQhSpUoQpVqEIVqlCFKlShClWoQhWqUIUqVKEKVahCFaoQERH5AbptDBYjCkOFAAAAAElFTkSuQmCC) | Celebration Effects |

</div>

## 📷 Preview

<div align="center">
  
**Live Demo:** 

</div>

*Note: Actual screenshots would go here. Create your own preview images and place them in an `assets` folder.*

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Local server (optional, but recommended for best experience)

### Installation

1. **Clone or download** this repository to your local machine
2. **Open** `index.html` in your web browser
3. **Customize** the `settings.json` file to personalize the experience
4. **Enjoy** your unique Valentine's Day surprise!

### Using a Local Server (Recommended)

For the best experience, serve the files through a local server:

```bash
# Navigate to the project directory
cd valentine-project

# Start a simple server (Python)
python -m http.server 8000

# Or using Node.js
npx serve .

# Then open http://localhost:8000 in your browser
```

## ⚙️ Configuration

The entire experience is controlled by the `settings.json` file. Customize every aspect:

### App Settings
```json
{
  "appSettings": {
    "title": "Your Title Here ❤️",
    "language": "en",
    "direction": "ltr",
    "fontFamily": "'Arial', sans-serif",
    "backgroundColor": "#0a0005"
  }
}
```

### Slides Configuration
Create as many slides as you want with different types:

#### Text-only Slide
```json
{
  "id": "slide1",
  "textContent": "Your romantic message here",
  "type": "text-only"
}
```

#### Gallery Slide
```json
{
  "id": "slide4",
  "textContent": "Our beautiful memories...",
  "type": "gallery",
  "galleryImages": [
    {
      "src": "https://example.com/image1.jpg",
      "alt": "Description",
      "transform": "rotate(-10deg) translate(-20px, 0)"
    }
  ]
}
```

#### Proposal Slide
```json
{
  "id": "proposalSlide",
  "textContent": "Will you be my Valentine?",
  "type": "proposal",
  "buttons": {
    "yes": {
      "text": "Yes! 💖",
      "className": "yes-btn"
    },
    "no": {
      "text": "No",
      "className": "no-btn"
    }
  }
}
```

### Music Settings
```json
{
  "music": {
    "audioSource": "path/to/your/song.mp3",
    "initialVolume": 0.7
  }
}
```

### Letter Content
```json
{
  "letterContent": {
    "header": "A Message From My Heart",
    "paragraphs": [
      "My dearest,",
      "This letter is written with all my love for you...",
      "You mean everything to me..."
    ],
    "signature": "Forever Yours"
  }
}
```

### Animation Settings
```json
{
  "animations": {
    "confettiColors": ["#ff0000", "#ff69b4", "#ffffff"],
    "confettiParticleCount": 150,
    "confettiSpread": 80
  }
}
```

## 🎨 Customization Guide

### Changing Colors
Modify the color scheme in the `colors` section of `settings.json`:
- `primaryAccent`: Main accent color for headers and important elements
- `secondaryAccent`: Secondary color for backgrounds and highlights
- `envelopeColor`: Color of the envelope
- `envelopeFlapColor`: Color of the envelope flap
- `envelopePocketColor`: Color of the envelope pocket

### Adding Images
1. Upload your images to a hosting service (like Imgur, Cloudinary, or your own server)
2. Update the `galleryImages` array in `settings.json` with your image URLs
3. Adjust the `transform` property to position images as desired

### Personalizing Text
All text content can be customized in the `settings.json` file:
- Slide text content
- Button labels
- Letter content
- Funny "No" button responses

### Audio Setup
1. Host your audio file online (can be MP3, WAV, or other web-compatible formats)
2. Update the `audioSource` in the `music` section of `settings.json`
3. Adjust volume level as needed

## 📱 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ❌ Internet Explorer (not supported)

## 🔧 Troubleshooting

### Audio Issues
- Some browsers block autoplay - click anywhere on the page to enable sound
- Ensure your audio file is hosted on a secure (HTTPS) connection

### Animation Performance
- On older devices, animations might be slower
- Reduce particle count in `settings.json` if needed

### Mobile Issues
- Ensure viewport is properly set in `index.html`
- Test on multiple devices for optimal experience

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas for Enhancement
- Add more animation effects
- Implement different themes
- Add video support
- Create more interactive elements
- Add localization support for more languages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 💌 Author

Made with ❤️ for your special someone.

---

<div align="center">

### Show Some Love! 💖

[![Star this repo](https://img.shields.io/github/stars/yourusername/valentine-project?style=social)](https://github.com/yourusername/valentine-project)
[![Fork this repo](https://img.shields.io/github/forks/yourusername/valentine-project?style=social)](https://github.com/yourusername/valentine-project)

**Made with passion and lots of coffee ☕**

</div>