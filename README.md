# 🐴 Caballo - Your AI-Powered DeFi Companion

> **Making your crypto work harder for you, automatically.**

## 🚀 The Opportunity

In traditional finance, your savings account earns you interest. In crypto, **your assets can earn 10-40% APY** through liquidity pools—yet 95% of crypto holders never access these yields due to complexity, fear, and fragmentation across chains.

**Caballo changes that.**

We've built an **AI-powered DeFi advisor** that speaks to you like a financial companion, educates you on liquidity pools in plain English, assesses your risk tolerance, and automatically deploys your capital into the highest-yield opportunities across multiple blockchain networks—all through a simple conversational interface.

### The Market

- **$2.8 Trillion** total cryptocurrency market cap
- **$50+ Billion** locked in DeFi protocols
- **300+ Million** crypto wallet holders globally
- **<5%** actively earning yield on their holdings

**The gap is massive. The opportunity is now.**

---

## 💡 What is Caballo?

Caballo is a **voice-first, AI-driven DeFi wealth management platform** that:

✅ **Educates users** about liquidity pools through conversational AI  
✅ **Assesses risk profiles** (conservative, moderate, aggressive)  
✅ **Automatically finds** the best yield opportunities across chains  
✅ **Executes cross-chain deposits** using Circle's CCTP protocol  
✅ **Manages positions** with auto-rebalancing and real-time monitoring  
✅ **Shows live earnings** as your crypto generates passive income  

### The Core Value Proposition

**Generate more assets with the assets you already have.**

Instead of your USDC sitting idle in a wallet earning 0%, Caballo puts it to work in liquidity pools where it earns:
- **Trading fees** from every swap in the pool
- **Liquidity incentives** from protocols
- **Compounding returns** as earnings are reinvested

All while you maintain **full custody** of your assets through your own wallet.

---

## 🎯 How It Works

1. **Connect Your Wallet** - Non-custodial, you remain in full control
2. **Talk to Your AI Advisor** - Voice-powered conversation teaches you about DeFi
3. **Share Your Risk Tolerance** - AI recommends pools matching your profile
4. **Deposit USDC** - Funds are bridged cross-chain via Circle CCTP
5. **Earn Automatically** - Watch your position grow in real-time
6. **Rebalance Intelligently** - AI monitors markets and optimizes for you

---

## 🛠 Technology Stack

We've chosen enterprise-grade, battle-tested technologies to build a platform that's **fast, secure, and scalable**.

### Frontend & User Experience

- **[Next.js 16](https://nextjs.org/)** - React framework with server-side rendering and edge optimization for lightning-fast load times
- **[React 19](https://react.dev/)** - Latest React with concurrent features for buttery-smooth UI
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety ensures fewer bugs and better developer experience
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first styling for rapid, consistent UI development

### AI & Voice Interface

- **[OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime)** - Cutting-edge voice AI with ultra-low latency for natural conversations
- **[@openai/agents](https://www.npmjs.com/package/@openai/agents)** - Agent framework for tool calling and structured interactions
- **WebRTC** - Peer-to-peer audio streaming for real-time voice communication
- **Zod** - Runtime schema validation for safe AI tool execution

### Blockchain & Web3

- **[Thirdweb](https://thirdweb.com/)** - Production-ready Web3 SDK for wallet connectivity and blockchain interactions
- **Multi-chain Support** - Base, Arc, and EVM-compatible networks
- **Circle CCTP** - Secure, native USDC cross-chain transfers (no bridges, no wrapped tokens)

### 3D Visualization

- **[Three.js](https://threejs.org/)** - WebGL-powered 3D graphics for immersive orb animations
- **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber)** - React renderer for Three.js, making 3D declarative
- **[@react-three/drei](https://github.com/pmndrs/drei)** - Helper utilities for stunning visual effects

### Database & Backend

- **[Prisma](https://www.prisma.io/)** - Type-safe ORM for seamless database operations
- **PostgreSQL** (via Docker) - Industry-standard relational database
- **Server Actions** - Next.js server-side API for secure backend logic

### Why These Choices?

1. **Performance** - Next.js 16's edge runtime and React 19's concurrent rendering deliver sub-second interactions
2. **Security** - Type safety (TypeScript), schema validation (Zod), and Prisma's SQL injection protection
3. **Scalability** - Serverless architecture via Vercel can handle millions of users
4. **Developer Experience** - Modern tooling accelerates iteration and reduces time-to-market
5. **User Trust** - OpenAI's enterprise-grade AI + Thirdweb's audited contracts = institutional reliability

---

## 💰 Revenue Model

- **Management Fee**: 0.5% annual fee on assets under management
- **Performance Fee**: 10% of yields earned (aligned incentives)
- **Premium Features**: Advanced analytics, tax reporting, custom strategies

**With $100M AUM at conservative 15% APY:**
- Management fees: **$500K/year**
- Performance fees: **$1.5M/year**
- **Total: $2M+ annual revenue**

---

## 🎨 User Experience Highlights

### Conversational Onboarding
Users learn about liquidity pools through a friendly AI that explains concepts with **real-world analogies** (e.g., "like currency exchange booths when you travel abroad").

### Progressive Disclosure
We don't overwhelm users—information is revealed step-by-step as they're ready.

### Real-Time Feedback
Live balance tracking, animated progress steps, and a pulsing orb visualization show exactly what's happening with their money.

### Synchronized Audio Experience
Custom 70-second audio confirmation with perfectly-timed visual updates creates a premium, trustworthy feel.

---

## 🔐 Security & Trust

- **Non-Custodial**: Users maintain full control via their own wallets
- **Audited Protocols**: We only integrate with battle-tested DeFi protocols
- **Transparent**: All transactions are on-chain and verifiable
- **Circle CCTP**: Bank-grade security for cross-chain transfers

---

## 📈 Growth Strategy

### Phase 1: Product-Market Fit (Current)
- Launch MVP with Base + Arc networks
- Target early adopters and crypto-curious users
- Gather feedback and iterate rapidly

### Phase 2: Scale & Expand
- Add Ethereum, Arbitrum, Optimism, Polygon
- Integrate more liquidity pool protocols (Uniswap V4, Curve, Balancer)
- Partner with wallet providers for embedded experience

### Phase 3: Institutional
- White-label solution for banks and fintechs
- Compliance and regulatory frameworks
- Treasury management for DAOs and companies

---

## 🚀 Getting Started (Development)

### Prerequisites
- Node.js 20+
- PostgreSQL (via Docker)
- OpenAI API key
- Thirdweb API key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/caballo-money.git
cd caballo-money

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Add your OPENAI_API_KEY, THIRDWEB_CLIENT_ID, etc.

# Start PostgreSQL
docker-compose up -d

# Run database migrations
pnpm prisma migrate dev

# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Project Structure

```
caballo-money/
├── app/                    # Next.js app router
│   ├── context/           # React context providers (Agent, Transcript)
│   ├── hooks/             # Custom React hooks (WebRTC session, history)
│   ├── lib/               # Utility functions
│   └── convo/             # Conversation page
├── components/
│   └── ui/                # Reusable UI components (Agent, Orb, Button)
├── lib/
│   ├── generated/prisma/  # Prisma client & types
│   └── thirdwebClient.ts  # Web3 configuration
├── prisma/
│   └── schema.prisma      # Database schema
└── public/                # Static assets (MP3, logos)
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

---

## 📄 License

Proprietary - All Rights Reserved

---

## 📞 Contact

**Interested in investing or partnering?**

📧 Email: hello@caballo.money  
🌐 Website: [caballo.money](https://caballo.money)  
🐦 Twitter: [@CaballoMoney](https://twitter.com/caballomoney)

---

## 🌟 The Vision

**Caballo isn't just a DeFi tool—it's a movement to democratize wealth generation.**

Just as Robinhood made stock trading accessible to millions, **Caballo is making institutional-grade yield strategies accessible to everyone**—through the power of AI, voice, and seamless user experience.

The crypto sitting in wallets around the world isn't just idle—**it's unrealized potential**. We're unlocking it.

**Join us in building the future of decentralized wealth management.**

---

*Built with ❤️ by the Caballo team*
