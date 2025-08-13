<div align="center">

# ⚛️ Celeste React

### Unified AI Interface for All Capabilities - Chat, Images, Audio, Documents, and More

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge&logo=opensourceinitiative&logoColor=white)](LICENSE)
[![Vite](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

[![Demo](https://img.shields.io/badge/🚀_Try_Demo-Live-0ea5e9?style=for-the-badge)](http://localhost:5173)
[![API](https://img.shields.io/badge/🔌_API-Celeste_API-purple?style=for-the-badge)](../celeste-api)

</div>

---

## 🎯 Why Celeste React?

<div align="center">
  <table>
    <tr>
      <td align="center">🎨<br><b>All-in-One</b><br>Chat, images, audio, docs in one UI</td>
      <td align="center">⚡<br><b>Real-time</b><br>Streaming responses & live updates</td>
      <td align="center">🤖<br><b>Multi-Provider</b><br>All AI providers, one interface</td>
      <td align="center">📱<br><b>Responsive</b><br>Desktop, tablet, and mobile ready</td>
    </tr>
  </table>
</div>

A comprehensive React interface that brings together all Celeste AI capabilities - from text generation and chat to image creation, audio processing, document intelligence, and embeddings - all through a unified, beautiful interface.

## 🚀 Quick Start

```bash
# 1) Install dependencies
npm install

# 2) Configure environment (optional)
cp .env.example .env

# 3) Start development server
npm start

# Open your browser:
# http://localhost:5173
```

<details>
<summary><b>Using pnpm (Alternative)</b></summary>

```bash
pnpm install
pnpm start
```

</details>

<details>
<summary><b>Using yarn (Alternative)</b></summary>

```bash
yarn install
yarn start
```

</details>

## 🔧 Configuration

### 1️⃣ Environment Setup

```bash
cp .env.example .env
```

### 2️⃣ API Connection

Configure the API endpoint in your environment file:

```env
VITE_API_URL=http://localhost:8000  # Celeste API URL
VITE_WS_URL=ws://localhost:8000     # WebSocket URL for streaming
```

## ✨ Features

### 💬 Text & Chat

- **Conversations** - Multi-turn chat with context
- **Model Selection** - Switch between Claude, GPT-4, Gemini, and more
- **Streaming Responses** - Real-time token-by-token display
- **History Management** - Save and restore conversations

### 🎨 Image Generation

- **Text-to-Image** - Generate images from prompts
- **Multi-Provider Support** - DALL-E, Stable Diffusion, Midjourney
- **Style Controls** - Adjust artistic styles and parameters
- **Gallery View** - Browse generated images

### ✏️ Image Editing

- **Upload & Edit** - Modify existing images
- **Inpainting** - Smart object removal and replacement
- **Outpainting** - Extend images beyond borders
- **Style Transfer** - Apply artistic styles

### 🎧 Audio Intelligence

- **Transcription** - Convert speech to text
- **Audio Analysis** - Extract insights from audio
- **Multi-Language** - Support for 100+ languages
- **Real-time Processing** - Live audio streaming

### 📄 Document Intelligence

- **PDF Processing** - Extract and analyze PDF content
- **Document Q&A** - Ask questions about documents
- **Multi-Format** - Support for PDF, DOCX, TXT, and more
- **Batch Processing** - Handle multiple documents

### 🔢 Embeddings

- **Text Vectorization** - Convert text to embeddings
- **Similarity Search** - Find related content
- **Clustering** - Group similar items
- **Visualization** - 2D/3D embedding plots

### 🎥 Video Generation (Coming Soon)

- **Text-to-Video** - Generate videos from prompts
- **Video Editing** - Modify existing videos
- **Animation** - Create animated content

### UI/UX Features

- 🌙 **Dark Theme** - Modern, eye-friendly interface
- 📱 **Responsive Design** - Works on any device
- ⌨️ **Keyboard Shortcuts** - Power user features
- 🎯 **Context Awareness** - Smart suggestions
- 📊 **Usage Analytics** - Track API usage and costs
- 🔍 **Universal Search** - Find anything quickly

## 💻 Development

### Build for Production

```bash
npm run build
```

Builds the app to the `dist` folder, optimized for production.

### Run Tests

```bash
npm test
```

### Lint & Format

```bash
npm run lint
npm run format
```

### Type Check

```bash
npm run type-check
```

## 🏗️ Project Structure

```
celeste-react/
├── src/
│   ├── components/        # React components
│   │   ├── chat/         # Chat interface components
│   │   ├── image/        # Image generation/edit UI
│   │   ├── audio/        # Audio processing UI
│   │   ├── document/     # Document intelligence UI
│   │   ├── embeddings/   # Embeddings visualization
│   │   └── shared/       # Shared components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API service layer
│   ├── stores/           # Zustand state stores
│   ├── types/            # TypeScript definitions
│   ├── utils/            # Utility functions
│   └── App.tsx           # Main app component
├── public/               # Static assets
├── tests/                # Test files
└── package.json          # Dependencies
```

## 🎨 Supported Capabilities

### Text Generation

- 🌈 **Google Gemini** - Gemini 2.5 Flash/Pro
- 🤖 **OpenAI** - GPT-4, GPT-4o
- 🎭 **Anthropic** - Claude 3.7, Claude 4
- 🌊 **Mistral** - Small/Medium/Large
- 🦙 **Ollama** - Local models

### Image Generation

- 🎨 **DALL-E 3** - OpenAI's image model
- 🖼️ **Stable Diffusion** - Open source diffusion
- 🌅 **Imagen** - Google's image AI
- 🎭 **Midjourney** - Artistic generation

### Audio Processing

- 🎤 **Whisper** - OpenAI transcription
- 🌈 **Gemini Audio** - Google's audio AI
- 🎧 **Assembly AI** - Advanced transcription

### Document Processing

- 📄 **Gemini Documents** - Google's document AI
- 🤖 **GPT-4 Vision** - OpenAI document understanding
- 📑 **Claude Vision** - Anthropic's document AI

## 🗺️ Roadmap

- [ ] 🎨 **Theme Customization** - Light mode, custom themes
- [ ] 💾 **Local Storage** - Offline capability caching
- [ ] 🌍 **i18n** - Multi-language interface support
- [ ] 🔊 **Voice Interface** - Voice commands and TTS
- [ ] 📊 **Advanced Analytics** - Detailed usage insights
- [ ] 🔌 **Plugin System** - Extend with custom capabilities
- [ ] 📱 **Mobile Apps** - iOS/Android native apps
- [ ] 🎥 **Video Generation** - Text-to-video interface
- [ ] 🤝 **Collaboration** - Multi-user sessions
- [ ] 🧪 **A/B Testing** - Compare model outputs

## 🌌 Celeste Ecosystem

| Package                              | Description             | Status          |
| ------------------------------------ | ----------------------- | --------------- |
| ⚛️ **celeste-react**                 | Unified AI interface    | 🔄 This Package |
| 🚀 **celeste-api**                   | FastAPI backend service | ✅ Available    |
| 🧩 **celeste-core**                  | Core types & registry   | ✅ Available    |
| 💬 **celeste-client**                | Text generation library | ✅ Available    |
| 🎨 **celeste-image-generation**      | Image generation        | ✅ Available    |
| ✏️ **celeste-image-edit**            | Image editing           | ✅ Available    |
| 📄 **celeste-document-intelligence** | Document processing     | ✅ Available    |
| 🎧 **celeste-audio-intelligence**    | Audio processing        | ✅ Available    |
| 🔢 **celeste-embeddings**            | Text embeddings         | ✅ Available    |
| 🎥 **celeste-video-generation**      | Video generation        | 📋 Planned      |

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Made with ❤️ by the Celeste Team
  
  <a href="#️-celeste-react">⬆ Back to Top</a>
</div>
