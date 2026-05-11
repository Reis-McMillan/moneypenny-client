<script setup>
import MockChatDemo from '../components/MockChatDemo.vue'

const accounts = [
  { email: 'reis@gmail.com' },
  { email: 'reis@outlook.com' },
]

const mainScript = [
  {
    role: 'human',
    content:
      'Reply to Sarah accepting Friday at 2pm, but ask if we can move it to Zoom. I have a conflict in the office that day.',
  },
  {
    role: 'ai',
    content:
      "Here's a draft:\n\n**Subject:** Re: Friday catch-up\n\nHi Sarah,\n\nFriday at 2 works great. Any chance we could move it to Zoom? I have a conflict in the office that day, but I'd love to keep the time slot.\n\nTalk soon,\nReis\n\nWant me to send it as-is, or change anything?",
  },
  {
    role: 'human',
    content:
      "Looks good to me. Send the email."
  },
  {
    role: 'ai',
    content:
      "I've sent the email to Sarah. Is there anything else I can help you with?"
  },
  {
    role: 'human',
    switchTo: 1,
    content: "What's unread in this inbox?",
  },
  {
    role: 'ai',
    content:
      "You have **three unread messages** here:\n\n1. **Felix Leiter** — *15m ago*\n   Q3 board deck — needs your eyes before tomorrow's review.\n\n2. **Acme Legal** — *2h ago*\n   Countersigned MSA attached.\n\n3. **David Chen** (via Calendly) — *yesterday*\n   Booked a 30-min intro for Thursday at 3pm.\n\nWant me to draft replies, or open one?",
  },
]

const mcpScript = [
  {
    role: 'human',
    switchTo: 0,
    content: 'What did Mark say about the Q3 budget?',
  },
  {
    role: 'ai',
    content:
      "Mark sent two updates on the Q3 budget this month:\n\n- **Sept 12** — Marketing is tracking 18% over plan. He asked if you wanted to defer the Q4 hire.\n- **Sept 28** — Engineering is on budget. He proposed reallocating $40k from events to a new contractor.\n\nHe's waiting on your sign-off for the reallocation.",
  },
]

const searchScript = [
  { role: 'human', content: "What's open across my inboxes this week?" },
  {
    role: 'ai',
    content:
      "Five open items from this week, across both accounts:\n\n**reis@gmail.com**\n1. **Review the Q3 board deck** — John, due Friday\n2. **Sign the vendor MSA** — Legal, sent Monday\n3. **Approve the holiday party budget** — Ops, due tomorrow\n\n**reis@outlook.com**\n4. **Reply to David's intro to Acme** — pending 3 days\n5. **Reschedule dentist appointment** — sent Tuesday\n\nWant me to draft replies for any?",
  },
]
</script>

<template>
  <div class="min-h-screen bg-gray-950 text-gray-100">
    <div class="max-w-7xl mx-auto px-6 py-16 space-y-12">
      <header class="text-center space-y-4">
        <h1 class="text-5xl font-bold text-white tracking-tight">Moneypenny</h1>
        <p class="text-xl text-gray-300">
          An AI email assistant built around your identity.
        </p>
        <p class="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
          Unlike other AI email assistants, Moneypenny understands that you have multiple emails. Ditch the complexity of managing multiple inboxes — search, draft, and manage your inboxes all in one location.
        </p>
      </header>

      <section>
        <div class="flex justify-center pt-4">
          <router-link
            to="/waitlist"
            class="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
          >
            Join the waitlist
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </router-link>
        </div>
      </section>

      <section class="space-y-5">
        <div class="text-center space-y-1">
          <h2 class="text-2xl font-semibold text-white">
            All your inboxes, one chat.
          </h2>
          <p class="text-sm text-gray-400">
            Moneypenny has access to any email you authorize.
            Just tell her what you want, and she will handle the rest.
          </p>
        </div>
        <MockChatDemo :script="mainScript" :accounts="accounts" />
      </section>

      <section class="flex flex-col lg:flex-row gap-8 items-start">
        <MockChatDemo
          :script="mcpScript"
          :accounts="accounts"
          :default-account-index="1"
          :compact="true"
          class="w-full lg:w-1/2"
        />
        <div class="w-full lg:w-1/2 space-y-4">
          <h2 class="text-2xl font-semibold text-white">
            Managing your inbox shouldn't feel like a full-time job.
          </h2>
          <p class="text-sm text-gray-400">
            Moneypenny simplifies your inbox management by using a specialized
            <strong class="text-white">MCP (Model Context Protocol)</strong> server. This technology
            acts as a bridge, giving her the secure "hands" needed to manage your
            mailbox just as you would.
          </p>
          <p class="text-sm text-gray-400">
            Instead of getting bogged down in your inbox, you can delegate the heavy lifting:
          </p>
          <ul class="list-disc list-outside text-sm text-gray-400 ml-6">
            <li>
              <strong class="text-white">Smart Summaries:</strong>
              Get a quick overview of your unread messages without opening a single one.
            </li>
            <li>
              <strong class="text-white">Draft & Send:</strong>
              Moneypenny can compose professional replies or fire off new emails on your command.
            </li>
            <li>
              <strong class="text-white">Inbox Cleanup:</strong>
              Let her identify and trash the clutter so you don't have to.
            </li>
          </ul>
          <p class="text-sm text-gray-400">
            Stop scrolling through the noise. Let Moneypenny handle the logistics while you <strong class="text-white">focus on the work that actually matters</strong>.
          </p>
        </div>
      </section>

      <section class="flex flex-col lg:flex-row gap-8 items-start">
        <div class="w-full lg:w-1/2 space-y-4">
          <h2 class="text-2xl font-semibold text-white">
            Stop hunting for needles in haystacks.
          </h2>
          <p class="text-sm text-gray-400">
            As a <strong class="text-white">RAG (Retrieval-Augmented Generation)</strong> agent, Moneypenny doesn't just scan your inbox, she understands it. Think of her as a personal librarian with a perfect memory; she indexes your emails so she can pull specific facts and documents from your history instantly.
          </p>
          <p class="text-sm text-gray-400">
            Finding that HR memo from three months ago or a specific detail buried in a long thread is no longer a chore. You don't need to remember keywords or dates, <strong class="text-white">just ask Moneypenny.</strong>
          </p>
        </div>
        <MockChatDemo
          :script="searchScript"
          :accounts="accounts"
          :default-account-index="0"
          :compact="true"
          class="w-full lg:w-1/2"
        />
      </section>

      <section class="space-y-8 text-center">
        <div class="space-y-2">
          <h2 class="text-2xl font-semibold text-white">
            Works with the inbox you already use
          </h2>
          <p class="text-sm text-gray-400 max-w-xl mx-auto">
            Connect Google or Microsoft accounts in seconds — Moneypenny
            handles authentication securely via OAuth, so your password never
            touches our servers.
          </p>
        </div>
        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6"
        >
          <div
            class="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 min-w-[200px]"
          >
            <svg
              class="w-7 h-7 shrink-0"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span class="text-base font-medium text-white">Google</span>
          </div>
          <div
            class="flex items-center gap-3 bg-gray-900 border border-gray-800 rounded-xl px-6 py-4 min-w-[200px]"
          >
            <svg
              class="w-7 h-7 shrink-0"
              viewBox="0 0 23 23"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="1" y="1" width="10" height="10" fill="#F25022" />
              <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
              <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
              <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
            </svg>
            <span class="text-base font-medium text-white">Microsoft</span>
          </div>
        </div>
        <p class="text-xs text-gray-500">More providers coming soon.</p>
      </section>

      <section class="text-center space-y-5 py-8">
        <h2 class="text-3xl font-bold text-white tracking-tight">
          Ready to escape your inbox?
        </h2>
        <p class="text-base text-gray-400 max-w-md mx-auto leading-relaxed">
          Moneypenny is in private beta. Sign up now to be among the first to
          try her.
        </p>
        <div class="pt-2 flex justify-center">
          <router-link
            to="/waitlist"
            class="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-indigo-500/20"
          >
            Join the waitlist
            <svg
              class="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </router-link>
        </div>
      </section>
    </div>

    <footer class="border-t border-gray-800">
      <div
        class="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4"
      >
        <p class="text-xs text-gray-500">
          © 2026 Moneypenny. All rights reserved.
        </p>
        <nav class="flex items-center gap-6">
          <router-link
            to="/terms"
            class="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Terms of Service
          </router-link>
          <router-link
            to="/privacy"
            class="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            Privacy Policy
          </router-link>
          <router-link
            to="/ai-transparency"
            class="text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            AI Transparency
          </router-link>
        </nav>
      </div>
    </footer>
  </div>
</template>
