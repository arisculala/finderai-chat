# FinderAI-CHAT

FinderAI-Chat is the frontend application for FinderAI, an AI-powered chat interface that enables users to query an AI-backed vector search system. It integrates with FinderAI-Chat-Backend, which processes text queries by matching them against stored text embeddings. The backend retrieves relevant responses using vector similarity search.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Setup and Installation](#setup-and-installation)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- AI-Powered Chat Interface – Query an AI-powered backend that retrieves the most relevant responses based on stored text embeddings.
- Seamless Backend Integration – Calls FinderAI-Chat-Backend’s API to send user queries and receive matching responses.
- Dynamic Provider and Model Selection – Configurable via environment variables (NEXT_PUBLIC_PROVIDER, NEXT_PUBLIC_MODEL).
- State Management Using React – Maintains chat history in local state for smooth interactions.
- Real-time Query Execution – Sends user input to the backend and displays responses dynamically.
- User-Friendly Interface – Responsive and modern UI using Next.js + Tailwind CSS.

## Prerequisites

Ensure you have the following installed:

- Node.js (v18+)
- npm or yarn
- FinderAI-Chat-Backend (running locally or hosted)

## Setup and Installation

**1. Clone the Repository**

```bash
git clone https://github.com/arisculala/finderai-chat.git
cd finderai-chat
```

**2. Configure Environment Variables**
Create a `.env.local` file in the project root and define the backend API URL and AI provider settings:

```bash
cp example.env.local .env.local

Update values:
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_PROVIDER=
NEXT_PUBLIC_MODEL=
```

**3. Install Dependencies**

```bash
npm install
# or
yarn install
```

## Running the Application

- Start the development server

```bash
npm run dev
# or
yarn dev
```

The app will be available at http://localhost:3000.

## API Documentation

FinderAI-Chat interacts with FinderAI-Chat-Backend to process user queries.

### Chat Flow

1. User enters a message.
2. Frontend sends the text query to the backend’s `/api/v1/chat/message` endpoint.
3. Backend searches stored embeddings to find similar text matches.
4. Matching records are returned and displayed in the chat window.

- Example API Request:

```bash
{
  "provider": "huggingface",
  "model": "test",
  "query": "What is AI?",
  "limit": 1
}
```

- Response:

```bash
[
  {
    "text": "AI stands for Artificial Intelligence, which enables machines to learn from data.",
    "metadata": {
      "source": "AI Handbook",
      "timestamp": "2025-03-23T10:00:00Z"
    }
  }
]
```

## Future Enhancements

- Chat History Storage – Save conversations in the backend for later retrieval.
- Context Awareness – Implement algorithms to provide more contextual responses.
- User Authentication & Personalization – Support user-based chat sessions.
- Improved UI & Performance – Enhance frontend interactivity and efficiency.

## Contributing

To contribute:

- Fork the Repository
- Crete a feature branch: `git checkout -b feat:new-feature`
- Commit your changes: `git commit -m 'added new feature'`
- Push to the branch: `git push origin feat/new-feature`
- Create a pull Request

## License

This project is licensed under the **MIT License**.

## Contact

- 📧 Email: arisculala@gmail.com
- 🐙 GitHub: [arisculala](https://github.com/arisculala "Visit MyGithub")
- Enjoy using **FinderAI-CHAT**! 🚀 If you have any questions, feel free to reach out. 😊
